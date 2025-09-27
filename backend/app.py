import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from extractor import extract_text_from_image

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Configuration for the upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/v1/status')
def status():
    return jsonify({"status": "ok"})


@app.route('/api/v1/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Process the file with the OCR extractor
        extracted_text = extract_text_from_image(filepath)

        return jsonify({
            "message": "File uploaded and processed successfully",
            "filename": filename,
            "extracted_text": extracted_text
        })


if __name__ == '__main__':
    # Ensure the upload folder exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, port=5001)