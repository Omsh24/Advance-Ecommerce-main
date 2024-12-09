# Advanced E-commerce Website with Virtual Try-On Feature

This is an advanced e-commerce platform built using the MERN stack, integrated with an AI-powered virtual try-on feature. The virtual try-on is developed using OpenCV, MediaPipe, and Python, enabling users to try products virtually, enhancing their shopping experience.

---

## 🎥 Demo Video
[![Watch Demo](https://img.youtube.com/vi/your-video-id-here/maxresdefault.jpg)](https://your-video-link-here.com)

---
## 🖼️ Screenshots

### Home Page
![Home Page](path/to/home-page-image.png)

### Product Page
![Product Page](path/to/product-page-image.png)

### Virtual Try-On Feature
![Virtual Try-On](path/to/virtual-try-on-image.png)

## 📖 About
This project combines the functionality of an e-commerce platform with cutting-edge AI for virtual try-ons. It allows users to:
- Virtually try on clothes using an AI-based overlay system.
- Experience seamless navigation with a responsive and interactive UI.

The virtual try-on system leverages MediaPipe and OpenCV for real-time image processing, providing a smooth and intuitive user experience.

---

## 🛠️ Tech Stack

### Frontend:
- React.js with Tailwind CSS for dynamic and responsive user interfaces.

### Backend:
- Node.js with Express.js for managing API routes and server logic.
- MongoDB for database management.

### ML Server:
- Python with OpenCV and MediaPipe for virtual try-on capabilities.

---

## 📂 Folder Structure
### Key Directories

- **client/**: Contains the React frontend application
  - `src/`: Core UI components and application logic
  - `public/`: Static assets like images, icons, etc.

- **server/**: Node.js backend with Express
  - `routes/`: API endpoint definitions
  - `controllers/`: Business logic and request handling
  - `models/`: Database models for MongoDB

- **ml_server/**: Machine learning server for virtual try-on functionality
  - `main.py`: Primary entry point

---

## 🚀 Features
- **User Authentication:** Secure sign-up and log-in system.
- **Product Browsing:** Explore a catalog of products with filters.
- **Virtual Try-On:** AI-powered real-time try-on for clothes using MediaPipe and OpenCV.
- **Shopping Cart:** Add products to the cart and proceed to checkout.
- **Search:** Quickly find products using a search bar.
- **Responsive Design:** Optimized for all devices.

---

## ⚙️ Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/your-username/advanced-ecommerce-virtual-tryon.git
cd advanced-ecommerce-virtual-tryon

```
## Dependencies and Installation

### Install Dependencies

#### Client
```bash
cd client
npm install
```

```bash
cd mlServer
pip install flask flask-socketio mediapipe opencv-python numpy
```
## 🌐 Deployment
The project is deployed at [advance-ecommerce-beta.vercel.app](https://advance-ecommerce-beta.vercel.app/)

## 🤝 Contributing
Contributions are welcome! Fork this repository, create a feature branch, and submit a pull request.

## 📧 Contact
For queries, reach out to rachitjainjaipur@gmail.com
