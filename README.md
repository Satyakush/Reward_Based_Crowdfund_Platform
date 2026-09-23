<div align="center">

# 💰 Reward-Based Crowdfunding Platform

### Create · Support · Fund · Grow

A full-stack **MERN crowdfunding platform** where creators can launch campaigns and users can support them through reward-based pledges.

<p>
<a href="https://github.com/Satyakush/Reward_Based_Crowdfund_Platform"><img src="https://img.shields.io/badge/Source%20Code-111827?style=for-the-badge&logo=github&logoColor=white" alt="Source Code"></a>
<img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React">
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

</div>

---

## 🎯 Project Overview

The platform provides a complete campaign workflow:

**Register → Authenticate → Create Campaign → Manage Campaign → Receive Pledges**

Creators can manage campaigns they own, while users can explore campaigns and participate through pledges.

---

## ✨ Key Features

### 👤 User Experience
- User registration and login
- JWT-based authentication
- Campaign discovery
- Campaign detail pages
- Pledge/support workflow
- Responsive React interface

### 🎯 Campaign Management
- Create campaigns
- View campaigns
- Edit owned campaigns
- Delete owned campaigns
- Campaign image uploads
- Campaign ownership enforcement

### ☁️ Media & Data
- Cloudinary image storage
- MongoDB persistence
- Mongoose data modeling
- REST API communication

---

## 🏗️ Architecture

~~~
React + Vite
     │ REST / Axios
     ▼
Node.js + Express
     │
     ├── Routes
     ├── Controllers
     ├── Middleware
     └── Models
          │
          ├──────────────► MongoDB Atlas
          └──────────────► Cloudinary
~~~

Backend flow:

**Route → Middleware → Controller → Model / Database**

---

## 🔐 Authentication & Authorization

JWT protects authenticated operations, while backend ownership checks ensure that users can only manage campaigns they are authorized to modify.

- JWT authentication
- Protected API routes
- Campaign ownership validation
- Environment-based secrets
- Backend-enforced authorization
- No real credentials committed to Git

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| UI | Tailwind CSS, Chakra UI |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Image Storage | Cloudinary |
| API Style | REST |

---

## 📁 Project Structure

~~~
Reward_Based_Crowdfund_Platform/
├── client/
│   └── src/
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── index.js
    └── package.json
~~~

---

## ⚙️ Local Development

### Backend
~~~bash
cd server
npm install
npm start
~~~

### Frontend
~~~bash
cd client
npm install
npm run dev
~~~

Create server/.env locally:

~~~env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
~~~

**Never commit real credentials.**

---

## 🔎 Engineering Highlights

- Full-stack MERN architecture
- JWT-protected REST APIs
- Backend campaign ownership checks
- Cloudinary-backed image storage
- MongoDB document modeling with Mongoose
- Separation of routes, controllers, middleware and models
- Responsive React frontend

---

## 🚀 Future Improvements

- Campaign search and filtering
- Payment gateway integration
- Campaign progress analytics
- Automated testing
- Pagination
- Centralized validation and error handling

---

## 👨‍💻 Author

**Satyam Kushwaha**

[GitHub](https://github.com/Satyakush) · [Portfolio](https://satyakush.github.io/Portfolio/) · [LinkedIn](https://www.linkedin.com/in/satyam-kushwaha-06b7a5244)

<div align="center">

**Built to turn ideas into campaigns people can support.**

</div>
