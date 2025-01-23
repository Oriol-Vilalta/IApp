from app.app import app
from app.ai.config import root
from app.ai.model import load_all_models
from app.ai.dataset import load_all_datasets
import os


def load_ai_modules():
    os.makedirs(root, exist_ok=True)
    os.makedirs(os.path.join(root, 'models'), exist_ok=True)
    os.makedirs(os.path.join(root, 'dataset'), exist_ok=True)
    load_all_datasets()
    load_all_models()


if __name__ == "__main__":
    load_ai_modules()
    app.run(debug=False)
