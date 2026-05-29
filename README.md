# Rently 🏠

A property management dashboard for landlords to track **rental income, expenses, and tenant rent collection** — all in one place.

> 🔜 **Coming soon:** Tenant portal with rent due notifications and payment history.

## 🚀 Live Demo
👉 **[rentmanager0.netlify.app](https://rentmanager0.netlify.app/dashboard)**

---

## ✨ Features

### Owner Dashboard (Available Now)
- 📊 Income vs expense overview per property
- 🏘️ Multi-property management from a single account
- 💰 Rent collection tracking per tenant
- 📈 Income and expense logging with history
- 👥 Tenant management per property

### Tenant Portal (Coming Soon)
- 🔔 Rent due notifications
- 📬 Payment confirmation and history
- 💬 Owner-tenant communication

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Deployment | Netlify |

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Tenent Overview  
![tenent](docs/screenshots/tenent.png)

### Rent Collection
![Rent Collection](docs/screenshots/report.png)

## 📁 Project Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx         ← each component = own file
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── Input.jsx
│   └── Layout.jsx             ← shared layout goes here
├── pages/
│   ├── Dashboard.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   ├── Tenants.jsx
│   └── About.jsx
├── config/
│   └── firebase.js
├── hooks/                     ← create this, even if empty now
│   └── useAuth.js
├── context/                   ← create this, even if empty now
│   └── AuthContext.jsx
├── lib/                       ← keep as-is (likely shadcn utils)
│   └── utils.js
├── App.jsx
├── main.jsx
└── index.css
```

## ⚡ Getting Started

```bash
git clone https://github.com/OmJagtap07/Rently
cd Rently
npm install
cp .env.example .env    # add your Firebase config
npm run dev
```

## 🔧 Environment Variables
Create a `.env` file at the root using `.env.example` as reference:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🗺️ Roadmap
- [x] Owner dashboard
- [x] Multi-property support  
- [x] Rent collection tracking
- [x] Income / expense logging
- [ ] Tenant portal
- [ ] Rent due notifications
- [ ] Payment history for tenants
- [ ] Export reports as PDF