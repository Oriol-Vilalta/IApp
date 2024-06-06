import os

from utils import uncompress

from fastai.vision.data import ImageDataLoaders
from torchvision.transforms import Resize


def process_img_tfms(config):
    if config['tfms_type'] == 'Resize':
        return Resize(config['tfms_size'])
    # TODO Add more transformations


# The dataset class will handle everything related to the dataset.
# The dataset defines how the data will be stored and
class ImageDataset:

    def __init__(self, source, config=None):
        self.config = dict()
        self.source = os.path.join(source, 'dataset')
        self.has_test = False

        self.training_directory = os.path.join(self.source, 'train')
        self.test_directory = os.path.join(self.source, 'test')

        os.makedirs(self.source, exist_ok=True)

    def change_config(self, attr, value):
        self.config[attr] = value

    def to_dls(self):
        self.dls = ImageDataLoaders.from_folder("./dataset/train",
                                                valid_pct=self.config["valid_pct"],
                                                seed=self.config["seed"],
                                                item_tfms=process_img_tfms(self.config['item_tfms'])
                                                )
        return self.dls

    @staticmethod
    def from_dict(d):
        dataset = ImageDataset(config)
        return
