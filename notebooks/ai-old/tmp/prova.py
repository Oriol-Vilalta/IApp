from fastai.vision.all import *


if __name__ == '__main__':
    dls = ImageDataLoaders.from_folder(r"/backend/.data\OLpOFf6xKT\dataset\train",
                                       valid_pct=0.2,
                                       seed=42,
                                       item_tfms=Resize(224),
                                       )
    print(dls.vocab)
    learner = vision_learner(dls, resnet34, metrics=accuracy)
    # learner.fine_tune(1)
