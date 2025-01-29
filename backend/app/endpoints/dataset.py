from flask import Blueprint, jsonify, request, send_file, Response
from ..ai.dataset import *
from flask_cors import cross_origin, CORS

dataset_bp = Blueprint('datasets', __name__)
CORS(dataset_bp)


@dataset_bp.route('/datasets', methods=['GET'])
def get_datasets():
    dataset_json = list(map(lambda dataset: dataset.to_dict(), list(datasets.values())))
    return jsonify({"datasets": dataset_json}), 200


@dataset_bp.route('/datasets/<string:id>', methods=['GET'])
def get_dataset_with_id(id):
    dataset = get_dataset(id)
    if dataset:
        return jsonify(dataset.to_dict()), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@dataset_bp.route('/datasets', methods=['POST'])
def create_dataset_by_name():
    name = request.json['name']
    dataset = create_dataset(name)
    if dataset:
        return jsonify(dataset.to_dict()), 201
    else:
        return jsonify({"error": "Name already exists"}), 400


@dataset_bp.route('/datasets/<string:id>/upload_train', methods=['POST'])
def upload_train_data(id):
    file = request.files['file']
    if file.filename.endswith('.zip'):
        if upload_train_label(id, file.stream):
            return jsonify({"message": "Data uploaded successfully"}), 200
        else:
            return jsonify({"error": "Dataset not found"}), 404
    else:
        return jsonify({"error": "File type not supported"}), 400


@dataset_bp.route('/datasets/<string:id>/upload_test', methods=['POST'])
def upload_test_data(id):
    file = request.files['file']
    if file.filename.endswith('.zip'):
        if upload_test_label(id, file.stream):
            return jsonify({"message": "Data uploaded successfully"}), 200
        else:
            return jsonify({"error": "Dataset not found"}), 404
    else:
        return jsonify({"error": "File type not supported"}), 400


@dataset_bp.route('/datasets/<string:id>/download', methods=['GET'])
def download_a_dataset(id):
    dataset = get_dataset(id)
    if dataset:
        response = Response(dataset.compress(), content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename={dataset.name}.zip'
        return response, 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@dataset_bp.route('/datasets/upload', methods=['POST'])
def upload_dataset_to_database():
    file = request.files['file']
    if file.filename.endswith('.zip'):
        upload_dataset(file.stream)
        return jsonify({"message": "Data uploaded successfully"}), 200
    else:
        return jsonify({"error": "File type not supported"}), 400


@dataset_bp.route('/datasets/<string:id>/generate_test', methods=['PUT'])
def generate_tests_using_training_data(id):
    test_pct = request.json['test_pct']
    if test_pct < 0 or test_pct > 1:
        return jsonify({"error": "test_pct must be between 0 and 1"}), 400
    mes, code = generate_test(id, test_pct)
    return jsonify({"message": mes}), code


@dataset_bp.route('/datasets/<string:id>', methods=['DELETE'])
def delete_dataset_by_id(id):
    if delete_dataset(id):
        return jsonify({"message": "Dataset deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@dataset_bp.route('/datasets/<string:id>/delete_train', methods=['DELETE'])
def delete_train_data_from_dataset(id):
    if delete_train(id):
        return jsonify({"message": "Train data deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@dataset_bp.route('/datasets/<string:id>/delete_test', methods=['DELETE'])
def delete_test_data_from_dataset(id):
    if delete_test(id):
        return jsonify({"message": "Test data deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404


@dataset_bp.route('/datasets/<string:id>/delete_label', methods=['DELETE'])
def update_train_data(id):
    label = request.json['label']
    if delete_label(id, label):
        return jsonify({"message": f"{label} deleted successfully"}), 200
    else:
        return jsonify({"error": "Dataset not found"}), 404
