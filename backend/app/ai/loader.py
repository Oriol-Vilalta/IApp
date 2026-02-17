from fastai.vision.augment import Resize
from fastai.vision.all import ResizeMethod
from fastai.vision.data import ImageDataLoaders

import os

from .dataset import get_dataset

# This class is a utility that acts as an intermediary between the dataset and the model.
# The model requires just the dls (data loaders) to be passed to it.
# This class generates the data loaders based on the datasets metadata.

# This function returns the appropriate item transformation based on the provided item_tfms dictionary.
def get_item_tfms(item_tfms):
    if item_tfms["type"] == "resize":
        if item_tfms["resize_method"] == "crop":
            return Resize(item_tfms["size"], method=ResizeMethod.Crop)
        elif item_tfms["resize_method"] == "pad":
            return Resize(item_tfms["size"], method=ResizeMethod.Pad)
        elif item_tfms[("resize_method")] == "squish":
            return Resize(item_tfms["size"], method=ResizeMethod.Squish)
    else:
        return Resize(item_tfms["size"])

# ------------------------
# LOADER CLASS
# ------------------------

# The Loader class is responsible for loading datasets and creating data loaders for training and validation.
class Loader:
    def __init__(self):
        self.dls = None
        self.item_tfms = {'type': "resize", 'size': 224, 'resize_method': 'crop'}
        self.valid_pct = 0.2
        self.bs = 32
        self.seed = 42

        self.modified = False

        self.dataset = None

    # to_dict converts the loader's properties into a dictionary format.
    # This is useful for saving the loader's configuration on a model.
    def to_dict(self):
        return {
            "item_tfms": self.item_tfms,
            "valid_pct": self.valid_pct,
            "bs": self.bs,
            "seed": self.seed,
            "dataset_id": self.get_dataset_id()
        }

    # get_dataset_id returns the ID of the dataset associated with the loader.
    def get_dataset_id(self):
        if self.dataset is None:
            return None
        else:
            return self.dataset.id

    # has_test checks if the dataset has a test vocabulary.
    def has_test(self):
        if self.dataset is None:
            return False
        if len(self.dataset.test_vocab) > 0:
            return True
        else:
            return False

    # assign_dataset assigns a dataset to the loader based on the provided ID.
    def assign_dataset(self, id):
        self.dataset = get_dataset(id)
        if self.dataset is not None:
            return True
        return False

    # to_dls creates and returns the data loaders for the dataset.
    # It checks if the data loaders already exist or if the dataset has been modified.
    def to_dls(self):
        if (self.dls is None and os.path.exists(self.dataset.path)) or self.modified:
            self.dls = ImageDataLoaders.from_folder(
                self.dataset.path,
                train="train",
                test="test",
                seed=self.seed,
                valid_pct=self.valid_pct,
                item_tfms=get_item_tfms(self.item_tfms),
                bs=self.bs,
                pin_memory=True,
                persistent_workers=True,
                num_workers=4
            )
            self.modified = False
        return self.dls
