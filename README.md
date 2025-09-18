# Reward-Based Crowdfunding Platform 🚀

A full-stack web application built with the MERN stack that allows creators to launch crowdfunding campaigns and users to support them by pledging funds. This platform features user authentication, campaign management, and image hosting through Cloudinary.



## Features ✨

* **User Authentication:** Secure user registration and login functionality.
* **Campaign Management:** Authenticated users can create, view, edit, and delete their own campaigns.
* **Dynamic Image Uploads:** Seamless image uploads for campaigns, hosted on Cloudinary.
* **Pledge System:** Users can pledge money to support campaigns they believe in.
* **Responsive UI:** A clean and modern user interface built with Tailwind CSS and Chakra UI.
* **Detailed Views:** Users can browse all campaigns or view the specific details of a single campaign.

## Technology Stack 🔧

* **Frontend:**
    * React.js (with Vite)
    * React Router
    * Axios
    * Tailwind CSS
    * Chakra UI
* **Backend:**
    * Node.js
    * Express.js
* **Database:**
    * MongoDB (with Mongoose)
* **Services:**
    * Cloudinary (for image storage)
    * JSON Web Tokens (JWT) for authentication

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

* Node.js and npm installed
* MongoDB account (local or Atlas)
* Cloudinary account

### 1. Clone the Repository

```bash
git clone [https://github.com/Satyakush/Reward_Based_Crowdfund_Platform.git](https://github.com/Satyakush/Reward_Based_Crowdfund_Platform.git)
cd Reward_Based_Crowdfund_Platform

Backend Setup -
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory
touch .env

# .env in /server

# MongoDB Connection String
MONGO_URI="mongodb+srv://your_username:YOUR_PASSWORD@your-cluster.mongodb.net/your_database?retryWrites=true&w=majority"

# JWT Secret for authentication
JWT_SECRET="your_super_secret_jwt_key"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

Frontend Setup -

# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

 Run the Application

 In your first terminal (from /server):
 npm run dev

 In your second terminal (from /client):
 npm run dev

 Open your browser and navigate to http://localhost:5173 to see the application in action.