from flask import Flask
from .modelEndpoints import models_bp
from flask_cors import CORS
from .datasetEndpoints import dataset_bp

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})


app.register_blueprint(models_bp)
app.register_blueprint(dataset_bp)
