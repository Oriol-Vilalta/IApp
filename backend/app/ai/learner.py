from fastai.vision.all import *
from datetime import datetime
from .config import data_folder
from .visualitzer import grad_cam, heatmap_cam, get_prob_graph


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


def arch_from_str(str):
    if str.startswith("resnet"):
        return resnet_from_str(str)
    elif str.startswith("densenet"):
        return densenet_from_str(str)
    elif str == "googLeNet":
        return GoogLeNet
    elif str.startswith("efficientnet"):
        return efficientnet_from_str(str)
    elif str.startswith("vgg"):
        return vgg_from_str(str)
    elif str == "alexnet":
        return alexnet
    else:
        return resnet50


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


class TrackResultsCallback(Callback):
    def __init__(self, filepath):
        super().__init__()
        self.filepath = filepath
        self.met = []
        self.epoch_cnt = 0

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

    def train(self):
        self.learner = vision_learner(self.loader.to_dls(), arch_from_str(self.arch), metrics=[accuracy, error_rate])

        self.training_time = datetime.now()
        self.learner.fine_tune(self.epoch, base_lr=self.lr, cbs=[self.metrics_callback])
        self.training_time = str(datetime.now() - self.training_time)

        self.export()
        self.learner_exists = True

    def test(self):
        self.load()
        if self.loader.has_test():
            images = get_image_files(os.path.join(self.loader.dataset.path, "test"))
            test_dl = self.learner.dls.test_dl(images, with_labels=True)
            pred, targ = self.learner.get_preds(dl=test_dl)

            self.test_accuracy = accuracy(pred, targ).item()
            self.test_loss = F.cross_entropy(pred, targ).item()
        else:
            return None

    def export(self):
        self.learner.export(os.path.join(self.path))

    def load(self):
        if not self.learner and self.learner_exists:
            self.learner = load_learner(self.path)

    def remove_learner(self):
        if os.path.exists(self.path):
            os.remove(os.path.join(self.path))
        self.learner = None

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
            if cam:
                heatmap_cam(self.learner, img, self.loader.to_dls(), path)
            return pred
        else:
            return "Learner not loaded"

    def get_training_time(self):
        if self.training_time:
            return str(self.training_time)
        return None

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
