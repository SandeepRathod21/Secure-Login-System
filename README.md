# Secure Login System - Backend

A secure REST API built with Node.js, Express, MongoDB, and JWT authentication with Two-Factor Authentication (2FA).

## 🚀 Live API
https://secure-login-system-bb19.onrender.com

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- bcryptjs (password hashing)
- JSON Web Tokens (JWT)
- speakeasy (2FA/TOTP)
- express-validator (input validation)
- express-session

## ✨ Features
- User registration with hashed passwords
- Two-Factor Authentication (2FA) with QR code
- JWT-based session management
- Input validation and SQL injection protection
- Secure logout

## 📁 Project Structure
```
├── config/db.js
├── middleware/auth.js
├── models/User.js
├── routes/auth.js
├── server.js
└── .env
```
## 🔧 Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env` with your MongoDB URI and JWT secret
4. Run `node server.js`

## 📡 API Endpoints
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login with 2FA
- GET `/api/auth/me` - Get current user
