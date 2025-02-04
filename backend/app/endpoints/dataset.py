from flask import Blueprint, jsonify, request, Response
from flask_cors import CORS
from ..ai.dataset import *
from ..utils.logger import logger

blueprint = Blueprint('datasets', __name__)
CORS(blueprint)

# Retreives all of the datasets information.
# Used when a page will need to visualize all the datasets, like the main page of the datasets.
@blueprint.route('/datasets', methods=['GET'])
def get_datasets():
    response = list(map(lambda dataset: dataset.to_dict(), list(datasets.values())))
    logger.debug(f"{request.path}: Retrieved {len(response)} datasets")
    return jsonify({"datasets": response}), 200


# Retrieves the information of just one dataset by the id.
# Used when viewing a dataset page.
@blueprint.route('/datasets/<string:id>', methods=['GET'])
def get_dataset_with_id(id):
    dataset = get_dataset(id)
    if dataset:
        logger.debug(f"{request.path}: Retreived dataset successfully.")
        return jsonify(dataset.to_dict()), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({"error": "Dataset not found"}), 404


# Creates a new blank dataset with a specific name
# If a dataset with the same name already exists, it won't be created.
@blueprint.route('/datasets', methods=['POST'])
def create_dataset_by_name():
    name = request.json['name']
    dataset = create_dataset(name)
    if dataset:
        logger.debug(f"Dataset created successfully. ID: {dataset.id}")
        return jsonify(dataset.to_dict()), 201
    else:
        logger.error(f"There's already a dataset with this name.")
        return jsonify({"error": "Name already exists"}), 400

# Upload training dataset.
@blueprint.route('/datasets/<string:id>/upload/train', methods=['POST'])
def upload_train_data(id):

    # Check if a file has been uploaded
    try:
        file = request.files['file']
    except KeyError:
        return jsonify({"error": "No 'file' parameter found!"}), 400
    
    if file.filename == '':
        return jsonify({"error": "No file has been uploaded"}), 400

    # If data it's not a zip folder cannot be unzipped.
    if not file.filename.endswith('.zip'):
        print(os.path.splitext(file))
        return jsonify({"error": "File type not supported"}), 400

    if upload_train_label(id, file.stream):
        return jsonify({"message": "Data uploaded successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@blueprint.route('/datasets/<string:id>/upload_test', methods=['POST'])
def upload_test_data(id):
    file = request.files['file']
    if file.filename.endswith('.zip'):
        if upload_test_label(id, file.stream):
            return jsonify({"message": "Data uploaded successfully"}), 200
        else:
            return jsonify({"error": "Dataset not found"}), 404
    else:
        return jsonify({"error": "File type not supported"}), 400


@blueprint.route('/datasets/<string:id>/download', methods=['GET'])
def download_a_dataset(id):
    dataset = get_dataset(id)
    if dataset:
        response = Response(dataset.compress(), content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename={dataset.name}.zip'
        return response, 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@blueprint.route('/datasets/upload', methods=['POST'])
def upload_dataset_to_database():
    file = request.files['file']
    if file.filename.endswith('.zip'):
        upload_dataset(file.stream)
        return jsonify({"message": "Data uploaded successfully"}), 200
    else:
        return jsonify({"error": "File type not supported"}), 400


@blueprint.route('/datasets/<string:id>/generate_test', methods=['PUT'])
def generate_tests_using_training_data(id):
    test_pct = request.json['test_pct']
    if test_pct < 0 or test_pct > 1:
        return jsonify({"error": "test_pct must be between 0 and 1"}), 400
    mes, code = generate_test(id, test_pct)
    return jsonify({"message": mes}), code


@blueprint.route('/datasets/<string:id>', methods=['DELETE'])
def delete_dataset_by_id(id):
    if delete_dataset(id):
        return jsonify({"message": "Dataset deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@blueprint.route('/datasets/<string:id>/delete_train', methods=['DELETE'])
def delete_train_data_from_dataset(id):
    if delete_train(id):
        return jsonify({"message": "Train data deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@blueprint.route('/datasets/<string:id>/delete_test', methods=['DELETE'])
def delete_test_data_from_dataset(id):
    if delete_test(id):
        return jsonify({"message": "Test data deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@blueprint.route('/datasets/<string:id>/delete_label', methods=['DELETE'])
def update_train_data(id):
    label = request.json['label']
    if delete_label(id, label):
        return jsonify({"message": f"{label} deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404
