folder structure:

my-todo-app/
├── docker-compose.yml         # 🐳 The Master Control (runs everything)
├── README.md
├── .gitignore
│
├── backend/                   # (Server Container)
│   ├── Dockerfile             # Instructions to build backend
│   ├── package.json
│   ├── .env
│   ├── server.js              # Entry point
│   └── src/
│       ├── config/            # DB connection
│       ├── controllers/       # Logic (getTasks, loginUser)
│       ├── middleware/        # Auth checks
│       ├── models/            # Database Schemas (User, Todo)
│       └── routes/            # API URLs
│           ├── authRoutes.js  # (Login/Signup)
│           ├── userRoutes.js  # (Profile)
│           └── todoRoutes.js  # (Thumbnail/Tasks)
│
└── frontend/                  # (Client Container)
    ├── Dockerfile             # Instructions to build frontend
    ├── package.json
    ├── vite.config.js         # (Or webpack)
    ├── public/
    └── src/
        ├── assets/            # Images/Icons
        ├── context/           # Global State (AuthContext)
        ├── hooks/             # Custom hooks (useAuth)
        ├── layouts/           # The Sidebar Layout we discussed
        │   └── MainLayout.jsx
        │
        ├── components/        # Reusable smaller parts
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── TodoCard.jsx   # (The "Thumbnail" for a task)
        │   └── InputForm.jsx
        │
        └── pages/             # The Main Routes you asked for
            ├── Login.jsx      # (/login)
            ├── Signup.jsx     # (/signup)
            ├── Profile.jsx    # (/profile)
            └── Dashboard.jsx  # (/thumbnail - The main list)