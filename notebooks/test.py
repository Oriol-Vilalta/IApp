from fastai.vision.core import PILImage
from ai.ai import get_model_by_id, load_all_models

if __name__ == '__main__':
    load_all_models()
    model = get_model_by_id('5AAfWTBF')
    with open(r"C:\Users\orivi\Desktop\MY_data\predict\0124.jpeg", 'rb') as f:
        img = PILImage.create(f.read())
        print(model.predict(img, grad_cam=True, prob_graph=True))

    # model = new_model("Fruits")
    #
    # # fruits = ['apple', 'avocado', 'banana', 'cherry', 'kiwi', 'mango', 'orange', 'pinenapple', 'strawberries', 'watermelon']
    # fruits = ['apple', 'avocado', 'banana', 'cherry']
    # model.change_learner_property('arch', 'alexnet')
    #
    # for name in fruits:
    #     with open(rf"C:\Users\orivi\Desktop\MY_data\train\{name}.zip", 'rb') as f:
    #         print(f"{name} added")
    #         model.upload_dataset(f.read(), "train")
    #
    # model.train()
    # for name in fruits:
    #     with open(rf"C:\Users\orivi\Desktop\MY_data\test\{name}.zip", 'rb') as f:
    #         model.upload_dataset(f.read(), "test")
    #
    # model.test()
    #
    # with open(r"C:\Users\orivi\Desktop\MY_data\predict\0124.jpeg", 'rb') as f:
    #     img = PILImage.create(f.read())
    #     print(model.predict(img, grad_cam=True))
    #

