from fastai.vision.all import *
import os


def process_image_arq(arq):
    if arq == "resnet34":
        return resnet34
    elif arq == "resnet50":
        return resnet50
    #TODO Add more arq


DEFAULT_CONFIG = {
    "accuracy": 0,
    "arq": "resnet34"

}

class Hook:
    def hook_func(self, m, i, o):
        self.stored = o.detach().clone()



class ImageLearner:

    def __init__(self, source, dataset, config=None):
        self.source = source
        self.trained = False
        self.dls = dataset.to_dls()

        if config is None:
            self.config = DEFAULT_CONFIG
        else:
            self.config = config

        try:
            self.learner = load_learner(os.path.join(source, "model.pkl"))
        except FileNotFoundError:
            self.learner = vision_learner(self.dls, process_image_arq(self.config.arq), metrics=[accuracy])


    def train(self, epoch=1):
        self.learner.fine_tune(epoch)
        self.learner.export(os.path.join(self.source, "model.pkl"))
        self.trained = True

    def predict(self, image):
        return self.learner.predict(image)

    def heatmap(self, image):
        if self.trained:
            x, = first(self.dls.test_dl([image]))

            hook_output = Hook()
            hook = self.learner.model[0].register_forward_hook(hook_output.hook_func)

            with torch.no_grad():
                output = self.learner.model.eval()(x)

            act = hook_output.stored[0]
            F.softmax(output, dim=-1)

            # x.shape

            cam_map = torch.einsum('ck,kij->cij', self.learner.model[1][-1].weight, act)
            cam_map.shape

            x_dec = TensorImage(self.dls.train.decode((x,))[0][0])
            _, ax = plt.subplots()
            x_dec.show(ctx=ax)
            ax.imshow(cam_map[1].detach().cpu(), alpha=0.6, extent=(0, 224, 224, 0),
                      interpolation='bilinear', cmap='jet')
