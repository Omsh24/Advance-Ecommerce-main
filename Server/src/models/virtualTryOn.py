import cv2
import mediapipe as mp
import os
import argparse

# Set up command-line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--image_path', type=str, required=True, help="Path to the image")
args = parser.parse_args()

cap = cv2.VideoCapture(args.image_path)  # Use the image path for testing

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

mp_drawing = mp.solutions.drawing_utils

shirtFolderPath = "Resources/Shirts"
listShirts = os.listdir(shirtFolderPath)
shirtImagePath = os.path.join(shirtFolderPath, listShirts[0])
shirtImage = cv2.imread(shirtImagePath, cv2.IMREAD_UNCHANGED)

def overlay_png(background, overlay, position):
    bg_h, bg_w, bg_channels = background.shape
    overlay_h, overlay_w, overlay_channels = overlay.shape

    x, y = position

    if x + overlay_w > bg_w:
        overlay = overlay[:, :(bg_w - x)]
    if y + overlay_h > bg_h:
        overlay = overlay[:(bg_h - y), :]

    alpha_s = overlay[:, :, 3] / 255.0
    alpha_l = 1.0 - alpha_s

    for c in range(0, 3):
        background[y:y+overlay_h, x:x+overlay_w, c] = (
            alpha_s * overlay[:, :, c] +
            alpha_l * background[y:y+overlay_h, x:x+overlay_w, c]
        )

    return background

# Main code to capture image and overlay shirt
success, frame = cap.read()
if not success:
    print("Error reading image.")
    exit()

imgRGB = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
results = pose.process(imgRGB)

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
        shirt_height = int(shirt_width * shirtImage.shape[0] / shirtImage.shape[1])

        resized_shirt = cv2.resize(shirtImage, (shirt_width, shirt_height))

        shirt_position = (right_shoulder_x + (shoulder_width // 2) - (shirt_width // 2),
                          right_shoulder_y - shirt_height // 8)

        frame = overlay_png(frame, resized_shirt, shirt_position)

    else:
        print(f"Invalid shoulder width: {shoulder_width}")

    output_path = 'output/overlayed_image.png'
    cv2.imwrite(output_path, frame)  # Save the image with the overlay

    print(output_path)  # Return the path to the overlayed image

cap.release()
cv2.destroyAllWindows()
