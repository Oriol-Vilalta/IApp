import io
import os
import json
import shutil
import string
import zipfile
import random
from ..utils.logger import logger
from ..utils.config import DATASET_PATH


# This module handles dataset management, including creation, deletion, and retrieval of datasets.
# It also provides functionality for uploading training and testing labels, generating test datasets,
# and compressing datasets into zip files.

# Global dictionary to hold datasets (using dataset ID as key)
datasets = dict()

# ---------------------
# DATASET UTILITIES
# ---------------------

# Function to verify if a dataset name is unique, since a repeated name is not allowed.
def verify_name(new_name):
    datasets_list = list(datasets.values())
    for dataset in datasets_list:
        if new_name == dataset.name:
            return False
    return True


# Function to generate a unique dataset ID
# To distinguish datasets from models the id is prefixed with 'D-'
def generate_dataset_id():
    tmp = 'D-' + ''.join([random.choice(string.ascii_letters + string.digits) for n in range(8)])
    if datasets.get(tmp) is not None:
        return generate_dataset_id()
    return tmp

# -----------------
# LOAD DATASETS
# -----------------

# Function to retrieve a dataset by its ID from the filesystem
# this functions acts as a loader for the dataset, it reads the dataset.json file
def get_dataset_by_id(id):
    with open(os.path.join(DATASET_PATH, id, 'dataset.json'), 'r') as file:
        data = json.load(file)

    dataset = Dataset(data['name'], id)
    dataset.has_test = data['has_test']
    dataset.has_test_used_training_data = data['has_test_used_training_data']
    dataset.path = data['path']
    dataset.test_vocab = data['test_vocab']
    dataset.train_vocab = data['train_vocab']
    return dataset


# This function loads all the datasets from the DATASET_PATH directory into the global datasets dictionary.
# It loads the dataset metadata from the dataset.json, this function does't load the actual dataset images.
def load_all_datasets():
    logger.info("Loading Datasets...")
    total_datasets = 0

    # Run through the datasets folder
    for dir in os.listdir(DATASET_PATH):
        datasets[dir] = get_dataset_by_id(dir)
        logger.info("-\tDataset: " + datasets[dir].name)
        total_datasets += 1

    logger.info("Loaded " + str(total_datasets) + " datasets.") 

# -----------------
# CRUD FUNCTIONS
# -----------------

# Function to retrieve a dataset by its ID from the global datasets dictionary
# the difference between this and get_dataset_by_id is that this function recalls the dataset from the global dictionary
def get_dataset(id):
    try:
        return datasets[id]
    except KeyError:
        return None


# Function to create a new dataset with a given name
def create_dataset(name):
    if verify_name(name):
        id = generate_dataset_id()
        dataset = Dataset(name, id, save_on_create=True)
        datasets[id] = dataset
        return dataset
    return None

# Function to upload a dataset from a zip file stream
# the use of stream allows for direct upload without saving the file to disk first
def upload_dataset(stream):
    id = generate_dataset_id()
    path = os.path.join(DATASET_PATH, id)
    os.makedirs(path)

    # Initialize variables for name modification in case of duplicates
    it = 0
    mod = ""

    # Extract the uploaded zip file to the dataset path
    with zipfile.ZipFile(stream, 'r') as zip_file:
        zip_file.extractall(path)

        # Read the dataset name from the extracted dataset.json
        with open(os.path.join(DATASET_PATH, id, 'dataset.json'), 'r') as file:
            name = json.load(file)['name']

        # Ensure the dataset name is unique by appending a suffix if needed
        while not verify_name(name + mod):
            it += 1
            mod = f" ({it})"

        # Load the dataset into the global dictionary and update its name/path
        datasets[id] = get_dataset_by_id(id)
        datasets[id].name = name + mod
        datasets[id].path = path
        datasets[id].save()


# Delete a dataset by its ID
# This function removes the dataset from the global dictionary and deletes its directory from the filesystem
def delete_dataset(id):
    try:
        dataset = datasets.pop(id)
        dataset.remove_dataset()
        return True
    except KeyError:
        return False

# -----------------
# LABEL FUNCTIONS
# -----------------

# Label is a term used to refer to the categories or classes in a dataset.

# This function adds a new label to the dataset with the given ID using a stream again.
def upload_train_label(id, stream):
    try:
        datasets[id].upload_train(stream.read())
        return True
    except KeyError:
        return False


# This function uploads a test label to the dataset with the given ID.
def upload_test_label(id, stream):
    try:
        datasets[id].upload_test(stream.read())
        return True
    except KeyError:
        return False


# This function removes the label from the dataset with the given ID.
def delete_label(id, label):
    try:
        datasets[id].remove_label(label)
        return True
    except KeyError:
        return False

# ---------------------
# DELETE TRAIN/TEST FUNCTIONS
# ---------------------

# This function deletes the training data from the dataset with the given ID.
def delete_train(id):
    try:
        datasets[id].delete_train()
        return True
    except KeyError:
        return False


# This function deletes the test data from the dataset with the given ID.
def delete_test(id):
    try:
        datasets[id].delete_test()
        return True
    except KeyError:
        return False

# -----------------------
# GENERATE TEST
# -----------------------

# The generate_test function creates a test dataset from the training data of the specified dataset.
# This functions makes easier to create a test dataset when the user doesn't have a test dataset available.
def generate_test(id, test_pct):
    try:
        datasets[id].generate_test(test_pct)
        return "Tests generated successfully", 200
    except KeyError:
        return "Dataset not found", 404


# ---------------------
# DATASET CLASS
# ---------------------

# This class represents a dataset and provides methods for managing it, including uploading training and testing data.

# noinspection PyTypeChecker
class Dataset:
    # The constructor initializes the dataset with a name, ID, and optional save_on_create flag.
    def __init__(self, name, id, save_on_create=False):
        self.id = id
        self.name = name
        self.has_test = False
        self.has_test_used_training_data = False
        self.path = os.path.join(DATASET_PATH, self.id)

        self.train_vocab = []
        os.makedirs(os.path.join(self.path, "train"), exist_ok=True)

        self.test_vocab = []
        os.makedirs(os.path.join(self.path, "test"), exist_ok=True)

        # Used when creating a new dataset, not when loading (the start of the application).
        if save_on_create:
            self.save()
    
    # -------------------------
    # DATASET METADATA FUNCTIONS
    # -------------------------

    # To dict is a method that saves the dataset metadata to a dictionary format.
    # This will be used to save the dataset to a JSON file.
    def to_dict(self):
        return {
            "path": self.path,
            "name": self.name,
            "id": self.id,
            "train_vocab": self.train_vocab,
            "test_vocab": self.test_vocab,
            "has_test": self.has_test,
            "has_test_used_training_data": self.has_test_used_training_data
        }

    # The save method saves the dataset metadata to a JSON file.
    # his method also updates the train and test vocabulary lists by reading the directories.
    def save(self):
        self.train_vocab = []
        if os.path.exists(os.path.join(self.path, "train")):
            for dir in os.listdir(os.path.join(self.path, "train")):
                self.train_vocab.append(dir)

        self.test_vocab = []
        if os.path.exists(os.path.join(self.path, "test")):
            for dir in os.listdir(os.path.join(self.path, "test")):
                self.test_vocab.append(dir)

        with open(os.path.join(DATASET_PATH, self.id, "dataset.json"), 'w') as f:
            json.dump(self.to_dict(), f, indent=4)

    # ------------------------
    # UPLOAD FUNCTIONS
    # ------------------------

    # The upload_train method uploads a training dataset from a zip file stream.
    def upload_train(self, file):
        raw = io.BytesIO(file)
        os.makedirs(os.path.join(self.path, "train"), exist_ok=True)

        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "train"))
        self.save()

    # The upload_test method uploads a test dataset from a zip file stream.
    def upload_test(self, file):
        self.has_test = True
        raw = io.BytesIO(file)
        os.makedirs(os.path.join(self.path, "test"), exist_ok=True)

        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "test"))
        self.save()

    # -----------------------
    # GENERATE TEST FUNCTION
    # -----------------------

    # The generate_test method creates a test dataset from the training data.
    def generate_test(self, test_pct):
        test_path = os.path.join(self.path, "test")
        train_path = os.path.join(self.path, "train")

        for label in self.train_vocab:
            os.makedirs(os.path.join(test_path, label), exist_ok=True)

            images = os.listdir(os.path.join(train_path, label))
            random.shuffle(images)

            total_images = len(images)
            images = images[:int(total_images * test_pct)]

            for image in images:
                os.rename(os.path.join(train_path, label, image), os.path.join(test_path, label, image))

            self.has_test = True
            self.has_test_used_training_data = True
            self.save()

    # -----------------------
    # DELETE FUNCTIONS
    # -----------------------

    # The delete_train method deletes the training dataset directory and resets the training vocabulary.
    def delete_train(self):
        path = os.path.join(self.path, "train")
        shutil.rmtree(path)
        os.makedirs(path, exist_ok=True)
        self.train_vocab = []
        self.save()

    # The delete_test method deletes the testing dataset directory and resets the testing vocabulary.
    def delete_test(self):
        path = os.path.join(self.path, "test")
        shutil.rmtree(path)
        os.makedirs(path, exist_ok=True)
        self.train_vocab = []
        self.has_test_used_training_data = False
        self.save()

    # The remove_label method removes a label from both the training and testing datasets.
    def remove_label(self, label):
        for dir in self.train_vocab:
            if dir == label:
                self.train_vocab.remove(dir)
                shutil.rmtree(os.path.join(self.path, "train", dir))

        for dir in self.test_vocab:
            if dir == label:
                self.test_vocab.remove(dir)
                shutil.rmtree(os.path.join(self.path, "test", dir))

        if self.test_vocab == 0:
            self.has_test_used_training_data = False
            self.has_test = False
        
        self.save()

    # The remove_dataset method deletes the entire dataset directory from the filesystem.
    def remove_dataset(self):
        shutil.rmtree(os.path.join(self.path))

    # ------------------------
    # RECALL IMAGE FUNCTION
    # ------------------------

    # The get_first_image_name method retrieves the first image name from a given label in the specified mode (train/test).
    def get_first_image_name(self, label, mode="train"):
        if self.path is None or label is None or mode is None:
            return None
        dir_path = os.path.join(self.path, mode, label)
        if os.path.exists(dir_path):
            images = os.listdir(dir_path)
            if images:
                return os.path.join(dir_path, images[0])
        return None
    
    # ------------------------
    # COMPRESS DATASET
    # ------------------------

    # The compress method creates a zip file of the dataset directory.
    # This method is useful for downloading the dataset as a single file.
    def compress(self):
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:

            for root, dirs, files in os.walk(self.path):
                for file in files:
                    file_path = os.path.join(root, file)
                    zip_file.write(file_path, os.path.relpath(file_path, self.path))
        return zip_buffer.getvalue()

