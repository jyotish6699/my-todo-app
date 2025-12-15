# 🛠️ Tech Stack & Dependencies

This document provides a detailed list of all technologies, languages, frameworks, libraries, and tools used in this project, explaining **why** they are used and **what** they do.

---

## 💻 Core Languages

- **JavaScript (ES6+)**: The primary programming language used for both Frontend and Backend logic.
- **HTML5**: The structure of the web pages.
- **CSS3**: The styling language used (via Tailwind).

---

## 🏗️ Frameworks & Runtimes

### Frontend

- **React (v18)**: A JavaScript library for building user interfaces.
  - _Why?_ Allows us to create reusable components (like `TodoForm`, `Sidebar`) and manage dynamic state efficiently.
- **Vite**: A build tool and development server.
  - _Why?_ It is significantly faster than standard `create-react-app`, offering instant hot-reloading during development.
- **LocalStorage API**: Web API for client-side storage.
  - _Why?_ Persists data and preferences for Guest users who don't have a backend account.

### Backend

- **Node.js**: The runtime environment that executes JavaScript on the server.
  - _Why?_ Allows us to use the same language (JS) for both client and server.
- **Express.js**: A minimal web application framework for Node.js.
  - _Why?_ Simplifies creating API routes (`GET`, `POST`) and handling middleware (authentication).

---

## 📚 Libraries & Packages

### Frontend (`frontend/package.json`)

| Package                        | Purpose                                                                                                                            |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **`axios`**                    | **HTTP Client**. Used to send requests (GET, POST) to the backend API smoothly.                                                    |
| **`react-router-dom`**         | **Navigation**. Allows switching between pages (`/`, `/login`, `/profile`) without reloading the browser.                          |
| **`framer-motion`**            | **Animations**. Powers the smooth drag-and-drop effects and page transitions.                                                      |
| **`react-icons`**              | **Icons**. Provides the FontAwesome/Material icons (Trash can, Edit pencil, etc.) used in the UI.                                  |
| **`tailwindcss`**              | **Styling**. A utility-first CSS framework that lets us style components directly in HTML/JSX (e.g., `flex`, `p-4`, `bg-red-500`). |
| **`postcss` & `autoprefixer`** | **CSS Tooling**. Helps Tailwind CSS work correctly across different browsers.                                                      |

### Backend (`backend/package.json`)

| Package                  | Purpose                                                                                                                     |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **`mongoose`**           | **Database Tool**. An ODM (Object Data Modeling) library that makes interacting with MongoDB easy using structured Schemas. |
| **`bcryptjs`**           | **Security**. Encrypts (hashes) user passwords before saving them to the database so they are never stored as plain text.   |
| **`jsonwebtoken` (JWT)** | **Authentication**. Generates secure tokens upon login that verify the user's identity for subsequent requests.             |
| **`cors`**               | **Network Security**. Allows the Frontend (running on port 5173) to talk to the Backend (running on port 5000).             |
| **`dotenv`**             | **Configuration**. Loads secret keys (like Database URL) from the `.env` file so they aren't hardcoded.                     |
| **`nodemon`**            | **Dev Tool**. Automatically restarts the backend server whenever you change a file (Development only).                      |

---

## 🗄️ Database

- **MongoDB**: A NoSQL database.
  - **Compass**: The GUI tool installed on your computer to view/edit local data.
  - **Atlas**: The cloud service hosting the production database.

---

## 🛠️ Development Tools

- **Git**: Version control system to track changes and history.
- **GitHub**: Cloud hosting for the code repository.
- **VS Code**: The Code Editor.
- **Postman** (Optional): Tool for testing API endpoints manually.
- **Ngrok** (Optional): Tunneling tool to expose your local server to the internet for mobile testing.
- **Docker** (Optional): Containerization platform used (previously) to run the database in an isolated environment.

---

## ☁️ Deployment Services

- **Render**: Hosting service for the **Backend** (Node.js/Express).
- **Vercel**: Hosting service for the **Frontend** (React/Vite).
