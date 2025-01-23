import os
import shutil
import zipfile

from config import root, dataset_folder
from fastai.vision.all import *

datasets = dict()


def load_all_datasets():
    for directory in os.listdir(dataset_folder):
        if os.path.isdir(os.path.join(dataset_folder, directory)):
            datasets[directory] = json.load(open(os.path.join(dataset_folder, directory, 'dataset.json'), 'r'))


def create_dataset(name):
    tmp = 'D-' + ''.join([random.choice(string.ascii_letters + string.digits) for n in range(8)])

    os.makedirs(os.path.join(dataset_folder, tmp), exist_ok=True)
    default_data = {
        "path": os.path.join(dataset_folder, tmp),
        "name": name,
        "id": tmp,
        "vocab": [],
        "has_test": False
    }

    with open(os.path.join(dataset_folder, tmp, "dataset.json"), 'w') as f:
        json.dump(default_data, f, indent=4)

    datasets[tmp] = default_data


def get_item_tfms(item_tfms):
    if item_tfms["type"] == "resize":
        if item_tfms["resize-method"] == "crop":
            return Resize(item_tfms["size"], method=ResizeMethod.Crop)
        elif item_tfms["resize-method"] == "pad":
            return Resize(item_tfms["size"], method=ResizeMethod.Pad)
        elif item_tfms["resize-method"] == "squish":
            return Resize(item_tfms["size"], method=ResizeMethod.Squish)
        else:
            return Resize(item_tfms["size"], method=ResizeMethod.Crop)

    else:
        return Resize(item_tfms["size"])


def upload_to_id(id, file, type):
    dataset = datasets[id]
    raw = io.BytesIO(file)
    if type == "train":
        os.makedirs(os.path.join(self.path, "train"), exist_ok=True)
        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "train"))
    elif type == "test":
        self.has_test = True
        os.makedirs(os.path.join(self.path, "test"), exist_ok=True)
        with zipfile.ZipFile(raw) as z:
            z.extractall(os.path.join(self.path, "test"))


class Dataset:
    def __init__(self):
        self.has_test = False
        self.dls = None
        self.item_tfms = {'type': "resize", 'size': 224, 'resize-method': 'crop'}
        self.valid_pct = 0.2
        self.bs = 32
        self.seed = 42

        self.dataset = id

    def to_dict(self):
        return {
            "has_test": self.has_test,
            "item_tfms": self.item_tfms,
            "valid_pct": self.valid_pct,
            "bs": self.bs,
            "seed": self.seed,
        }

    def remove_tests(self):
        if self.has_test:
            shutil.rmtree(os.path.join(self.path, "test"))
            self.has_test = False

    def remove_train(self):
        shutil.rmtree(os.path.join(self.path, "train"))

    def remove_dataset(self):
        shutil.rmtree(self.path)
        os.makedirs(self.path, exist_ok=True)

    def to_dls(self):
        if self.dls is None and os.path.exists(self.):
            self.dls = ImageDataLoaders.from_folder(
                os.path.join(self.path),
                train="train",
                test="test",
                seed=self.seed,
                valid_pct=self.valid_pct,
                item_tfms=get_item_tfms(self.item_tfms),
                bs=self.bs
            )
        return self.dls


if __name__ == '__main__':
    create_dataset('test')
