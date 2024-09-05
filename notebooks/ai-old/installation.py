import os
from .config import DATA_DIR

# Prepare the environment for the execution of the program
# Does the pre execution routine, like generate folders

def install():
    os.makedirs(f'{DATA_DIR}', exist_ok=True)
    os.makedirs(f'{DATA_DIR}/.tmp', exist_ok=True)