from flask import Flask
from flask_cors import CORS  
from .endpoints.model import models_bp  
from .endpoints.dataset import dataset_bp  

"""
This module initializes and configures the Flask application for the IApp-Tmp backend.
It sets up the necessary blueprints for handling model and dataset related endpoints,
and optionally enables Cross-Origin Resource Sharing (CORS) for the application.
To run the application, execute this module directly or use a WSGI server.
"""

app = Flask(__name__)  # Creating a Flask application instance

# Registering the blueprints with the Flask application
app.register_blueprint(models_bp)
app.register_blueprint(dataset_bp)
