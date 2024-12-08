import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const VirtualTryOn = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [webcamActive, setWebcamActive] = useState(false);
    const webcamRef = useRef(null);

    const handleImageClick = async (imageUrl) => {
        if (!webcamActive) {
            alert("Please enable the webcam to try on clothes.");
            return;
        }

        console.log("Sending request to backend...");

        try {
            // Fetch the image to upload
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Convert to File (this can also work with the appropriate MIME type)
            const file = new File([blob], "image.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("shirt", file);

            // Send the image to backend for processing
            const backendResponse = await axios.post("http://localhost:5000/try-on", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob", // This ensures that the response is treated as a blob
            });
            
            console.log('Response Blob:', backendResponse.data); 
            
            // Convert the backend response to a URL and display the processed image
            const processedImageURL = URL.createObjectURL(backendResponse.data);
            console.log('Processed Image URL:', processedImageURL);  // Check if the URL is valid
            setSelectedImage(processedImageURL);
            
        } catch (error) {
            console.error("Error during try-on request:", error);
        }
    };

    const toggleWebcam = () => {
        setWebcamActive((prev) => !prev);
        setSelectedImage(null); // Reset the image when toggling the webcam

        // Stop the webcam stream when disabling
        if (webcamRef.current && webcamRef.current.stream) {
            const tracks = webcamRef.current.stream.getTracks();
            tracks.forEach((track) => track.stop());
        }
    };

    return (
        <div className="virtual-try-on">
            <div className="shirt-selection">
                <h2>Choose a Shirt:</h2>
                {/* Example shirt images */}
                <img
                    src="/shirts/shirt1.png"
                    alt="Shirt 1"
                    onClick={() => handleImageClick("/shirts/shirt1.png")}
                />
                <img
                    src="/shirts/shirt2.png"
                    alt="Shirt 2"
                    onClick={() => handleImageClick("/shirts/shirt2.png")}
                />
            </div>

            <div className="webcam-container">
                <button onClick={toggleWebcam}>
                    {webcamActive ? "Close Webcam" : "Open Webcam"}
                </button>

                {webcamActive && (
                    <>
                        {/* Display the webcam feed */}
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }} // Ensure correct webcam orientation
                        />
                        {/* Display the virtual try-on image */}
                        {selectedImage && (
                            <div className="overlay">
                                <img src={selectedImage} alt="Virtual Try-On" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VirtualTryOn;
