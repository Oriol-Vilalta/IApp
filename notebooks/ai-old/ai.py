import string
import random
import os

from backend.app.ai.config import data_folder, dataset_folder
from backend.app.ai.model import Model
from backend.app.ai.uploader import get_model_from_id

models = dict()


def generate_id():
    tmp = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(8)])
    if models.get(tmp) is not None:
        return generate_id()
    return tmp


def verify_name(new_name):
    models_lst = models_to_list()
    for model in models_lst:
        if new_name == model.name:
            return False

    return True


def load_all_models():
    for directory in os.listdir(data_folder):
        if os.path.isdir(os.path.join(data_folder, directory)):
            models[directory] = get_model_from_id(directory)



def new_model(name):
    if verify_name(name):
        model = Model(name, generate_id(), save_on_create=True)
        models[model.id] = model
        return model


def get_model_by_id(id):
    try:
        return models[id]
    except KeyError:
        return None


def models_to_list():
    return list(models.values())


def delete_model(id):
    model = get_model_by_id(id)
    if model.state != 'IN_TRAINING':
        model.remove_model()
        models.pop(id)
        return True
    else:
        return False


def change_name(model, name):
    if verify_name(name):
        model.name = name
        model.save()
        return True
    else:
        return False


learner_props = ["epoch", "lr", "arch"]
dataset_props = ["seed", "valid_pct", "item_tfms", "bs"]


def change_model_property(model, prop, value):
    if prop in learner_props:
        model.change_learner_property(prop, value)
        return True
    if prop in dataset_props:
        model.change_dataset_property(prop, value)
        return True
    return False


def upload_model(file):
    id = generate_id()

    file.save()
