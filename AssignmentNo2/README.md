# 🛍️ E-Commerce App

This is a **Full Stack E-Commerce Application** built using:
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via XAMPP)

The app includes **User Authentication (Signup/Login)**, product display, and backend API integration.

---

## 🚀 Features

✅ User Signup & Login  
✅ Secure backend authentication  
✅ MySQL database integration  
✅ REST API communication (Axios)  
✅ Modern UI built with React  
✅ Fast build & hot reload using Vite  

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React (Vite), Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MySQL (XAMPP) |
| Package Manager | npm |

---

## ⚙️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

---

## 🖥️ Backend Setup

### Go to backend folder:

```bash
cd backend
```

### Install dependencies:

```bash
npm install
```

### Start XAMPP and create a database:

1. Open **XAMPP Control Panel**
2. Start **Apache** and **MySQL**
3. Open **phpMyAdmin**
4. Create a new database (e.g., `ecommerce_db`)
5. Import your SQL file or let backend create tables automatically (if configured)

### Start the backend server:

```bash
npm start
```

Your backend will run at:

```
http://localhost:5000/
```

---

## 💻 Frontend Setup

### Go to frontend folder:

```bash
cd frontend
```

### Install dependencies:

```bash
npm install
```

### Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173/
```

---


## 🔗 API Endpoints

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/api/signup`   | Register new user   |
| POST   | `/api/login`    | Login existing user |
| GET    | `/api/products` | Get all products    |
