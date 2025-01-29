from app.app import app
from app.ai.config import root
from app.ai.model import load_all_models
from app.ai.dataset import load_all_datasets
import os, logging

"""
This module sets up the necessary directories, loads AI models and datasets, 
and runs the application. It includes procedures needed to be executed before 
the application starts.
"""

logging.basicConfig(filename="app.log", level=logging.INFO, filemode="w",
                    format="[%(asctime)s] %(module)s\t- %(levelname)s: %(message)s",
                    datefmt="%H:%M:%S")


# Creates the required directories for models and datasets.
def setup_directories():
    os.makedirs(root, exist_ok=True)
    os.makedirs(os.path.join(root, 'models'), exist_ok=True)
    os.makedirs(os.path.join(root, 'dataset'), exist_ok=True)


# Loads all AI models and datasets.
def load_ai_modules():
    load_all_datasets()
    load_all_models()


if __name__ == "__main__":
    # Log the start of the application
    logging.info("Starting Application...")

    # Set up necessary directories for models and datasets
    setup_directories()

    # Load all AI models and datasets
    load_ai_modules()

    # Run the application
    app.run(debug=False)
