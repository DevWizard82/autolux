# Luxury Cars Rental Agency – Full‑Stack Project

This repository contains a **full‑stack web application for a luxury cars rental agency**. The platform is designed to showcase high‑end vehicles, manage rentals, and provide an immersive user experience using a modern frontend and a robust backend.

---

## 📁 Project Structure

```bash
root/
├── frontend/        # Vite + Frontend source code
│   ├── src/
│   │   ├── css/
│   │   ├── js/
│   ├── public/
│   │   ├── asssets/
│   │       ├── images/
│   │       ├── models/
│   ├── package.json
│   └── package-lock.json
│
├── backend/         # Node.js backend (API / server)
│   ├── package.json
│   ├── package-lock.json
│   ├── routes/
│   └── server.js
│   └── routes/
│   └── middlewares/
│   └── db/
│
├── .gitignore
└── README.md
```

---

## 🛠️ Requirements

Make sure the following are installed on your machine:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

Check versions:

```bash
node -v
npm -v
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

---

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

#### Environment variables

Create a `.env` file based on the example:

Fill in the required values inside `.env`.

#### Run backend

```bash

npm run dev
```

---

### 3️⃣ Frontend setup (Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually be available at:

```
http://localhost:5173
```

---

## 📦 Dependencies

All dependencies are defined in:

- `frontend/package.json`
- `backend/package.json`

You **do not** need to run `npm init`.
Just run:

```bash
npm install
```

---

## 🔐 Security Notes

- `node_modules/` and `.env` files are intentionally ignored
- Sensitive data should **never** be committed
- Use `.env.example` to document required environment variables

---

## 🧪 Common Commands

### Frontend

```bash
npm run dev
```

### Backend

```bash
npm run dev
```

---

## ❗ Troubleshooting

- If dependencies fail to install, delete `node_modules` and run `npm install` again
- Ensure correct Node.js version is installed
- Make sure the backend is running before testing frontend features that depend on the API

---

## 📄 License

This project is for **educational purposes**.

---

## 👤 Author

Developed by **Anas**

---

If you have any issues running the project, feel free to contact the author or open an issue.
