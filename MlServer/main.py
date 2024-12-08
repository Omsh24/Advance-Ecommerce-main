import os
import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
from io import BytesIO

app = Flask(__name__)

# Enable CORS after app is initialized
CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "OPTIONS"])

# Define constants for the uploaded files and shirt folder paths
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MediaPipe Pose Initialization
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to overlay the shirt image on the webcam frame
def overlay_png(background, overlay, position):
    bg_h, bg_w, bg_channels = background.shape
    overlay_h, overlay_w, overlay_channels = overlay.shape

    x, y = position

    # Ensure the overlay doesn't go out of bounds
    if x + overlay_w > bg_w:
        overlay = overlay[:, :(bg_w - x)]
    if y + overlay_h > bg_h:
        overlay = overlay[:(bg_h - y), :]

    # Handle alpha blending
    alpha_s = overlay[:, :, 3] / 255.0
    alpha_l = 1.0 - alpha_s

    for c in range(0, 3):
        background[y:y+overlay_h, x:x+overlay_w, c] = (
            alpha_s * overlay[:, :, c] +
            alpha_l * background[y:y+overlay_h, x:x+overlay_w, c]
        )

    return background

@app.route('/try-on', methods=['POST'])
def try_on_shirt():
    # Ensure a file was uploaded
    if 'shirt' not in request.files:
        return jsonify({"error": "No shirt file part"}), 400

    file = request.files['shirt']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        shirt_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(shirt_path)

        # Read the shirt image with alpha channel (transparency)
        shirt_image = cv2.imread(shirt_path, cv2.IMREAD_UNCHANGED)

        # Check if shirt image has alpha channel
        if shirt_image.shape[2] != 4:
            return jsonify({"error": "Shirt image must have an alpha channel (transparency)"}), 400

        # Initialize webcam frame (dummy frame to simulate webcam input)
        frame = np.zeros((640, 480, 3), dtype=np.uint8)  # Black dummy frame

        # Process the dummy frame to get pose landmarks 
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(img_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

            h, w, _ = frame.shape
            left_shoulder_x = int(left_shoulder.x * w)
            left_shoulder_y = int(left_shoulder.y * h)
            right_shoulder_x = int(right_shoulder.x * w)
            right_shoulder_y = int(right_shoulder.y * h)

            shoulder_width = left_shoulder_x - right_shoulder_x

            if shoulder_width > 0:
                shirt_width = int(shoulder_width * 1.6)
                shirt_height = int(shirt_width * shirt_image.shape[0] / shirt_image.shape[1])

                resized_shirt = cv2.resize(shirt_image, (shirt_width, shirt_height))

                shirt_position = (right_shoulder_x + (shoulder_width // 2) - (shirt_width // 2),
                                  right_shoulder_y - shirt_height // 8)

                # Apply the overlay
                frame = overlay_png(frame, resized_shirt, shirt_position)

            else:
                return jsonify({"error": "Invalid shoulder width"}), 400

        # Convert the frame with overlay to image and return it as response
        _, buffer = cv2.imencode('.png', frame)
        img_bytes = buffer.tobytes()

        return send_file(BytesIO(img_bytes), mimetype='image/png')

    return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    # Create upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    app.run(debug=True, host='0.0.0.0', port=5000)
