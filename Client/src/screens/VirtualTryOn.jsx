import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const VirtualTryOn = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [imageForTryOn, setImageForTryOn] = useState(null); // Image selected by user
  const webcamRef = useRef(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });

  // Start webcam
  const startWebcam = () => {
    setIsWebcamOn(true);
  };

  // Stop webcam
  const stopWebcam = () => {
    setIsWebcamOn(false);
  };

  // Handle image click to select a clothing item
  const handleImageClick = (imageUrl) => {
    setImageForTryOn(imageUrl);
    startWebcam(); 
  };

  // Capture image periodically and overlay the selected image
  const captureAndSendImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    overlayImageOnUser(imageSrc); // Overlay the image on user
  };

  // Overlay the selected image on the user in the webcam feed
  const overlayImageOnUser = async (imageSrc) => {
    // Send image to backend to overlay the selected image on the user (you could use MediaPipe or OpenCV here)
    try {
      const formData = new FormData();
      formData.append('image', dataURLtoFile(imageSrc, 'captured-image.png'));
      formData.append('overlayImage', imageForTryOn); // Send the selected image for overlay

      const response = await axios.post('http://127.0.0.1:8000/try-on', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the backend sends back the processed image
      setOverlayImage(response.data.overlayImage); 
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };

  // Convert base64 to File
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // Periodically capture and send images every 200ms
  useEffect(() => {
    let interval;
    if (isWebcamOn) {
      interval = setInterval(() => {
        captureAndSendImage();
      }, 200);  // Adjust frequency as needed
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWebcamOn, imageForTryOn]);

  return (
    <div className="virtual-try-on-container">
      <h2>Virtual Try-On</h2>

      {/* Display clothing items to try on */}
      <div className="image-selection">
        <img 
          src="/images/shirt1.png" 
          alt="Shirt" 
          onClick={() => handleImageClick("/images/shirt1.png")}
          className="clothing-item"
        />
        <img 
          src="jacket_image.jpg" 
          alt="Jacket" 
          onClick={() => handleImageClick("jacket_image.jpg")}
          className="clothing-item"
        />
        {/* Add more items */}
      </div>

      {/* Webcam display */}
      {isWebcamOn ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width="100%"
            videoConstraints={{
              facingMode: 'user',
            }}
          />
          <button onClick={stopWebcam}>Stop Webcam</button>
        </div>
      ) : (
        <button onClick={startWebcam}>Start Webcam</button>
      )}

      {/* Display the overlaid image */}
      {overlayImage && (
        <div>
          <h3>Your Virtual Try-On Result</h3>
          <img src={overlayImage} alt="Virtual Try-On Result" />
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
