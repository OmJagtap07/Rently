# 🏢 RentManager

**RentManager** is a professional Property Management and Expense Tracking SaaS built with modern web technologies. It provides a seamless interface for landlords and property managers to track their financial transactions, manage tenants, and gain insights into their rental property income and expenses.

🔗 **Live Demo:** [RentManager on Netlify](https://rentmanager0.netlify.app/)

---

## ✨ Features

- **🔐 Secure Authentication:** Seamless Google Sign-In powered by Firebase Authentication.
- **🏡 Property Management:** Create and manage multiple properties, each with its own unique join code for easy tenant onboarding.
- **🧑‍🤝‍🧑 Role-Based Access:** Dedicated interfaces for Landlords (management) and Tenants (viewing dues and submitting requests).
- **📊 Interactive Dashboard:** Visual financial overview with dynamic charts (powered by Recharts).
- **💸 Expense & Income Tracking:** Easily log, categorize, and delete transactions. Grouped by date for easy reading.
- **👥 Tenant Management:** Keep track of tenants and associate incomes with specific tenants.
- **📈 Financial Reports:** Detailed insights into your monthly balances, total income, and total expenses.
- **📱 Fully Responsive:** Carefully crafted mobile-friendly design that works perfectly on all devices.
- **🌙 Modern Dark UI:** Sleek, dark theme built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- A Firebase project with Authentication (Google Sign-in) and Firestore Database enabled.

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   git clone <your-repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components (Buttons, Cards, etc.)
├── context/          # React Contexts (AuthContext, PropertyContext)
├── hooks/            # Custom React hooks (useAuth, useProperties)
├── lib/              # Utility functions and helpers
├── pages/            # Application pages
│   ├── About.jsx
│   ├── Dashboard.jsx
│   ├── Properties.jsx# Property management interface
│   ├── Reports.jsx
│   ├── Settings.jsx
│   └── Tenants.jsx
├── App.jsx           # Main application entry & role-based routing
├── LandlordApp.jsx   # Dedicated app view for Landlords
├── TenantApp.jsx     # Dedicated app view for Tenants
└── firebase.js       # Firebase initialization and configuration
```

## 📜 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to check for code quality.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
