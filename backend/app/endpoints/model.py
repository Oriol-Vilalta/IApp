from flask import Blueprint, jsonify, request, send_file, Response
from ..ai.model import *
from flask_cors import CORS, cross_origin

models_bp = Blueprint('models', __name__)
CORS(models_bp)


@models_bp.route('/models', methods=['GET'])
def get_models():
    model_json = list(map(lambda model: model.to_dict(), list(models.values())))
    res = jsonify({'models': model_json})
    return res, 200


@models_bp.route('/models/<string:id>', methods=['GET'])
def get_model_with_id(id):
    model = get_model(id)
    if model:
        return jsonify(model.to_dict()), 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models', methods=['POST'])
def create_model_by_name():
    model_name = request.json['name']
    model = create_model(model_name)
    if model:
        return jsonify(model.to_dict()), 201
    else:
        return jsonify({'error': f'Model {model_name} already exists'}), 400


@models_bp.route('/models/<string:id>', methods=['DELETE'])
def delete_model_by_id(id):
    model = get_model(id)
    if model:
        model.remove_model()
        return jsonify({'message': 'Model deleted successfully'}), 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/change_name', methods=['PUT'])
def update_model_by_id(id):
    message, code = change_name(id, request.args['name'])
    if code == 200:
        return jsonify({'message': message}), code
    else:
        return jsonify({'error': message}), code


@models_bp.route('/models/<string:id>/download', methods=['GET'])
def download_by_id(id):
    model = get_model(id)
    if model:
        response = Response(model.compress(), content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename="{model.name}.zip"'
        return response, 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/upload', methods=['POST'])
def upload_new_model():
    try:
        file = request.files['file']
        if file.filename.endswith('.zip'):
            upload_model(file.stream)
            return jsonify({'message': 'Model uploaded successfully'}), 200
        else:
            return jsonify({'error': 'File type not supported'}), 400
    except KeyError:
        return jsonify({'error': 'File is not uploaded'}), 400


@models_bp.route('/models/<string:id>/dataset', methods=['PUT'])
def assign_a_dataset_to_a_model(id):
    model = get_model(id)
    if model:
        if model.assign_dataset(request.json['dataset_id']):
            return jsonify({'message': 'Dataset assigned successfully'}), 200
        else:
            return jsonify({'error': 'Dataset does not exist'}), 404
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/dataset', methods=['PUT'])
def assign_a_dataset(id):
    model = get_model(id)
    if model:
        if model.assign_dataset(request.args['dataset_id']):
            return jsonify({'message': 'Dataset assigned successfully'}), 200
        else:
            return jsonify({'error': 'Dataset does not exist'}), 404
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/train', methods=['PUT'])
def train_a_model_(id):
    model = get_model(id)
    if model:
        try:
            res = model.train()
            if res:
                return jsonify({'message': res}), 400
            return jsonify({'success': "Trained correctly"}), 200
        except MemoryError as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/test', methods=['PUT'])
def test_a_model(id):
    model = get_model(id)
    if model:
        res = model.test()
        return jsonify({'message': {
            'test_accuracy': res[0],
            'test_loss': res[1]
        }}), 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/predict', methods=['POST'])
def predict_an_image(id):
    model = get_model(id)
    if model and request.files['file']:
        file = request.files['file']
        if file.filename.endswith(('.png', '.jpg', '.jpeg')):
            file.save(model.path + "/predict.jpg")
            img = PILImage.create(file.stream)
            res = model.predict(img,
                                grad_cam=(request.args['grad_cam'] == "true"),
                                prob_graph=(request.args['prob_graph'] == "true")
                                )
            return jsonify({'result': res}), 200
        else:
            return jsonify({'error': 'File type not supported'}), 400
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/results', methods=['GET'])
def get_training_results(id):
    model = get_model(id)
    if model:
        res = model.get_training_results()
        return jsonify({'result': res}), 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/heatmap', methods=['GET'])
def get_the_heatmap(id):
    model = get_model(id)
    if model:
        return send_file(os.path.join(model.path, "heatmap.png"), mimetype='image/png')
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/grad_cam', methods=['GET'])
def get_the_grad_cam(id):
    model = get_model(id)
    if model:
        if os.path.exists(os.path.join(model.path, "grad-cam.png")):
            return send_file(os.path.join(model.path, "grad-cam.png"), mimetype='image/png')
        else:
            return jsonify({'error': 'Grad-cam is not ready'}), 404
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/prob_graph', methods=['GET'])
def get_the_prob_graph(id):
    model = get_model(id)
    if model:
        return send_file(os.path.join(model.path, "prob_graph.png"), mimetype='image/png')
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/change_loader_property', methods=['PUT'])
def change_a_loader_property(id):
    model = get_model(id)
    if model:
        for key, value in request.json.items():
            model.change_loader_property(key, value)
        return "", 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404


@models_bp.route('/models/<string:id>/change_learner_property', methods=['PUT'])
def change_a_learner_property(id):
    model = get_model(id)
    if model:
        for key, value in request.json.items():
            print(key, value, value.__class__)
            model.change_learner_property(key, value)
        return "", 200
    else:
        return jsonify({'error': 'Model does not exist'}), 404
