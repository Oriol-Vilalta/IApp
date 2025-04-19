from fastai.interpret import ClassificationInterpretation


from ..utils.logger import logger
from .dataset import get_dataset
from .loader import Loader
from .learner import PretrainedLearner
from ..utils.config import MODELS_PATH

import zipfile
import os
import io
import json
import string
import random
import shutil
from datetime import datetime

models = dict()

RESULTS_FILE = "results.json"
MODEL_FILENAME = "model.pkl"


def get_model_from_id(id):
    with open(os.path.join(MODELS_PATH, id, 'model.json'), 'r') as file:
        data = json.load(file)

    model = Model(data['name'], id)
    model.state = data['state']
    model.last_accessed = datetime.strptime(data['last_accessed'], '%Y-%m-%d %H:%M:%S')

    dataset_data = data['loader']
    model.loader.item_tfms = dataset_data['item_tfms']
    model.loader.valid_pct = dataset_data['valid_pct']
    model.loader.bs = dataset_data['bs']
    model.loader.seed = dataset_data['seed']
    model.loader.dataset = get_dataset(dataset_data['dataset_id'])


    learner_data = data['learner']
    model.learner.type = learner_data['type']
    model.learner.epoch = learner_data['epoch']
    model.learner.lr = learner_data['lr']
    model.learner.arch = learner_data['arch']
    model.learner.training_time = learner_data['training_time']
    model.learner.learner_exists = learner_data['learner_exists']
    model.learner.test_accuracy = learner_data['test_accuracy']
    model.learner.test_loss = learner_data['test_loss']

    return model


def verify_name(new_name):
    models_lst = list(models.values())
    for model in models_lst:
        if new_name == model.name or new_name == "":
            return False

    return True


def generate_model_id():
    tmp = ''.join([random.choice(string.ascii_letters + string.digits) for _ in range(8)])
    if models.get(tmp) is not None:
        return generate_model_id()
    return tmp

# START
# Load model data
def load_all_models():
    logger.info("Loading Models...")
    total_models = 0

    for dir in os.listdir(MODELS_PATH):
        models[dir] = get_model_from_id(dir)
        logger.info("-\tModel: " + models[dir].name)

    logger.info("Loaded " + str(total_models) + " models.")


def get_model(id):
    try:
        return models[id]
    except KeyError:
        return None


def create_model(name):

    if verify_name(name):
        model_id = generate_model_id()
        model = Model(name, model_id, save_on_create=True)
        models[model_id] = model
        return model
    else:
        return None


def change_name(id, new_name):
    if verify_name(new_name):
        model = get_model(id)
        if model:
            model.name = new_name
            model.save()
            return "Model's name changed", 200
        else:
            return "Model not found", 404
    else:
        return "Name already in use", 400


def upload_model(stream):
    model_id = generate_model_id()
    path = os.path.join(MODELS_PATH, model_id)
    os.makedirs(path, exist_ok=True)

    it = 0
    mod = ""

    with zipfile.ZipFile(stream, 'r') as zf:
        zf.extractall(path)
        with open(os.path.join(MODELS_PATH, id, 'model.json'), 'r') as file:
            name = json.load(file)['name']
        while not verify_name(name + mod):
            it += 1
            mod = f" ({it})"

        models[id] = get_model_from_id(id)
        models[id].name = name + mod
        models[id].save()


class Model:
    def __init__(self, name, id, save_on_create=False):
        self.name = name
        self.id = id
        self.state = "NEW"

        self.path = os.path.join(MODELS_PATH, self.id)
        os.makedirs(self.path, exist_ok=True)

        self.loader = Loader()
        self.learner = PretrainedLearner(self.loader, self.path)

        self.last_accessed = datetime.now()

        if save_on_create:
            self.save()

    def to_dict(self):
        return {
            "name": self.name,
            "id": self.id,
            "state": self.state,
            "loader": self.loader.to_dict(),
            "learner": self.learner.to_dict(),
            "last_accessed": self.last_accessed.strftime('%Y-%m-%d %H:%M:%S')
        }

    def get_data(self):
        self.last_accessed = datetime.now()
        self.save()
        return self.to_dict()

    def save(self):
        self.last_accessed = datetime.now()
        json.dump(self.to_dict(), open(os.path.join(self.path, "model.json"), "w"), indent=4)

    def compress(self):
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for root, dirs, files in os.walk(self.path):
                for file in files:
                    file_path = os.path.join(root, file)
                    zip_file.write(file_path, os.path.relpath(file_path, self.path))
        return zip_buffer.getvalue()

    def assign_dataset(self, id):
        res = self.loader.assign_dataset(id)
        self.state = "DATASET"
        self.save()
        return res

    def train(self):
        if self.state == "DATASET":
            self.state = "IN_TRAINING"
            self.learner.train()
            if self.state == "IN_TRAINING":
                self.state = "TRAINED"

        elif self.state == "NEW":
            return "Dataset not loaded yet. Load data to start training."
        elif self.state == "TRAINED":
            return "Model already trained."
        self.save()


    def test(self):
        if self.state == "TRAINED" and self.loader.has_test():
            self.learner.test()
            self.save()
            return self.learner.test_accuracy, self.learner.test_loss
        elif self.state == "NEW":
            return "Dataset not loaded yet. Load data to start testing."
        elif self.state == "DATASET":
            return "Model not trained yet. Train the model."
        elif not self.loader.has_test():
            return "The model doesn't have a test set."
        else:
            return "UNKNOWN STATE"

    def generate_confusion_matrix(self):
        if self.state == "TRAINED":
            interp = ClassificationInterpretation.from_learner(self.learner.learner)
            interp.plot_confusion_matrix(figsize=(7, 7), dpi=80)

    def predict(self, img, prob_graph=False, cam=False, grad_cam=False):
        if self.state == "TRAINED":
            return self.learner.predict(img, prob_graph, cam, grad_cam, self.path)
        else:
            return "Model isn't ready to predict"

    def get_probabilities(self, img):
        if self.state == "TRAINED":
            return self.learner.predict(img)[2]
        else:
            return "Model isn't ready to predict"

    def get_training_results(self):
        with open(os.path.join(self.path, RESULTS_FILE), 'r') as f:
            return json.load(f)

    def change_learner_property(self, prop, value):
        changed = False
        if prop == "epoch" and isinstance(value, int):
            self.learner.epoch = value
            changed = True
        elif prop == "lr" and isinstance(value, float):
            self.learner.lr = value
            changed = True
        elif prop == "arch" and isinstance(value, str):
            self.learner.arch = value
            changed = True

        if changed and (self.state == "TRAINED" or self.state == "IN_TRAINING"):
            self.state = "DATASET"
        self.save()
        return changed

    def change_loader_property(self, prop, value):
        changed = False

        if prop == "seed" and isinstance(value, int):
            self.loader.seed = value
            changed = True
        elif prop == "valid_pct" and isinstance(value, float):
            self.loader.valid_pct = value
            changed = True
        elif prop == "item_tfms" and isinstance(value, dict):
            self.loader.item_tfms = value
            changed = True
        elif prop == "bs" and isinstance(value, int):
            self.loader.bs = value
            changed = True

        if changed:
            if self.state == "TRAINED" or self.state == "IN_TRAINING":
                self.state = "DATASET"
            self.loader.modified = True
        self.save()
        return changed

    def remove_model(self):
        shutil.rmtree(self.path)
        models.pop(self.id)

    def remove_learner(self):
        if os.path.exists(os.path.join(self.path, MODEL_FILENAME)):
            os.remove(os.path.join(self.path, MODEL_FILENAME))
        if os.path.exists(os.path.join(self.path, "heatmap.png")):
            os.remove(os.path.join(self.path, "model.png"))
        if os.path.exists(os.path.join(self.path, "grad-cam.png")):
            os.remove(os.path.join(self.path, "grad-cam.png"))
        if os.path.exists(os.path.join(self.path, "prob_graph.png")):
            os.remove(os.path.join(self.path, "prob_graph.png"))
        if os.path.exists(os.path.join(self.path, RESULTS_FILE)):
            os.remove(os.path.join(self.path, RESULTS_FILE))

        self.state = "DATASET"
        self.learner = PretrainedLearner(self.loader, self.path)
        self.save()

    def remove_dataset(self):
        if os.path.exists(os.path.join(MODELS_PATH, self.id, MODEL_FILENAME)):
            os.remove(os.path.join(MODELS_PATH, self.id, MODEL_FILENAME))
