# AutoLux Fleet Command 🏎️✨

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-deb887?style=for-the-badge)](https://glowing-paletas-7e25a6.netlify.app)
[![Backend Status](https://img.shields.io/badge/Backend-Online-success?style=for-the-badge)](https://autolux-production.up.railway.app)

AutoLux is a premium, full-stack luxury car rental management system. Designed for high-end automotive fleets, it features a highly interactive UI, real-time currency conversion, seamless multi-language support, and a secure, scalable PostgreSQL backend.

## 🌟 Key Features

- **Global Ready (i18n):** Full translation support for 10 different languages (English, French, Arabic, Spanish, German, etc.).
- **Real-Time Currency Conversion:** Live fetching of exchange rates to display pricing in the user's preferred currency.
- **Dynamic Filtering & Search:** Instantly filter the fleet by city, category (Luxury, Sport, Hypercar, Electric), or search query.
- **Secure Authentication:** JWT-based secure login and session management for administrators and clients.
- **Automated Email Notifications:** Integrated Nodemailer via Gmail for reservation confirmations.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing using Tailwind CSS.

## 🛠️ Tech Stack

**Frontend (Client):**

- Vanilla JavaScript (ES6+)
- Vite (Build Tool)
- Tailwind CSS
- Axios (Data Fetching)
- VanillaTilt.js (3D UI Interactions)

**Backend (Server):**

- Node.js & Express.js
- PostgreSQL (Database)
- JSON Web Tokens (JWT) for Authentication
- Nodemailer (Email Services)

**Infrastructure & Deployment:**

- **Frontend:** Netlify
- **Backend:** Railway
- **Database:** Railway Provisioned PostgreSQL

## 📂 Project Structure

This project is structured as a monorepo, containing both the frontend and backend in a single repository.

```text
autolux/
├── backend/                # Node.js/Express server and API routes
│   ├── package.json
│   └── index.js
├── frontend/               # Vite frontend application
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
