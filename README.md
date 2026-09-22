# 💰 Reward-Based Crowdfunding Platform

A MERN-stack crowdfunding application where creators can launch campaigns and users can support them through pledges.

## ✨ Features

- User registration and login.
- JWT-based authentication.
- Create, view, edit and delete owned campaigns.
- Cloudinary campaign image uploads.
- Pledge/support workflow.
- Campaign detail pages.
- Responsive React frontend.
- Protected backend routes.

## 🏗️ Architecture

```text
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
          ├── MongoDB Atlas
          └── Cloudinary
```

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| UI | Tailwind CSS, Chakra UI |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Image Storage | Cloudinary |

## 🔐 Authentication & Authorization

JWT protects authenticated operations. Campaign ownership is enforced by the backend so users can manage their own campaigns without relying only on frontend restrictions.

## 📁 Structure

```text
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
```

## ⚙️ Local Development

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Create `server/.env` locally:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Never commit real credentials.**

## 🔎 Engineering Highlights

- RESTful client/server architecture.
- JWT-protected APIs.
- Backend campaign ownership checks.
- Cloudinary-backed image storage.
- MongoDB document modeling with Mongoose.
- Separation of routes, controllers, middleware and models.

## 🚀 Future Improvements

- Campaign search and filtering.
- Payment gateway integration.
- Campaign progress analytics.
- Automated tests.
- Pagination.
- Centralized validation and error handling.

## 👨‍💻 Author

**Satyam Kushwaha** · [GitHub](https://github.com/Satyakush) · [Portfolio](https://satyakush.github.io/Portfolio/)