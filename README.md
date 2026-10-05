<div align="center">

# 💰 Reward-Based Crowdfunding Platform

### Create · Support · Fund · Grow

A full-stack **MERN crowdfunding platform** where creators can launch campaigns and users can support them through reward-based pledges.

<p>
<a href="https://crowdfund-frontend-one.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-2563eb?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"></a>
<a href="https://github.com/Satyakush/Reward_Based_Crowdfund_Platform"><img src="https://img.shields.io/badge/Source%20Code-111827?style=for-the-badge&logo=github&logoColor=white" alt="Source Code"></a>
<img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React">
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

</div>

---

## 🌐 Live Platform

**[Launch Crowdfunding Platform →](https://crowdfund-frontend-one.vercel.app/)**

## 🎯 Project Overview

The platform provides a complete campaign workflow:

**Register → Authenticate → Create Campaign → Manage Campaign → Receive Pledges**

Creators can manage campaigns they own, while users can explore campaigns, select reward tiers, and contribute through Razorpay.

---

## ✨ Key Features

### 👤 User Experience
- User registration and login
- JWT-based authentication
- Campaign discovery
- Campaign detail pages
- Reward-based Razorpay payment workflow
- Payment verification and webhook reconciliation
- Backer payment history and contribution analytics
- Creator campaign and reward analytics
- Notification center with unread tracking
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
- Campaign ownership and lifecycle validation
- Active / funded / ended campaign states
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
| Payments | Razorpay |
| Security | Helmet, CORS allowlist, API rate limiting |
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
CLIENT_URLS=http://localhost:5173
ADMIN_EMAILS=your-admin-email@example.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
~~~

**Never commit real credentials.**

---

## 🚀 Production Checklist

1. Copy `server/.env.example` to `server/.env` and set production values.
2. Set `CLIENT_URLS` to the deployed frontend origin(s).
3. Set `VITE_API_URL` in the frontend to the deployed backend origin.
4. Configure the Razorpay webhook endpoint as `<API_URL>/api/payment-webhooks/razorpay` and use the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
5. Use Razorpay test keys for staging and live keys only for the production environment.
6. Deploy the backend and verify `GET /api/health` before opening the frontend.
7. Run a smoke test: register/login → create campaign → edit → back with Razorpay → verify payment → dashboard → notification bell.
8. Configure `ADMIN_EMAILS` only for trusted administrator accounts.

## 🔎 Engineering Highlights

- Full-stack MERN architecture
- JWT-protected REST APIs
- Backend campaign ownership checks
- Cloudinary-backed image storage
- MongoDB document modeling with Mongoose
- Separation of routes, controllers, middleware and models
- Responsive React frontend

---

## 🧪 Pre-Deployment Verification

- `npm run build` succeeds in `client/`.
- Backend starts with `npm start` and connects to MongoDB.
- Razorpay test payment completes and appears in dashboard history.
- Razorpay webhook receives and verifies signed events.
- Ended and fully funded campaigns cannot accept new payments.
- Protected endpoints reject missing or invalid JWTs.
- CORS allows only configured frontend origins.
- No real `.env` credentials are committed.

---

## 👨‍💻 Author

**Satyam Kushwaha**

[GitHub](https://github.com/Satyakush) · [Portfolio](https://satyakush.github.io/Portfolio/) · [LinkedIn](https://www.linkedin.com/in/satyam-kushwaha-06b7a5244)

<div align="center">

**Built to turn ideas into campaigns people can support.**

</div>
