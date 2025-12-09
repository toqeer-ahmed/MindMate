from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'emotion_model.h5'
model = None

# Emotion labels (standard FER2013 mapping, but depends on folder structure)
# We will try to load this dynamically or default to standard
EMOTION_LABELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        print("Loading model...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded.")
    else:
        print(f"Model file {MODEL_PATH} not found. Please run train.py first.")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Please train the model first.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    
    # Read image
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        return jsonify({'error': 'Invalid image'}), 400

    # Preprocess
    img = cv2.resize(img, (48, 48))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0) # Add batch dimension
    img = np.expand_dims(img, axis=-1) # Add channel dimension

    # Predict
    prediction = model.predict(img)
    max_index = int(np.argmax(prediction))
    predicted_emotion = EMOTION_LABELS[max_index]
    confidence = float(prediction[0][max_index])

    return jsonify({
        'mood': predicted_emotion,
        'confidence': confidence,
        'all_scores': {label: float(score) for label, score in zip(EMOTION_LABELS, prediction[0])}
    })

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
