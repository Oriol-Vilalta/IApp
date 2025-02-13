import logging

from flask import Flask
from .endpoints.model import blueprint as model_bp  
from .endpoints.dataset import blueprint as dataset_bp

"""
This module initializes and configures the Flask application for the IApp-Tmp backend.
It sets up the necessary blueprints for handling model and dataset related endpoints,
and optionally enables Cross-Origin Resource Sharing (CORS) for the application.
To run the application, execute this module directly or use a WSGI server.
"""

app = Flask(__name__)  # Creating a Flask application instance

# Set up logging to a different file 
handler = logging.FileHandler('flask.log', mode='w')
formatter = logging.Formatter("[%(asctime)s] %(module)s\t- %(levelname)s: %(message)s",
                              datefmt="%H:%M:%S")

handler.setFormatter(formatter)
app.logger.setLevel(logging.INFO)
app.logger.addHandler(handler)

# Ensure the Flask logger uses the same handler
logging.getLogger('werkzeug').addHandler(handler)

# Registering the blueprints with the Flask application
app.register_blueprint(model_bp)
app.register_blueprint(dataset_bp)
