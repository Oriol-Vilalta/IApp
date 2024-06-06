from flask import Blueprint, jsonify, request, send_file
from .ai.model import models, create_model, delete_model, change_name, get_model_by_id, upload_model, upload_dataset

# This blueprint is the key to the connection between the backend and
# the React frontend.
# It gives the procedure for each case.
blueprint = Blueprint('api', __name__, url_prefix='/models')


# For the main page, it is planned to display every model information.
@blueprint.route('/', methods=['GET'])
def get_models_other():
    models_json = list(map(lambda model: model.to_json(), models))
    return jsonify({"models": models_json}), 200


# Procedure to create a NEW model.
@blueprint.route("/", methods=['POST'])
def creation_of_a_model():
    name = request.get_json()['name']
    model = create_model(name)
    if model:
        return jsonify({"model": model.to_json()}), 201
    else:
        return f"The model {name} already exists", 401


# Procedure to delete a specific model.
@blueprint.route("/<string:id>/delete", methods=['DELETE'])
def delete_of_a_model(id):
    if delete_model(id):
        return "Successfully deleted!", 201
    else:
        return f"Model doesn't exists", 401


# Procedure to change the name of a model.
@blueprint.route("/<string:id>/change_name", methods=['PUT'])
def change_name_of_a_model(id):
    new_name = request.get_json()['name']
    if change_name(id, new_name):
        return jsonify(get_model_by_id(id).to_json()), 200
    else:
        return "Model doesn't exists", 401


# Procedure to get a model by its id
@blueprint.route("/<string:id>", methods=['GET'])
def get_a_model_by_id_endpoint(id):
    model = get_model_by_id(id)
    if model:
        return jsonify(model.to_json()), 200
    else:
        return "Model doesn't exists", 401


# Download a model with the id
@blueprint.route("/<string:id>/download", methods=['GET'])
def download_a_model_by_id(id):
    model = get_model_by_id(id)
    if model:
        return send_file(model.compress('zip'), as_attachment=True, download_name=f"{model.name}.zip"), 200
    else:
        return "Model doesn't exists", 401


# Upload a model with the id
@blueprint.route("/upload", methods=['POST'])
def upload_a_model():
    file = request.files['file']
    if file:
        upload_model(file)
        return "Model uploaded", 201
    else:
        return "An error occurred", 401


@blueprint.route("/<string:id>/upload_dataset", methods=['POST'])
def upload_dataset_to_a_model(id):
    file = request.files['file']
    if file:
        if upload_dataset(id, file):
            return "Model uploaded", 201
        else:
            return "Model not found", 401
    else:
        return "An error occurred", 401