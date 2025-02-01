from ..utils.logger import logger
import os

dir = os.path.dirname(os.path.abspath(__file__))
dir = os.path.dirname(dir)
dir = os.path.dirname(dir)

# Define the path for storing models
MODELS_PATH = os.path.join(dir, ".data", "models")

# Define the path for storing datasets
DATASET_PATH = os.path.join(dir, ".data", "dataset")


# Creates the required directories before app execution.
def initialize_directories():

    try:
        os.makedirs(MODELS_PATH)
        logger.warning("Directory " + MODELS_PATH + " created successfully.")
    except FileExistsError:
        logger.info(MODELS_PATH + " already exists.")

    try:
        os.makedirs(DATASET_PATH)
        logger.warning("Directory " + DATASET_PATH + " created successfully.")
    except FileExistsError:
        logger.info(DATASET_PATH + " already exists.")
