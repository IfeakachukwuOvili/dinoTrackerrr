# 🦕 dinoTracker

**dinoTracker** is a full-stack savings and expense tracking app. Users can sign up, manage multiple savings plans, track expenses, and securely delete their accounts and data.

Built for speed during a hackathon, but designed with full functionality and secure user/data handling.

Originally the project was a hackathon challenge but we could not meet up to deadline so I came back months later to "fix it".

---

## 📑 Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Frontend](#frontend)
- [Backend](#backend)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Account & Data Management](#account--data-management)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- User sign up, login, and logout with email validation
- Multiple user accounts supported
- Add, edit, and manage multiple savings plans per user
- Expense tracking per user
- Profile modal for:
  - Editing user info
  - Switching themes (light/dark)
  - Deleting account (with confirmation)
- Secure data deletion: removes all related plans and expenses on account deletion

---

## 🏗 Architecture Overview

- **Frontend:** React (Vite) app communicating with backend via REST API
- **Backend:** Node.js + Express with MongoDB (Mongoose)
- **Data Models:** User, Plan, Expense (linked by user email)

---

## 🎨 Frontend

Located in `/Frontend`.

### Key Components

- `LoginPage.jsx` – User authentication
- `SignUp.jsx` – Registration with validation
- `AddPlan.jsx` – Create/manage savings plans
- `ProfileModal.jsx` – Edit profile, theme switch, delete account
- `ConfirmPopup.jsx` – Reusable confirmation modal

### State Management

- React Hooks
- `localStorage` for session persistence

### User Flow

1. User signs up or logs in
2. Adds or edits savings plans and expenses
3. Uses profile modal for profile changes, theme switching, or account deletion
4. On deletion, user and all associated data are removed and user is logged out

---

## ⚙️ Backend

Located in `/Backend`.

### Key Files

- `index.js` – Main Express server and route definitions
- `models/User.js` – Mongoose schema for users
- `models/Plan.js` – Mongoose schema for savings plans
- `models/Expense.js` – Mongoose schema for expenses

### Data Cleanup

Deleting a user automatically deletes all related plans and expenses.

---

## 🛠 Setup & Installation

### Prerequisites

- Node.js & npm
- MongoDB (local or MongoDB Atlas)

### Backend

```bash
cd Backend
npm install
npm run dev
# or
node index.js
```
```bash
cd Frontend
npm install
npm run dev
```

### Environment
- Backend: http://localhost:5000
- Frontend: http://localhost:5173 (Vite default)
---


### API EndPoints
| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/api/users`                  | Create a new user           |
| GET    | `/api/users`                  | List all users              |
| GET    | `/api/users/:id`              | Get user by ID              |
| PUT    | `/api/users/:id`              | Update user                 |
| DELETE | `/api/users/:id`              | Delete user and their data  |
| POST   | `/api/plans`                  | Create a savings plan       |
| GET    | `/api/plans?userEmail=...`    | Get all plans for a user    |
| POST   | `/api/expenses`               | Create an expense           |
| GET    | `/api/expenses?userEmail=...` | Get all expenses for a user |
---
🔐 Account & Data Management
- Multiple Accounts: Each user signs up with a unique email and has isolated data
- Account Deletion: Accessible from the profile modal, with confirmation prompt; triggers full data removal (plans and expenses)
- Session Handling: Sessions are maintained via localStorage

## 🧰 Tech Stack
- Frontend: React (Vite), Inline CSS, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose)
- Other Tools: CORS, dotenv
---

## 🤝 Contributing
- Contributions are welcome!
- Fork this repo and submit a pull request. For major changes, please open an issue first.
---

### License
MIT License


