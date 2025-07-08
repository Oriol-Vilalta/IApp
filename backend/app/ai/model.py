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

# Constants
RESULTS_FILE = "results.json"
MODEL_FILENAME = "model.pkl"

# models is a dictionary that holds all the models loaded in memory.
# The key is the model ID and the value is the Model object.
models = dict()

# -------------------------
# MODEL UTILITIES
# -------------------------

# Function to verify if a dataset name is unique, since model names must be unique.
def verify_name(new_name):
    models_lst = list(models.values())
    for model in models_lst:
        if new_name == model.name or new_name == "":
            return False

    return True


# Function to generate a unique dataset ID
def generate_model_id():
    tmp = ''.join([random.choice(string.ascii_letters + string.digits) for _ in range(8)])
    if models.get(tmp) is not None:
        return generate_model_id()
    return tmp

# -------------------------
# LOAD MODELS
# -------------------------

# Loads a model from the file system based on its ID.
# It reads the model's metadata from a JSON file and initializes a Model object with that data
def get_model_from_id(id):
    with open(os.path.join(MODELS_PATH, id, 'model.json'), 'r') as file:
        data = json.load(file)

    model = Model(data['name'], id)
    model.state = data['state']
    model.last_accessed = datetime.strptime(data['last_accessed'], '%Y-%m-%d %H:%M:%S')

    # The loader data is loaded from the model's metadata.
    dataset_data = data['loader']
    model.loader.item_tfms = dataset_data['item_tfms']
    model.loader.valid_pct = dataset_data['valid_pct']
    model.loader.bs = dataset_data['bs']
    model.loader.seed = dataset_data['seed']
    model.loader.dataset = get_dataset(dataset_data['dataset_id'])

    # Learner data is loaded from the model's metadata.
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


# This function loads all models from the file system into memory.
# It loads each model's metadata and initializes a Model object for each one.
def load_all_models():
    logger.info("Loading Models...")
    total_models = 0

    for dir in os.listdir(MODELS_PATH):
        total_models += 1
        models[dir] = get_model_from_id(dir)
        logger.info("-\tModel: " + models[dir].name)

    logger.info("Loaded " + str(total_models) + " models.")

# ---------------------------
# CRUD FUNCTIONS
# ---------------------------

# Function to retrieve a model by its ID from the global models dictionary
# the difference between this and get_model_from_id is that this function recalls the model from the global dictionary
def get_model(id):
    try:
        return models[id]
    except KeyError:
        return None

# Function to create a new model with a unique name.
def create_model(name):
    if verify_name(name):
        model_id = generate_model_id()
        model = Model(name, model_id, save_on_create=True)
        models[model_id] = model
        return model
    else:
        return None

# Function to upload a model from a zip file stream.
# the use of stream allows for uploading models directly from a file-like object, such as a file upload in a web application.
def upload_model(stream):
    # Generate a unique model ID and create the model directory
    model_id = generate_model_id()
    path = os.path.join(MODELS_PATH, model_id)
    os.makedirs(path, exist_ok=True)

    it = 0
    mod = ""

    # Extract the uploaded zip file into the model directory
    with zipfile.ZipFile(stream, 'r') as zf:
        zf.extractall(path)
        # Read the model name from the extracted model.json
        with open(os.path.join(MODELS_PATH, model_id, 'model.json'), 'r') as file:
            name = json.load(file)['name']
        # Ensure the model name is unique by appending a suffix if needed
        while not verify_name(name + mod):
            it += 1
            mod = f" ({it})"

        # Load the model into memory and update its name if modified
        models[model_id] = get_model_from_id(model_id)
        models[model_id].name = name + mod
        models[model_id].save()

# -----------------------------
# MODEL CLASS
# -----------------------------

# The Model class represents a machine learning model with its associated metadata and functionality.
# It includes methods for training, testing, saving, and manipulating the model's state.

class Model:
    # The constructor initializes the model with a name, ID, and optional flag to save on creation.
    def __init__(self, name, id, save_on_create=False):
        self.name = name
        self.id = id
        self.state = "NEW"

        self.path = os.path.join(MODELS_PATH, self.id)
        os.makedirs(self.path, exist_ok=True)

        self.loader = Loader()
        self.learner = PretrainedLearner(self.loader, self.path)

        self.last_accessed = datetime.now()

        # Used when creating a new model, not when loading (the start of the application).
        if save_on_create:
            self.save()

    # -----------------------
    # MODEL METADATA
    # -----------------------

    # The to_dict method initializes a Model instance from a dictionary representation.
    def to_dict(self):
        return {
            "name": self.name,
            "id": self.id,
            "state": self.state,
            "loader": self.loader.to_dict(),
            "learner": self.learner.to_dict(),
            "last_accessed": self.last_accessed.strftime('%Y-%m-%d %H:%M:%S')
        }

    # The get_data function is mostly used to retrieve the model's metadata.
    # It calls the to_dict method and updates the last accessed time.
    def get_data(self):
        self.last_accessed = datetime.now()
        self.save()
        return self.to_dict()

    # The save method saves the model's metadata to a JSON file.
    def save(self):
        self.last_accessed = datetime.now()
        json.dump(self.to_dict(), open(os.path.join(self.path, "model.json"), "w"), indent=4)

    # ---------------------------
    # COMPRESS MODEL
    # ---------------------------

    # The compress method creates a zip file of the model's directory.
    # Used to download the model as a single file file.
    def compress(self):
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for root, dirs, files in os.walk(self.path):
                for file in files:
                    file_path = os.path.join(root, file)
                    zip_file.write(file_path, os.path.relpath(file_path, self.path))
        return zip_buffer.getvalue()
    
    # ---------------------------
    # LOADER REALTTED FUNCTIONS
    # ---------------------------

    # The assign_dataset method assigns a dataset to the model's loader.
    # Additionally, it updates the model's state to "DATASET".
    def assign_dataset(self, id):
        res = self.loader.assign_dataset(id)
        self.state = "DATASET"
        self.save()
        return res
    
    # For both the loader and learner, the change_property methods allow for modifying their properties.
    # If the property is changed, the model's state is updated to "DATASET" since the model is not coherent to the metadata.
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
    
    # ---------------------------
    # LEARNER RELATED FUNCTIONS
    # ---------------------------

    # The change_learner_property method allows for modifying the learner's properties.
    # If the property is changed, the model's state is updated to "DATASET" since the trained model is not coherent to the saved metadata.
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

    # The train method trains the model using the learner.
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

    # The test method tests the model using the data of the dataset.
    # The dataset must have a test set for this to work.
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
        
    # ------------------------------
    # PREDICTION RELATED FUNCTIONS
    # ------------------------------

    # The interpret method returns the classification interpretation of the model.
    # It uses the fastai library to analyze the model's predictions and losses.
    def predict(self, img, prob_graph=False, cam=False, grad_cam=False):
        if self.state == "TRAINED":
            return self.learner.predict(img, prob_graph, cam, grad_cam, self.path)
        else:
            return "Model isn't ready to predict"

    # The get_probabilities method returns the predicted probabilities for the classes of the model.
    # plotted using a graph.
    def get_probabilities(self, img):
        if self.state == "TRAINED":
            return self.learner.predict(img)[2]
        else:
            return "Model isn't ready to predict"

    # The get_training_results method returns the training results of the model.
    def get_training_results(self):
        with open(os.path.join(self.path, RESULTS_FILE), 'r') as f:
            return json.load(f)
    
    # The heatmap method returns the gradcam heatmap for a given image.
    def heatmap(self, img, path):
        if self.state == "TRAINED":
            self.learner.create_heatmap(img, path)
        else:
            return "Model isn't ready to create heatmap"

    # ----------------------------------
    # REMOVE MODEL
    # ----------------------------------

    # The remove_model method removes the model's directory and deletes it from the global models dictionary.
    def remove_model(self):
        shutil.rmtree(self.path)
        models.pop(self.id)

    # The remove_learner method removes the learner's files from the model's directory.
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
    
    # The remove_dataset method removes the dataset files from the model's directory.
    def remove_dataset(self):
        if os.path.exists(os.path.join(MODELS_PATH, self.id, MODEL_FILENAME)):
            os.remove(os.path.join(MODELS_PATH, self.id, MODEL_FILENAME))
