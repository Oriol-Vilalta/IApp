import os

current_directory = os.path.dirname(os.path.abspath(__file__))
ai_directory = os.path.dirname(current_directory)
main_dir = os.path.dirname(ai_directory)

data_folder = main_dir + r"\.data\models"
dataset_folder = main_dir + r"\.data\dataset"
root = main_dir + r"\.data"
