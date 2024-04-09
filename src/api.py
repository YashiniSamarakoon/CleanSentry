import json

from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import os
import shutil
from service import process_images
from db_service import find_predication_by_loacation, find_predication_by_loacation_and_date, find_recycling_centers

app = Flask(__name__)
api = Api(app)

UPLOAD_FOLDER = '../res/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


class ImageUpload(Resource):
    def post(self):
        city = request.form.get('city')
        parent_upload_dir = ''
        if city:
            city = city.lower()
            parent_upload_dir = os.path.join(UPLOAD_FOLDER, city)
            if not os.path.exists(parent_upload_dir):
                os.makedirs(parent_upload_dir)
            else:
                shutil.rmtree(parent_upload_dir)
                os.makedirs(parent_upload_dir)
        else:
            print("[ERROR]: City not found.")
            return {'message': '[ERROR]: City not found.'}, 400

        if 'images[]' not in request.files:
            return {'message': 'No file part'}, 400

        images = request.files.getlist('images[]')
        uploaded_files = []

        for image in images:
            if image.filename == '':
                return {'message': 'No selected file'}, 400

            if image:
                filename = os.path.join(parent_upload_dir, image.filename)
                image.save(filename)
                uploaded_files.append(filename)

        result = process_images(city)
        return {'message': 'Files processed successfully', 'result': result}, 200


api.add_resource(ImageUpload, '/upload')


@app.route('/prediction/<string:location>', methods=['GET'])
def get_predications(location):
    results = find_predication_by_loacation(location)
    if len(results) == 0:
        return jsonify({'error': 'Results not found'}), 404
    return jsonify({'predictions': results}), 200


@app.route('/recycling_centers/<string:location>', methods=['GET'])
def get_recycling_centers(location):
    results = find_recycling_centers(location)
    if len(results) == 0:
        return jsonify({'error': 'Results not found'}), 404
    return jsonify({'centers': results}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)
