from flask import Blueprint, jsonify, request
from backend.ai.model import models, create_model, delete_model, change_name, get_model_by_id

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
