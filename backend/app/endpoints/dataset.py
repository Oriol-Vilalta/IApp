from flask import Blueprint, jsonify, request, Response
from flask_cors import CORS

from ..ai.dataset import *
from ..utils.logger import logger

blueprint = Blueprint('datasets', __name__)
CORS(blueprint)


#
# CRUD OPERATIONS
#

# GET ALL - Retreives all of the datasets information.
# Used when a page will need to visualize all the datasets, like the main page of the datasets.
@blueprint.route('/datasets', methods=['GET'])
def get_datasets():
    response = list(map(lambda dataset: dataset.to_dict(), list(datasets.values())))
    logger.debug(f"{request.path}: Retrieved {len(response)} datasets")
    return jsonify({"datasets": response}), 200


# GET - Retrieves the information of just one dataset by the id.
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


#  POST - Creates a new blank dataset with a specific name
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


# DELETE - Delete a dataset.
@blueprint.route('/datasets/<string:id>', methods=['DELETE'])
def delete_dataset_by_id(id):
    if delete_dataset(id):
        logger.debug(f"{request.path}: {id} got deleted!")
        return jsonify({"message": "Dataset deleted successfully"}), 200
    else:
        logger.debug(f"{request.path}: Dataset doesn't exist")
        return jsonify({"error": "Dataset not found"}), 404


#
# UPLOADING DATA
#

# Upload training data.
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
        logger.debug(f"{request.path}: Uploaded Train Data")
        return jsonify({"message": "Data uploaded successfully"}), 200
    else:
        logger.error(f"{request.path}: Uploaded Train Data")
        return jsonify({"error": "Dataset not found"}), 404


# Upload testing data.
@blueprint.route('/datasets/<string:id>/upload/test', methods=['POST'])
def upload_test_data(id):

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

    if upload_test_label(id, file.stream):
        logger.debug(f"{request.path}: Uploaded Test Data")
        return jsonify({"message": "Data uploaded successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


#
# DOWNLOAD AND UPLOAD DATASET
#

# Upload a full dataset.
@blueprint.route('/datasets/upload', methods=['POST'])
def upload_dataset_full_dataset():
    # Check if a file has been uploaded
    try:
        file = request.files['file']
    except KeyError:
        return jsonify({"error": "No 'file' parameter found!"}), 400
    
    if file.filename == '':
        return jsonify({"error": "No file has been uploaded"}), 400

    # If data it's not a zip folder cannot be unzipped.
    if not file.filename.endswith('.zip'):
        return jsonify({"error": "File type not supported"}), 400

    logger.debug(f"{request.path}: Uploaded dataset")
    upload_dataset(file.stream)
    return jsonify({"message": "Data uploaded successfully"}), 200


# Downloads the full dataset (including training and testing).
@blueprint.route('/datasets/<string:id>/download', methods=['GET'])
def download_a_dataset(id):
    dataset = get_dataset(id)
    if dataset:
        response = Response(dataset.compress(), content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename={dataset.name}.zip'
        logger.debug(f"{request.path}: Dataset downloaded successfully")
        return response, 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({"error": "Dataset not found"}), 404

#
# REMOVE LABELS FROM THE DATASET
#

# Remove all training.
@blueprint.route('/datasets/<string:id>/delete/train', methods=['DELETE'])
def delete_train_data_from_dataset(id):
    if delete_train(id):
        logger.debug(f"{request.path}: Train data deleted successfully")
        return jsonify({"message": "Train data deleted successfully"}), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({"error": "Dataset not found"}), 404


# Remove all testing.
@blueprint.route('/datasets/<string:id>/delete/test', methods=['DELETE'])
def delete_test_data_from_dataset(id):
    if delete_test(id):
        logger.debug(f"{request.path}: Test data deleted successfully")
        return jsonify({"message": "Test data deleted successfully"}), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({"error": "Dataset not found"}), 404


# Remove a specific category/label
@blueprint.route('/datasets/<string:id>/delete/label', methods=['DELETE'])
def update_train_data(id):
    label = request.args.get('name')
    if delete_label(id, label):
        logger.debug("Label delated successfully")
        return jsonify({"message": f"{label} deleted successfully"}), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({"error": "Dataset not found"}), 404

#
# OTHER FUNCTIONALITIES
#

# Generates testing dataset using training data
@blueprint.route('/datasets/<string:id>/generate/test', methods=['PUT'])
def generate_tests_using_training_data(id):
    pct = float(request.args.get('percentage'))

    # Verify pct is in the correct range
    if pct < 0 or pct > 1:
        return jsonify({"error": "The percentage given must be between 0 and 1"}), 400
    
    # Generate tests
    mes, code = generate_test(id, pct)
    return jsonify({"message": mes}), code

