import os

current_directory = os.path.dirname(os.path.abspath(__file__))
ai_directory = os.path.dirname(current_directory)
main_dir = os.path.dirname(ai_directory)

data_folder = os.path.join(main_dir, ".data", "models")
dataset_folder = os.path.join(main_dir, ".data", "dataset")
root = os.path.join(main_dir, ".data")
