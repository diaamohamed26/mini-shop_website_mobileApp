# 🛍️ Mini Shop

A full-stack eCommerce platform built with React, React Native, Node.js, Express, and Supabase. The project includes a responsive web application, a mobile application, and a backend API that provides authentication, product management, wishlist, cart, and order functionality.

## 🎥 Demo Video

Watch the complete project presentation:

https://www.loom.com/share/24ca370848c74ba99cdbe4c0cde80db9

---

## 📂 Project Structure

```bash
mini-shop/
│
├── backend/      # Express.js API
├── frontend/     # React + Vite Web App
├── mobile/       # React Native + Expo App
└── README.md
```

---

## 🚀 Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* User Profile

### Products

* Product Listing
* Product Details
* Product Search
* Product Categories
* Product Variants (Size & Color)
* Product Images

### Wishlist

* Add to Wishlist
* Remove from Wishlist
* View Wishlist

### Cart

* Add Products to Cart
* Update Quantity
* Remove Products
* Calculate Total Price

### Orders

* Create Orders
* View Order History

### Admin Dashboard

* Add Products
* Edit Products
* Delete Products
* Upload Product Images
* Manage Product Inventory
* Manage Categories

### Mobile Application

* Authentication
* Product Browsing
* Product Details
* Wishlist Management
* Shopping Cart
* User Profile

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* JWT
* Multer

### Mobile

* React Native
* Expo
* Expo Router
* Zustand
* AsyncStorage

### Database & Storage

* Supabase Database
* Supabase Storage

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/diaamohamed26/mini-shop_website_mobileApp.git

cd mini-shop_website_mobileApp
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001

JWT_SECRET=your_jwt_secret

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run backend:

```bash
npm run dev
```

Backend URL:

```bash
http://localhost:5001
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```bash
http://localhost:5173
```

---

## Mobile Setup

```bash
cd mobile

npm install

npx expo start
```

Run the application using:

* Expo Go
* Android Emulator
* iOS Simulator

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

### Cart

```http
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
```

### Orders

```http
GET    /api/orders
POST   /api/orders
```

---

## 📸 Screenshots

### Web Application

* Home Page
* Product Listing
* Product Details
* Wishlist
* Shopping Cart
* Admin Dashboard

### Mobile Application

* Home Screen
* Product Details
* Wishlist
* Cart
* Profile

---

## 👨‍💻 Author

Diaa Mohamed

GitHub:
https://github.com/diaamohamed26

---

## 📄 License

This project is licensed under the MIT License.
