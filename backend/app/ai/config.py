import os
import logging

dir = os.path.dirname(os.path.abspath(__file__))
dir = os.path.dirname(dir)
dir = os.path.dirname(dir)

# Define the path for storing models
MODLES_PATH = os.path.join(dir, ".data", "models")

# Define the path for storing datasets
DATASET_PATH = os.path.join(dir, ".data", "dataset")


# Creates the required directories before app execution.
def initialize_directories():

    try:
        os.makedirs(MODLES_PATH)
        logging.info("Directory " + MODLES_PATH + " created successfully.")
    except FileExistsError:
        pass

    try:
        os.makedirs(DATASET_PATH)
        logging.info("Directory " + MODLES_PATH + " created successfully.")
    except FileExistsError:
        pass
