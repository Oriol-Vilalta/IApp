from flask import Blueprint, jsonify, request, send_file, Response
from flask_cors import CORS
from werkzeug.exceptions import BadRequestKeyError
from fastai.vision.core import PILImage
import os

from ..ai.model import *
from ..utils.logger import logger

blueprint = Blueprint('models', __name__)
CORS(blueprint)

#
# CRUD OPERATIONS
#

# GET ALL - Retreives all of the models information.
@blueprint.route('/models', methods=['GET'])
def get_models():
    response = list(map(lambda model: model.to_dict(), list(models.values())))
    logger.debug(f"{request.path}: Retrieved {len(response)} models")
    return jsonify({'models': response}), 200


# GET - Retrieves the indormation of an specified model by its id.
# Used on a specific model page
@blueprint.route('/models/<string:id>', methods=['GET'])
def get_model_with_id(id):
    model = get_model(id)
    if model:
        logger.debug(f"{request.path}: Retrieved model successfully.")
        return jsonify(model.to_dict()), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404


# POST - Creates a new blank model with a specific name.
# Creates the model if the there's no model with the same name.
@blueprint.route('/models', methods=['POST'])
def create_model_by_name():
    name = request.json['name']
    model = create_model(name)
    if model:
        logger.debug(f"Model creates successfully. ID: {model.id}")
        return jsonify(model.to_dict()), 201
    else:
        logger.error(f"There's already a model with this name.")
        return jsonify({'error': f'Model {name} already exists'}), 400


# DELETE - Deletes a model.
@blueprint.route('/models/<string:id>', methods=['DELETE'])
def delete_model_by_id(id):
    model = get_model(id)
    if model:
        model.remove_model()
        logger.debug(f"{request.path}: {id} got deleted!")
        return jsonify({'message': 'Model deleted successfully'}), 200
    else:
        logger.error(f"{request.path}: Model doesn't exist")
        return jsonify({'error': 'Model does not exist'}), 404

#
# UPLOAD AND DOWNLOAD
#

# Upload a model
@blueprint.route('/models/upload', methods=['POST'])
def upload_new_model():

    # Check if a file has been uploaded
    try:
        file = request.files['file']
    except KeyError:
        return jsonify({"error": "No 'file' parameter found!"}), 400

    if file.filename == '':
        return jsonify({"error": "No file has been uploaded"}), 400

    # If data it's not a zip folder cannot be unzipped.
    if not file.filename.endswith('.zip'):
        return jsonify({"eror": "File type not supported"}), 400

    logger.debug(f"{request.path}: Uploaded model")
    upload_model(file.stream)
    return jsonify({"message": "Data uploaded successfully"}), 200


# Download a full model (including dataset)
@blueprint.route('/models/<string:id>/download', methods=['GET'])
def download_by_id(id):
    model = get_model(id)
    if model:
        response = Response(model.compress(), content_type='application/zip')
        response.headers['Content-Disposition'] = f'attachment; filename="{model.name}.zip"'
        logger.debug(f"{request.path}: Model downloaded successfully.")
        return response, 200
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404

#
# DATASET 
#

# Set dataset to the model.
@blueprint.route('/models/<string:id>/dataset', methods=['PUT'])
def assign_a_dataset_to_a_model(id):
    model = get_model(id)
    if not model:
        logger.error(f"{request.path}: Model doesn't exist")
        return jsonify({'error': 'Model does not exist'}), 404
    
    if model.assign_dataset(request.json['dataset']):
        logger.debug(f"{request.path}: Dataset assigned successfully.")
        return jsonify({'message': 'Dataset assigned successfully'}), 200
    else:
        logger.error(f"{request.path}: Dataset doesn't exist.")
        return jsonify({'error': 'Dataset does not exist'}), 404


#
# MODEL OPERATIONS (train, test, predict...)
#

# TRAIN - Trains the model given the dataset.
@blueprint.route('/models/<string:id>/train', methods=['PUT'])
def train_a_model_(id):
    model = get_model(id)

    # Verify model id
    if not model:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({"error": "Model doesn't exist"}), 404
    
    # Train model
    logger.debug(f"{request.path}: Starting training...")
    try:
        response = model.train()
    except MemoryError as e:
        return jsonify({'error': str(e)}), 400
    
    # Send response if needed, if not send success message
    if not response:
        logger.debug(f"{request.path}: Model trainend successfully.")
        return jsonify({'message': "Trained correctly"}), 200
    else:
        logger.error(f"{request.path}: {response}")
        return jsonify({"error": response}), 400
        

# TEST - Tests model using test data. Return message with accuracy and loss
@blueprint.route('/models/<string:id>/test', methods=['PUT'])
def test_a_model(id):
    model = get_model(id)
    # Verify model id
    if not model:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404
    
    # Test and return message with metrics
    res = model.test()
    logger.debug(f"{request.path}: Model tested successfully.")
    return jsonify({'message': {
        'accuracy': res[0],
        'loss': res[1]
    }}), 200


# PREDICT - Predict an image using the model.
@blueprint.route('/models/<string:id>/predict', methods=['POST'])
def predict_an_image(id):
    logger.info(f"{request.path}: Received prediction request for model {id}")

    model = get_model(id)

    # Verify models id
    if not model:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404

    # Delete previous grad-cam.png and prob_graph.png if they exist
    gradcam_path = os.path.join(model.path, "grad-cam.png")
    prob_graph_path = os.path.join(model.path, "prob_graph.png")
    for file_path in [gradcam_path, prob_graph_path]:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"{request.path}: Deleted file {file_path}")

    # Check if a file it's been uploaded
    try:
        file = request.files['file']
    except KeyError:
        logger.error(f"{request.path}: No 'file' parameter found!")
        return jsonify({"error": "No 'file' parameter found!"}), 400

    if file.filename == '':
        logger.error(f"{request.path}: No file has been uploaded")
        return jsonify({"error": "No file has been uploaded"}), 400 

    # Verify the file it's an image
    if not file.filename.endswith(('.png', '.jpg', '.jpeg')):
        logger.error(f"{request.path}: File type not supported, name: {file.filename}")
        return jsonify({'error': 'File type not supported'}), 400

    logger.info(f"{request.path}: File '{file.filename}' received for prediction.")

    # Save image used for prediction
    file.save(model.path + "/predict.jpg")
    logger.info(f"{request.path}: Saved prediction image to {model.path + '/predict.jpg'}")
    img = PILImage.create(file.stream)

    # Verify type of prediction
    try:
        grad_cam = request.args['grad_cam'] == "true"
    except BadRequestKeyError:
        grad_cam = False

    try:
        prob_graph = request.args['prob_graph'] == "true"
    except BadRequestKeyError:
        prob_graph = False

    logger.info(f"{request.path}: Starting prediction (grad_cam={grad_cam}, prob_graph={prob_graph})")
    res = model.predict(img, grad_cam=grad_cam, prob_graph=prob_graph)
    logger.info(f"{request.path}: Prediction done for model {id}")
    logger.debug(f"{request.path}: Prediction result: {res}")

    return jsonify({'result': res}), 200


#
# PREDICTION VISUAL RESULTS
#

# HEATMAP - Retrieves the heatmap
@blueprint.route('/models/<string:id>/heatmap', methods=['GET'])
def get_the_heatmap(id):
    model = get_model(id)
    if model:
        logger.debug(f"{request.path}: Heatmap sended successfully!")
        model.heatmap(PILImage.create(os.path.join(model.path, "predict.jpg")), model.path)
        return send_file(os.path.join(model.path, "heatmap.png"), mimetype='image/png')
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404


# DOWNLOAD HEATMAP - Download the heatmap image file
@blueprint.route('/models/<string:id>/heatmap/download', methods=['GET'])
def download_heatmap(id):
    model = get_model(id)
    if not model:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404

    heatmap_path = os.path.join(model.path, "heatmap.png")
    if os.path.exists(heatmap_path):
        logger.debug(f"{request.path}: Heatmap downloaded successfully.")
        return send_file(heatmap_path, mimetype='image/png', as_attachment=True, download_name='heatmap.png')
    else:
        logger.error(f"{request.path}: Heatmap does not exist.")
        return jsonify({'error': 'Heatmap does not exist'}), 404

# GRADCAM - Retrieves the gradcam
@blueprint.route('/models/<string:id>/gradcam', methods=['GET'])
def get_the_grad_cam(id):
    model = get_model(id)
    if not model:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404
    
    if os.path.exists(os.path.join(model.path, "grad-cam.png")):
        logger.debug(f"")
        return send_file(os.path.join(model.path, "grad-cam.png"), mimetype='image/png')
    else:
        logger.warning(f"{request.path}: Grad-cam might not be ready.")
        return jsonify({'error': 'Grad-cam is not ready'}), 404

        
#
# RESULTS DISPLAYING
#

# Retrive training results
@blueprint.route('/models/<string:id>/train', methods=['GET'])
def get_training_results(id):
    model = get_model(id)
    if model:
        res = model.get_training_results()
        logger.debug(f"{request.path}: Training results retrieved successfully.")
        return jsonify({'result': res}), 200
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404


# Retrieve results graphic of predictions
@blueprint.route('/models/<string:id>/graphic', methods=['GET'])
def get_the_prob_graph(id):
    model = get_model(id)
    if model:
        logger.debug(f"{request.path}: Graphic of results retrieved successfully.")
        return send_file(os.path.join(model.path, "prob_graph.png"), mimetype='image/png')
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404


#
# CHANGE PROPERTIES
#

# LOADER - Change properties from the loader (data related)
@blueprint.route('/models/<string:id>/change/property/loader', methods=['PUT'])
def change_a_loader_property(id):
    model = get_model(id)
    if model:
        for key, value in request.json.items():
            logger.info(f"{request.path}: Changing loader property '{key}' to '{value}' for model {id}")
            model.change_loader_property(key, value)
        logger.info(f"{request.path}: Loader properties changed successfully for model {id}")
        return "", 200
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404


# LEARNER - Change properties from the learner (ai related)
@blueprint.route('/models/<string:id>/change/property/learner', methods=['PUT'])
def change_a_learner_property(id):
    model = get_model(id)
    if model:
        for key, value in request.json.items():
            logger.info(f"{request.path}: Changing learner property '{key}' to '{value}' for model {id}")
            model.change_learner_property(key, value)
        logger.info(f"{request.path}: Learner properties changed successfully for model {id}")
        return "", 200
    else:
        logger.error(f"{request.path}: Model doesn't exist.")
        return jsonify({'error': 'Model does not exist'}), 404
#
# OTHER FEATURES
#

# Change the name to the model
@blueprint.route('/models/<string:id>/change/name', methods=['PUT'])
def update_model_by_id(id):
    message, code = change_name(id, request.args['name'])
    if code == 200:
        return jsonify({'message': message}), code
    else:
        return jsonify({'error': message}), code

