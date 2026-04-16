# 📝 BlogSpace — Blogging Platform
**GLA University, Mathura | Group No. 7 | B.Tech CSE 3rd Year | 2025–2026**
**Supervisor: Mr. Akash Gupta**

## 👥 Team
| Name | Roll No | Branch | Role |
|------|---------|--------|------|
| Himanshu Choudhary | 2315000969 | `feature/backend-auth` | Backend Auth |
| Himanshu Rajput | 2315000972 | `feature/backend-middleware` | Backend Middleware + Routes |
| Jai Chaudhary (Leader) | 2315001004 | `feature/frontend-components` | Frontend Components |
| Ishu Srivastava | 2315001000 | `feature/frontend-ui` | Frontend Pages |
| Krati Agrawal | 2315001155 | `feature/integration-docs` | Integration + Docs |

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt

## 🚀 How to Run

### Backend
```bash
cd server
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## ✅ Features
- User Registration & Login (JWT + bcrypt)
- Dark / Light Mode toggle
- Blog Post CRUD (Create, Read, Update, Delete)
- Protected Routes (login required)
- Admin Panel with user & post management
- Role-based access control
- Responsive UI

## 🔑 Make Admin User
1. Register → open MongoDB Compass → find your user
2. Change `"role": "user"` → `"role": "admin"` → Login again
