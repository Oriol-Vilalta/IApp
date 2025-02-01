import io
import os
import json
import shutil
import string
import zipfile
import random
import logging
from .config import DATASET_PATH

datasets = dict()


def verify_name(new_name):
    datasets_list = list(datasets.values())
    for dataset in datasets_list:
        if new_name == dataset.name:
            return False
    return True


def get_dataset_by_id(id):
    with open(os.path.join(DATASET_PATH, id, 'dataset.json'), 'r') as file:
        data = json.load(file)

    dataset = Dataset(data['name'], id)
    dataset.has_test = data['has_test']
    dataset.path = data['path']
    dataset.test_vocab = data['test_vocab']
    dataset.train_vocab = data['train_vocab']
    return dataset


def get_dataset(id):
    try:
        return datasets[id]
    except KeyError:
        return None

# START
# Load dataset data
def load_all_datasets():
    logging.info("Loading Datasets...")
    total_datasets = 0

    # Run through the datasets folder
    for dir in os.listdir(DATASET_PATH):
        datasets[dir] = get_dataset_by_id(dir)
        logging.info("-\tDataset: " + datasets[dir].name)
        total_datasets += 1

    logging.info("Loaded " + str(total_datasets) + " datasets.") 


def generate_dataset_id():
    tmp = 'D-' + ''.join([random.choice(string.ascii_letters + string.digits) for n in range(8)])
    if datasets.get(tmp) is not None:
        return generate_dataset_id()
    return tmp


def create_dataset(name):
    if verify_name(name):
        id = generate_dataset_id()
        dataset = Dataset(name, id, save_on_create=True)
        datasets[id] = dataset
        return dataset
    return None


def upload_dataset(stream):
    id = generate_dataset_id()
    path = os.path.join(DATASET_PATH, id)
    os.makedirs(path)

    it = 0
    mod = ""

    with zipfile.ZipFile(stream, 'r') as zip_file:
        zip_file.extractall(path)

        with open(os.path.join(DATASET_PATH, id, 'dataset.json'), 'r') as file:
            name = json.load(file)['name']

        while not verify_name(name + mod):
            it += 1
            mod = f" ({it})"

        datasets[id] = get_dataset_by_id(id)
        datasets[id].name = name + mod
        datasets[id].save()


def delete_dataset(id):
    try:
        dataset = datasets.pop(id)
        dataset.remove_dataset()
        return True
    except KeyError:
        return False


def upload_train_label(id, stream):
    try:
        datasets[id].upload_train(stream.read())
        return True
    except KeyError:
        return False


def upload_test_label(id, stream):
    try:
        datasets[id].upload_test(stream.read())
        return True
    except KeyError:
        return False


def delete_label(id, label):
    try:
        datasets[id].remove_label(label)
        return True
    except KeyError:
        return False


def delete_train(id):
    try:
        datasets[id].delete_train()
        return True
    except KeyError:
        return False


def delete_test(id):
    try:
        datasets[id].delete_test()
        return True
    except KeyError:
        return False


def generate_test(id, test_pct):
    try:
        datasets[id].generate_test(test_pct)
        return "Tests generated successfully", 200
    except KeyError:
        return "Dataset not found", 404


# noinspection PyTypeChecker
class Dataset:
    def __init__(self, name, id, save_on_create=False):
        self.id = id
        self.name = name
        self.has_test = False
        self.path = os.path.join(DATASET_PATH, self.id)

        self.train_vocab = []
        os.makedirs(os.path.join(self.path, "train"), exist_ok=True)

        self.test_vocab = []
        os.makedirs(os.path.join(self.path, "test"), exist_ok=True)

        if save_on_create:
            self.save()

    def to_dict(self):
        return {
            "path": self.path,
            "name": self.name,
            "id": self.id,
            "train_vocab": self.train_vocab,
            "test_vocab": self.test_vocab,
            "has_test": self.has_test
        }

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

    def upload_train(self, file):
        raw = io.BytesIO(file)
        os.makedirs(os.path.join(self.path, "train"), exist_ok=True)

        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "train"))
        self.save()

    def upload_test(self, file):
        self.has_test = True
        raw = io.BytesIO(file)
        os.makedirs(os.path.join(self.path, "test"), exist_ok=True)

        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "test"))
        self.save()

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
            self.save()

    def delete_train(self):
        path = os.path.join(self.path, "train")
        shutil.rmtree(path)
        os.makedirs(path, exist_ok=True)
        self.train_vocab = []
        self.save()

    def delete_test(self):
        path = os.path.join(self.path, "test")
        shutil.rmtree(path)
        os.makedirs(path, exist_ok=True)
        self.train_vocab = []
        self.save()

    def remove_label(self, label):
        for dir in self.train_vocab:
            if dir == label:
                self.train_vocab.remove(dir)
                shutil.rmtree(os.path.join(self.path, "train", dir))

        for dir in self.test_vocab:
            if dir == label:
                self.test_vocab.remove(dir)
                shutil.rmtree(os.path.join(self.path, "test", dir))

        self.save()

    def remove_dataset(self):
        shutil.rmtree(os.path.join(self.path))

    def gen_profile_image(self):
        if not os.path.exists(os.path.join(self.path, "profile.png")) and len(self.train_vocab) > 0:
            label = random.choice(os.listdir(os.path.join(self.path, "train")))
            image_name = random.choice(os.listdir(os.path.join(self.path, "train", label)))
            shutil.copyfile(os.path.join(self.path, "train", label, image_name), os.path.join(self.path, "profile.png"))

    def compress(self):
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:

            for root, dirs, files in os.walk(self.path):
                for file in files:
                    file_path = os.path.join(root, file)
                    zip_file.write(file_path, os.path.relpath(file_path, self.path))
        return zip_buffer.getvalue()

