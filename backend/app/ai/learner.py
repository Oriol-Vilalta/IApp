from torchvision.models.resnet import resnet18, resnet34, resnet50, resnet101, resnet152
from torchvision.models.densenet import densenet121, densenet161, densenet169, densenet201
from torchvision.models.efficientnet import efficientnet_b0, efficientnet_b1, efficientnet_b2, efficientnet_b3, efficientnet_b4, efficientnet_b5, efficientnet_b6, efficientnet_b7
from torchvision.models.vgg import vgg16, vgg19, vgg16_bn, vgg19_bn
from torchvision.models.alexnet import alexnet
from torchvision.models.googlenet import googlenet

from torch.nn.functional import cross_entropy

from fastai.callback.core import Callback
from fastai.learner import load_learner
from fastai.data.transforms import get_image_files
from fastai.vision.learner import vision_learner, accuracy, error_rate

import threading
import json
import os

from datetime import datetime
from ..utils.config import MODELS_PATH
from .visualitzer import grad_cam, heatmap_cam, get_prob_graph

# This file contains the PretrainedLearner class which is used to train and test pretrained models.
# It also contains utility functions to convert model names to actual architectures.

# --------------------
# CONVERT NAME TO ARCHITECTURE
# --------------------

# This function converts a string representation of a ResNet architecture to the actual model.
def resnet_from_str(str):
    if str == "resnet18":
        return resnet18
    elif str == "resnet34":
        return resnet34
    elif str == "resnet50":
        return resnet50
    elif str == "resnet101":
        return resnet101
    elif str == "resnet152":
        return resnet152
    else:
        return resnet50


# This function converts a string representation of a DenseNet architecture to the actual model.
def densenet_from_str(str):
    if str == "densenet121":
        return densenet121
    elif str == "densenet161":
        return densenet161
    elif str == "densenet169":
        return densenet169
    elif str == "densenet201":
        return densenet201
    return densenet161


# This function converts a string representation of an EfficientNet architecture to the actual model.
def efficientnet_from_str(str):
    if str == "efficientNet_b0":
        return efficientnet_b0
    elif str == "efficientNet_b1":
        return efficientnet_b1
    elif str == "efficientNet_b2":
        return efficientnet_b2
    elif str == "efficientNet_b3":
        return efficientnet_b3
    elif str == "efficientNet_b4":
        return efficientnet_b4
    elif str == "efficientNet_b5":
        return efficientnet_b5
    elif str == "efficientNet_b6":
        return efficientnet_b6
    elif str == "efficientNet_b7":
        return efficientnet_b7
    else:
        return efficientnet_b4


# This function converts a string representation of a VGG architecture to the actual model.
def vgg_from_str(str):
    if str == "vgg16":
        return vgg16
    elif str == "vgg19":
        return vgg19
    elif str == "vgg16_bn":
        return vgg16_bn
    elif str == "vgg19_bn":
        return vgg19_bn
    else:
        return vgg19


# This function converts a string representation of an architecture to the actual model.
def arch_from_str(str):
    if str.startswith("resnet"):
        return resnet_from_str(str)
    elif str.startswith("densenet"):
        return densenet_from_str(str)
    elif str == "googLeNet":
        return googlenet
    elif str.startswith("efficientnet"):
        return efficientnet_from_str(str)
    elif str.startswith("vgg"):
        return vgg_from_str(str)
    elif str == "alexnet":
        return alexnet
    else:
        return resnet50
    
# --------------------
# CALLBACKS
# --------------------

# UNUSED CALLBACK
# This callback is used to track the time taken for training and each epoch.
# It also tracks the number of images processed.
class TimeCallback(Callback):
    def before_fit(self):
        self.start_time = datetime.now()
        self.epoch_start_time = None
        self.epoch_times = []
        self.lock_tmp = threading.Lock()
        self.image = 0

    def before_epoch(self):
        self.epoch_start_time = datetime.now()

    def after_batch(self):
        self.lock_tmp.acquire()
        try:
            self.image += 1
        finally:
            self.lock_tmp.release()

    def get_remaining_time(self):
        self.lock_tmp.acquire()
        try:
            time_left = self.image
        finally:
            self.lock_tmp.release()
        return time_left


# This callback is used to track the results of each epoch during training.
# It saves the results to a JSON file after training is complete.
class TrackResultsCallback(Callback):
    def __init__(self, filepath):
        super().__init__()
        self.filepath = filepath
        self.met = []
        self.epoch_cnt = 0

    # The after_fit method is called after each epoch during training.
    # It collects the results from the recorder and appends them to the metrics list.
    def after_fit(self):
        for epoch_res in self.learn.recorder.values:
            self.met.append(dict({
                "epoch": self.epoch_cnt,
                "train_loss": epoch_res[0],
                "valid_loss": epoch_res[1],
                "accuracy": epoch_res[2],
                "error_rate": epoch_res[3]
            }))
            self.epoch_cnt += 1
        json.dump(self.met, open(self.filepath, "w"), indent=4)

# ----------------------
# PRETRAINED LEARNER CLASS
# ----------------------
# The PretrainedLearner class is responsible for training and testing pretrained models.

class PretrainedLearner:
    def __init__(self, dataset, path, epoch=1, lr=1e-2, arch="resnet50"):
        
        self.loader = dataset
        self.path = path
        self.epoch = epoch
        self.lr = lr
        self.arch = arch

        self.learner = None
        self.learner_exists = False
        self.training_time = None

        self.test_accuracy = None
        self.test_loss = None

        self.metrics_callback = TrackResultsCallback(os.path.join(self.path, "results.json"))

        self.path = os.path.join(self.path, "model.pkl")


    # The train method initializes the learner with the specified architecture and trains it using the provided dataset.
    # It uses the fastai library's vision_learner to create a learner object and trains it for the specified number of epochs.
    # The training time is recorded and the model is exported to the specified path.
    def train(self):
        self.learner = vision_learner(self.loader.to_dls(), arch_from_str(self.arch), metrics=[accuracy, error_rate])

        self.training_time = datetime.now()
        self.learner.fine_tune(self.epoch, base_lr=self.lr, cbs=[self.metrics_callback])
        self.training_time = str(datetime.now() - self.training_time)

        self.export()
        self.learner_exists = True

    # The test method loads the learner and evaluates it on the test dataset if available.
    # It calculates the accuracy and loss on the test set and stores them in the instance variables
    def test(self):
        self.load()
        if self.loader.has_test():
            images = get_image_files(os.path.join(self.loader.dataset.path, "test"))
            test_dl = self.learner.dls.test_dl(images, with_labels=True)
            pred, targ = self.learner.get_preds(dl=test_dl)

            # Set accuracy and loss on the test set
            self.test_accuracy = accuracy(pred, targ).item()
            self.test_loss = cross_entropy(pred, targ).item()
        else:
            return None

    # The export method saves the trained learner to the specified path.
    # This method is called after training to save the model for future use.
    def export(self):
        self.learner.export(os.path.join(self.path))

    # The load method loads the learner from the specified path if it exists.
    def load(self):
        if not self.learner and self.learner_exists:
            self.learner = load_learner(self.path)

    # The remove_learner method deletes the learner file from the specified path and sets the learner to None.
    def remove_learner(self):
        if os.path.exists(self.path):
            os.remove(os.path.join(self.path))
        self.learner = None

    # The predict method takes an image and performs prediction using the loaded learner.
    def predict(self, img, prob_graph, cam, do_grad_cam, path):
        self.load()
        if self.learner:
            if os.path.isfile(os.path.join(path, "heatmap.png")) and cam:
                os.remove(os.path.join(path, "heatmap.png"))
            pred, _, probs = self.learner.predict(img)
            if prob_graph:
                get_prob_graph(probs, self.learner.dls.vocab, path)
            if do_grad_cam:
                grad_cam(self.learner, img, self.loader.to_dls(), path)
            return pred
        else:
            return "Learner not loaded"
    
    # The create_heatmap method generates a heatmap for the given image using the grad_cam function.
    def create_heatmap(self, img, path):
        grad_cam(self.learner, img, self.loader.to_dls(), path)

    # The get_training_time method returns the training time as a string.
    def get_training_time(self):
        if self.training_time:
            return str(self.training_time)
        return None

    # The to_dict method converts the learner's attributes to a dictionary format.
    # This is useful for saving the learner's metadata in a structured format.
    def to_dict(self):
        return {
            "type": "pretrained",
            "epoch": self.epoch,
            "lr": self.lr,
            "arch": self.arch,
            "training_time": self.get_training_time(),
            "test_accuracy": self.test_accuracy,
            "test_loss": self.test_loss,
            "learner_exists": self.learner_exists,
        }
