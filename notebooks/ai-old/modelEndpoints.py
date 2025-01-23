from flask import Blueprint, jsonify, request, Response
from backend.app.ai.ai import *
from flask_cors import CORS

models_bp = Blueprint('api', __name__)
CORS(models_bp)


@models_bp.route('/models', methods=['GET'])
def get_models_other():
    models_json = list(map(lambda model: model.to_dict(), models_to_list()))
    return jsonify({"models": models_json}), 200


@models_bp.route('/models/<string:id>', methods=['GET'])
def get_model_by_id_endpoint(id):
    model = get_model_by_id(id)
    if model:
        return model.to_dict(), 200
    else:
        return jsonify({"error": f"Model with id {id} doesn't exists"}), 404


@models_bp.route('/models', methods=['POST'])
def create_a_new_model():
    name = request.args['name']
    model = new_model(name)
    if model:
        return model.to_dict(), 200
    else:
        return jsonify({"error": f"Model with name {name} already exists"}), 401


@models_bp.route('/models/<string:id>', methods=['DELETE'])
def delete_a_model_by_id(id):
    model = get_model_by_id(id)
    if model:
        if delete_model(id):
            return jsonify({'success': 'Model deleted successfully'}), 200
        else:
            return jsonify({'error': 'Model cannot be deleted'}), 400
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/<string:id>/change_name', methods=['PUT'])
def change_a_models_name(id):
    model = get_model_by_id(id)
    if model:
        name = request.json['name']
        if change_name(model, name):
            return jsonify({'success': f'Name changed successfully to {name}'}), 200
        else:
            return jsonify({'error': f'{name} is already in use name'}), 401
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/<string:id>/change_learner_property', methods=['PUT'])
def change_a_lerner_property(id):
    model = get_model_by_id(id)
    errors = []
    changes = 0
    if model:
        json = dict(request.get_json())
        for key in json.keys():
            if not model.change_learner_property(key, json[key]):
                errors.append(key)
            else:
                changes += 1
        return jsonify({'success': f'{changes} successful changes', 'errors': errors}), 200
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/<string:id>/change_dataset_property', methods=['PUT'])
def change_a_dataset_property(id):
    model = get_model_by_id(id)
    errors = []
    changes = 0
    if model:
        json = dict(request.get_json())
        for key in json.keys():
            if not model.change_dataset_property(key, json[key]):
                errors.append(key)
            else:
                changes += 1
        return jsonify({'success': f'{changes} successful changes', 'errors': errors}), 200
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/<string:id>/train', methods=['PUT'])
def train_the_model(id):
    model = get_model_by_id(id)
    if model:
        res = model.train()
        if res:
            return jsonify({'success': res}), 200
        return jsonify({'success': "Trained correctly"}), 200
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/<string:id>/test', methods=['PUT'])
def test_the_model(id):
    pass


@models_bp.route('/models/<string:id>/download', methods=['GET'])
def download_a_model(id):
    model = get_model_by_id(id)
    if model:
        response = Response(model.compress, content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename={model.name}.zip'
        return Response, 200
    else:
        return jsonify({'error': "Model doesn't exists"}), 404


@models_bp.route('/models/upload', methods=['POST'])
def upload_a_model():
    file = request.files['file']
    if file:
        file = request.files['file']

        return "Model uploaded", 201
    else:
        return "An error occurred", 401


@models_bp.route('/models/<string:id>/delete_learner', methods=['DELETE'])
def delete_learner(id):
    model = get_model_by_id(id)
    if model:
        model.remove_learner()
        return "Model Deleted successfully", 200
    else:
        return jsonify({'error': "Model doesn't exists"}), 404

#
# # Procedure to create a NEW model.
# @blueprint.route("/models", methods=['POST'])
# def creation_of_a_model():
#     name = request.get_json()['name']
#     model = create_model(name)
#     if model:
#         return jsonify({"model": model.to_json()}), 201
#     else:
#         return jsonify({"message": f"The model {name} already exists"}), 401
#
#
# # Procedure to delete a specific model.
# @blueprint.route("/models/<string:id>/delete", methods=['DELETE'])
# def delete_of_a_model(id):
#     if delete_model(id):
#         return "Successfully deleted!", 201
#     else:
#         return f"Model doesn't exists", 401
#
#
# # Procedure to change the name of a model.
# @blueprint.route("/models/<string:id>/change_name", methods=['PUT'])
# def change_name_of_a_model(id):
#     new_name = request.get_json()['name']
#     if change_name(id, new_name):
#         return jsonify(get_model_by_id(id).to_json()), 200
#     else:
#         return "Model doesn't exists", 401
#
#
# # Procedure to get a model by its id
# @blueprint.route("/models/<string:id>", methods=['GET'])
# def get_a_model_by_id_endpoint(id):
#     model = get_model_by_id(id)
#     if model:
#         return jsonify(model.to_json()), 200
#     else:
#         return "Model doesn't exists", 401
#
#
# # Download a model with the id
# @blueprint.route("/models/<string:id>/download", methods=['GET'])
# def download_a_model_by_id(id):
#     model = get_model_by_id(id)
#     if model:
#         return send_file(model.compress('zip'), as_attachment=True, download_name=f"{model.name}.zip"), 200
#     else:
#         return "Model doesn't exists", 401
#
#
# # Upload a model with the id
# @blueprint.route("/models/upload", methods=['POST'])
# def upload_a_model():
#     file = request.files['file']
#     if file:
#         upload_model(file)
#         return "Model uploaded", 201
#     else:
#         return "An error occurred", 401
#
#
# @blueprint.route("/models/<string:id>/upload_dataset", methods=['POST'])
# def upload_dataset_to_a_model(id):
#     file = request.files['file']
#     if file:
#         if upload_dataset(id, file):
#             return "Model uploaded", 201
#         else:
#             return "Model not found", 401
#     else:
#         return "An error occurred", 401
