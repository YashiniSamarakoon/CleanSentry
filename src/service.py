from PIL import Image
import numpy as np
from collections import Counter
from keras.models import load_model
from sklearn.preprocessing import LabelEncoder
from db_service import save_prediction
import os
from datetime import datetime


def process_images(city, target_size=(224, 224)):

    prediction = {
        'location': '',
        'plastic_percentage': '0.00%',
        'metal_percentage': '0.00%',
        'glass_percentage': '0.00%',
        'foam_percentage': '0.00%',
        'date': datetime.now().date().strftime('%Y-%m-%d')
    }

    # Actual labels corresponding to the images (if available)
    actual_labels = ['plastic', 'plastic', 'metal', 'metal', 'glass', 'glass', 'foam', 'foam']
    image_paths = get_file_list(f'../res/uploads/{city.lower()}')

    # Path to the trained model
    model_path = '../model1.h5'

    # Load the trained model
    model = load_model(model_path)

    # Preprocess images
    def preprocess_image(image_path, target_size):
        image = Image.open(image_path)
        image = image.resize(target_size)
        image = np.array(image) / 255.0  # Normalize pixel values
        return image

    # Preprocess test images
    test_images = [preprocess_image(image_path, target_size) for image_path in image_paths]

    # Convert list of images to numpy array
    test_images = np.array(test_images)

    # Perform predictions
    predictions = model.predict(test_images)

    # Get predicted labels
    predicted_labels = np.argmax(predictions, axis=1)

    # Count the occurrences of each predicted label
    predicted_label_counts = Counter(predicted_labels)

    # Total number of predictions
    total_predictions = len(predicted_labels)
    print("Total predictions:", total_predictions)

    # Calculate the percentage of each predicted class
    class_percentages = {label: count / total_predictions * 100 for label, count in predicted_label_counts.items()}

    # Load the label encoder
    label_encoder = LabelEncoder()

    # If actual labels are provided, encode them and calculate their counts
    if actual_labels:
        actual_labels_encoded = label_encoder.fit_transform(actual_labels)
        actual_label_counts = Counter(actual_labels_encoded)

    # Print the count and percentage of each predicted class along with the class name
    print("\nPredicted Label Counts:")
    for label, percentage in class_percentages.items():
        class_name = label_encoder.inverse_transform([label])[0]
        prediction['location'] = city
        if class_name == 'foam':
            prediction['foam_percentage'] = f'{percentage:.2f}%'
        if class_name == 'plastic':
            prediction['plastic_percentage'] = f'{percentage:.2f}%'
        if class_name == 'metal':
            prediction['metal_percentage'] = f'{percentage:.2f}%'
        if class_name == 'glass':
            prediction['glass_percentage'] = f'{percentage:.2f}%'

    save_prediction(prediction)
    return prediction


def get_file_list(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list


