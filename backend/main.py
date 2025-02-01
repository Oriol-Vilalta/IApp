from app.app import app
from app.utils.config import initialize_directories
from app.ai.model import load_all_models
from app.ai.dataset import load_all_datasets
from app.utils.logger import logger

"""
This module sets up the necessary directories, loads AI models and datasets, 
and runs the application. It includes procedures needed to be executed before 
the application starts.
"""

# Loads all AI models and datasets.
def load_ai_modules():
    load_all_datasets()
    load_all_models()


if __name__ == "__main__":
    # Log the start of the application
    logger.info("Starting Application...")

    # Set up necessary directories for models and datasets
    initialize_directories()

    # Load all AI models and datasets
    load_ai_modules()

    # Run the application
    app.run(debug=False)
