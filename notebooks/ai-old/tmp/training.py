
from fastai.vision.all import *

def is_cat(x):
    return x[0].isupper()

def main():
    path = "/backend/.data/datafolder/dataset/oxford-iiit-pet/images"
    print(path)

    dls = ImageDataLoaders.from_name_func(
        path,
        get_image_files(path),
        valid_pct=0.2,
        seed=42,
        label_func=is_cat,
        item_tfms=Resize(224))

    learner = vision_learner(dls, resnet34, metrics=accuracy)
    learner.fine_tune(1)
    learner.export("C:/Users/orivi/Desktop/Nununana/.data/datafolder/learner.pkl")


if __name__ == '__main__':
    print(URLs.PETS)