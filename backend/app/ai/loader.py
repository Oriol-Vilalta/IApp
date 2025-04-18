from fastai.vision.augment import Resize
from fastai.data.transforms import ResizeMethod
from fastai.vision.data import ImageDataLoaders

import os

from .dataset import get_dataset



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


class Loader:
    def __init__(self):
        self.dls = None
        self.item_tfms = {'type': "resize", 'size': 224, 'resize_method': 'crop'}
        self.valid_pct = 0.2
        self.bs = 32
        self.seed = 42

        self.modified = False

        self.dataset = None

    def to_dict(self):
        return {
            "item_tfms": self.item_tfms,
            "valid_pct": self.valid_pct,
            "bs": self.bs,
            "seed": self.seed,
            "dataset_id": self.get_dataset_id()
        }

    def get_dataset_id(self):
        if self.dataset is None:
            return None
        else:
            return self.dataset.id

    def has_test(self):
        if self.dataset is None:
            return False
        if len(self.dataset.test_vocab) > 0:
            return True
        else:
            return False

    def assign_dataset(self, id):
        self.dataset = get_dataset(id)
        if self.dataset is not None:
            return True
        return False

    def to_dls(self):
        if (self.dls is None and os.path.exists(self.dataset.path)) or self.modified:
            self.dls = ImageDataLoaders.from_folder(
                self.dataset.path,
                train="train",
                test="test",
                seed=self.seed,
                valid_pct=self.valid_pct,
                item_tfms=get_item_tfms(self.item_tfms),
                bs=self.bs
            )
            self.modified = False
        return self.dls
