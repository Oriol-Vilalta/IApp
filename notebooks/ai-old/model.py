from config import *
from utils.uncompress import uncompress_file
from dataset import ImageDataset
from learner import ImageLearner
from fastai.vision.all import *

import os
import json
import random
import string
import shutil
import datetime

# All the models will be stored here.
models = []


# Loads every model from the data directory
def load_models():
    global models
    print("Loading models...")
    for directory in os.listdir(DATA_DIR):
        if os.path.isdir(f"{DATA_DIR}/{directory}") and directory != '.tmp':  # Ignore the temporal folder
            models.append(Model.load_model(f"{DATA_DIR}/{directory}"))
    print(f"Loaded {len(models)} models.")


# Generates an unused ID, the ID's len can be modified in the config.py file
def new_id():
    tmp = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(ID_LEN)])

    # If the ID already exists in the system.
    # It is almost impossible to get a used ID but if it happens
    # another will be randomly calculated.
    for model in models:
        if model.id == tmp:
            return new_id()

    return tmp


# This will generate the root dir for the model, that way all
# the information related to the model will be saved in a
# non-volatile way.
def generate_file_system(id):
    try:
        # Creates the directory
        addr = f"{DATA_DIR}/{id}"
        os.makedirs(addr)

        # Creates the config.json file and fills it with the default configuration
        with open(addr + "/config.json", 'w') as config_file:
            json.dump(DEFAULT_CONFIG, config_file, indent=4)

    except FileExistsError:
        # This error isn't supposed to be called
        print(f"Directory {id} already exists")


# Checks if the name entered is already in use
def verify_name(name, origin):
    for model in models:
        if model.name == name and origin != model:
            return False  # Name already in use
    return True  # Name not used







# The Model will represent an AI model that will contain all
# the information used throughout its training and the learner.
class Model:

    # The id will be a permanent value that represents the model.
    # It is similar to the name but the id will be used for request
    # purposes and to identify the model's directory.
    # Like http://localhost:5000/models/U9XQnZRNjz

    # On the other hand, the name can be changed but cannot be repeated,
    # identifies a more intuitive way. The name should relate to the objective
    # of the dataset.

    def __init__(self, id, name, state):
        self.id = id
        self.name = name
        self.state = state

        # The configuration is the dictionary that will contain every
        # all the data related to the model.
        # TODO Uploaded

        if state == "NEW":
            self.config = dict()

            self.config["name"] = name
            self.config["id"] = id
            self.config["state"] = state
            self.config["creation_date"] = datetime.datetime.now().strftime("%Y-%m-%d")

            self.dataset = ImageDataset(os.path.join(DATA_DIR, self.id))
            # self.learner = ImageLearner(os.path.join(DATA_DIR, self.id), self.dataset)
            self.config["dataset"] = self.dataset.config
            # self.config["model"] = self.learner.config

            self.save_config()

        if state == "READY":
            self.config = dict()  # This value will be substituted when loaded.

        if state == "TRAINED":
            self.config = dict()
            self.dataset = ImageDataset(os.path.join(DATA_DIR, self.id))
            self.config["dataset"] = self.dataset.config
            # self.learner = load_learner(os.path.join(DATA_DIR, self.id, "model.pkl"))



    # For the name changing function we require to verify if the name it's
    # not repeated, if this condition is fulfilled the name can be changed
    # successfully. Returns True if it has changed
    def change_name(self, new_name):
        if verify_name(new_name, self):
            self.change_config("name", new_name)
            return True
        return False

    # To ease the process of changing the configuration and saving the changes.
    # All the modifications to the configuration will be made by this function.
    # This will prevent unsaved configuration to get lost by saving them at the
    # moment.
    def change_config(self, attr, value):
        self.config[attr] = value
        self.save_config()

    # Change id is supposed to not be changed. But there is an exception, when
    # a model is imported there is a chance that the id might be repeated.
    # so assigning a new id will prevent a repeated id from
    def change_id(self, new_id):
        self.id = new_id
        self.save_config()

    # Saves the config file into the config.json
    def save_config(self):
        with open(os.path.join(DATA_DIR, self.id, "config.json"), 'w') as config_file:
            json.dump(self.to_json(), config_file, indent=4)

    # The to_json() method returns the configuration on an intuitive way.
    def to_json(self):
        if self.dataset:
            self.config["dataset"] = self.dataset.to_json()
            # TODO Acabar codificacio del dataset
        return self.config

    # In order to download a model we will need to transform the model from
    def compress(self, extension):
        result = os.path.join(DATA_DIR, ".tmp", self.name.replace(" ", "_"))
        shutil.make_archive(result, extension, os.path.join(DATA_DIR, self.id))

        return result + "." + extension


    def train(self):
        if self.state == "READY":
            return True
        else:
            return False



    # To create a new Model from scratch, the new_model() method has to be used.
    # Generates a unique id and assigns the name to the new Model. It also
    # creates the file system for the Model.

    # Returns the model if the name isn't used or None if the name is already
    # in use.
    @staticmethod
    def new_model(name):
        if verify_name(name, None):  # If the name is not used
            # Creates the variables
            id, name = new_id(), name

            # Generates the file system
            generate_file_system(id)

            # Create the model
            print(f"Created model: id-> {id}; name-> {name}")
            return Model(id, name, "NEW")

        else:  # If the names are used
            print(f"Model {name} already exists")
            return None

    # On the other hand, a model can also be created by loading the model
    @staticmethod
    def load_model(path, new_id=None):
        try:
            # Load the configuration file
            with open(f"{path}/config.json", "r") as config_file:
                config = json.load(config_file)

            # Create the model
            if new_id:
                print(f"Uploaded: {new_id}")
                model = Model(new_id, "UP:" + config['name'], "UPLOADED")
                # TODO Verify name
            else:
                model = Model(config['id'], config['name'], config['state'])
            model.config = config

            print(f"Loaded model: id-> {config['id']}; name-> {config['name']}")
            return model
        except FileNotFoundError:
            # The path should always exist
            print(f"Path does not exist: {path}")


# To ease the search of model by id.
def get_model_by_id(id):
    for model in models:
        if model.id == id:
            return model


# To create a model just the name is needed, after creation, return
# the model's data.
def create_model(name):
    model = Model.new_model(name)
    if model:
        models.append(model)
        return model
    else:
        return None


# To delete correctly a model we have to delete the directory and
# remove it from the model list.
def delete_model(id):
    try:
        shutil.rmtree(f"{DATA_DIR}/{id}")  # Remove the directory

        # Remove the model from the list
        model = get_model_by_id(id)
        models.remove(model)

        print(f"Deleted model: {id}")
        return True

    except FileNotFoundError:
        print("The directory does not exist")
        return False


# The changing name feature will allow everyone to go.
def change_name(id, new_name):
    return get_model_by_id(id).change_name(new_name)


# Upload a whole dataset into the model.
def upload_dataset(id, file):
    model = get_model_by_id(id)

    if model:
        model.upload_dataset(file)
    else:
        return None


# A main feature of the application is to be able to upload
# a model.
def upload_model(file):
    # TODO Inacabat
    compressed_file_addr = os.path.join(DATA_DIR, ".tmp", file.filename)
    file.save(compressed_file_addr)
    id = new_id()

    uncompress_file(compressed_file_addr, f"{DATA_DIR}/{id}")

    model = Model.load_model(os.path.join(DATA_DIR, id), id)
    model.change_id(id)  # TODO Improve this
    models.append(model)
