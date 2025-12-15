# 📝 My Todo App (MERN Stack)

A modern, full-stack Task Management application built with the MERN stack (MongoDB, Express, React, Node.js). It features secure user authentication, a beautiful UI with dark/light modes, drag-and-drop task management, and a robust sticky-note style interface.

![Project Preview](https://via.placeholder.com/800x400.png?text=Todo+App+Preview)

## ✨ Features

- **🔐 Authentication**: Secure Login & Registration using JWT (JSON Web Tokens).
- **🎨 Beautiful UI**: Modern design with Tailwind CSS, including Dark Mode support.
- **📌 Sticky Notes**: Visual task management resembling digital sticky notes.
- **🔄 Drag & Drop**: Reorder your tasks easily with smooth animations.
- **⚙️ Customization**: Adjust view density, card styles, and dashboard colors.
- **🏗️ Guest Mode**: Try the app functionality without creating an account. Settings and preferences are saved locally.
- **📱 Responsive**: Works seamlessly on desktop and mobile devices (includes mobile-optimized layout).
- **🔍 Filter & Search**: Easily find tasks by status (Today, Important, Completed).
- **☁️ Hybrid Database**: Uses Local MongoDB for development and MongoDB Atlas for production.

## 🛠️ Tech Stack

**Frontend:**

- **React**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Framer Motion**: For smooth animations and drag-and-drop.
- **React Icons**: Comprehensive icon library.
- **Axios**: Promise-based HTTP client.

**Backend:**

- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated web framework for Node.js.
- **MongoDB**: NoSQL database (Local Community Edition + Atlas Cloud).
- **Mongoose**: ODM library for MongoDB and Node.js.
- **Bcrypt**: Password hashing and security.
- **JWT**: Stateless user authentication.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (for local dev) or Docker
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/my-todo-app.git
   cd my-todo-app
   ```

2. **Install Dependencies**

   ```bash
   # Install Backend
   cd backend
   npm install

   # Install Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   - **Backend**: Create `.env` in `backend/`:

     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/my-todo-app  # Local DB
     JWT_SECRET=your_secret_key
     ```

   - **Frontend**: (Optional for local) `.env` in `frontend/`:
     ```env
     # Not required locally as we use Vite Proxy, but for Prod:
     VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```

### Running the App

1. **Start MongoDB** locally (or via Docker).

2. **Start Backend**

   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

Open `http://localhost:5173` to view it in the browser.

## � Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to **Render (Backend)** and **Vercel (Frontend)**.

## 📂 Project Structure

```bash
my-todo-app/
├── backend/            # Express Server & API Routes
│   ├── config/         # Database connection
│   ├── controllers/    # Route logic
│   ├── models/         # Mongoose schemas
│   └── routes/         # API endpoints
├── frontend/           # React Client
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state (Auth)
│   │   ├── features/   # Redux-like services
│   │   ├── pages/      # App pages (Dashboard, Login)
│   │   └── utils/      # Helper functions
└── docker-compose.yml  # (Optional) Docker orchestration
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License

This project is licensed under the MIT License.
