# 🏗️ Architecture & Walking Guide

This document provides a complete overview of the **My Todo App** architecture. It explains how files are organized, how components interact, how data flows from the Database to the API and then to your Screen, and how the networking works in both local and deployed environments.

---

## 📂 1. Directory Structure

### **Backend (`/backend`)** - The Brain 🧠

_Where the data lives and rules are enforced._

| Folder/File             | Purpose                                                                                        |
| :---------------------- | :--------------------------------------------------------------------------------------------- |
| **`server.js`**         | **Start here.** The entry point. It starts the server, connects to the DB, and sets up routes. |
| **`models/`**           | **Data Blueprints**.                                                                           |
| ` └ todoModel.js`       | Defines what a "Todo" looks like (text, color, isCompleted).                                   |
| ` └ userModel.js`       | Defines a "User" (name, email, password, profilePic).                                          |
| **`controllers/`**      | **The Logic**. Functions that actually _do_ things.                                            |
| ` └ todoController.js`  | `getTodos`, `setTodo`, `updateTodo`, `deleteTodo`.                                             |
| ` └ userController.js`  | `registerUser`, `loginUser`, `getMe` (profile).                                                |
| **`routes/`**           | **The Traffic Police**. Directs URLs to Controllers.                                           |
| ` └ todoRoutes.js`      | Maps `GET /api/todos` → `todoController.getTodos`.                                             |
| ` └ userRoutes.js`      | Maps `POST /api/users/login` → `userController.loginUser`.                                     |
| **`middleware/`**       | **Security Guards**.                                                                           |
| ` └ authMiddleware.js`  | Checks if a request has a valid `token` before allowing access.                                |
| ` └ errorMiddleware.js` | Formats error messages nicely (avoids ugly HTML errors).                                       |
| **`config/`**           | **Settings**.                                                                                  |
| ` └ db.js`              | Connects to MongoDB (Local or Atlas).                                                          |

<br>

### **Frontend (`/frontend`)** - The Face 💅

_What the user sees and interacts with._

| Folder/File               | Purpose                                                                  |
| :------------------------ | :----------------------------------------------------------------------- |
| **`vite.config.js`**      | **Configuration**. Sets up the server proxy (`/api`) and build settings. |
| **`src/main.jsx`**        | **Start here.** Bootstraps React and injects it into HTML.               |
| **`src/pages/`**          | **Full Screens**.                                                        |
| ` └ Dashboard.jsx`        | The main app. Contains the sticky notes board and sidebar.               |
| ` └ Login.jsx`            | Login form page.                                                         |
| ` └ Register.jsx`         | Sign up page.                                                            |
| ` └ Profile.jsx`          | User profile management.                                                 |
| ` └ Settings.jsx`         | App customization (dark mode, density).                                  |
| **`src/components/`**     | **Reusable Parts**.                                                      |
| ` └ Sidebar.jsx`          | The left navigation menu.                                                |
| ` └ TodoForm.jsx`         | The logic for creating/updating a sticky note.                           |
| ` └ MainHeader.jsx`       | Top bar (Search, Notification, Profile Pic).                             |
| **`src/features/`**       | **API Services** (Redux-style organization).                             |
| ` └ auth/authService.js`  | Handles Login/Register API calls. Store tokens in LocalStorage.          |
| ` └ todos/todoService.js` | Handles Todo CRUD API calls (`get`, `create`, `delete`).                 |
| **`src/context/`**        | **Global State**.                                                        |
| ` └ AuthContext.jsx`      | Keeps track of "Is user logged in?" across the entire app.               |
| ` └ ThemeContext.jsx`     | Keeps track of "Dark Mode" and custom colors.                            |

---

## 🔄 2. Data Flow (How it Works)

Let's trace what happens when a user **Creates a Todo**:

### 1️⃣ User Action (Frontend)

1. User types "Buy Milk" in `TodoForm.jsx` and hits Enter.
2. `TodoForm` calls `handleTodoAdded` in `Dashboard.jsx`.
3. `Dashboard` calls `todoService.createTodo(text, token)`.

### 2️⃣ Network Request (API)

1. `todoService.js` sends an **HTTP POST** request to `https://<backend>/api/todos`.
   - **Local**: Uses Proxy (`/api/...` -> `localhost:5000`).
   - **Prod**: Uses `VITE_API_BASE_URL` (`https://onrender.../api/...`).
2. The request carries the **JWT Token** in the header for security.

### 3️⃣ Server Processing (Backend)

1. **Server (`server.js`)** receives request on `/api/todos`.
2. **Router (`todoRoutes.js`)** sees it's a `POST` and passes it to `protect` middleware.
3. **Middleware (`authMiddleware.js`)** verifies the Token.
   - If valid: Attaches `req.user` (User ID) to the request.
   - If invalid: Sends 401 Error.
4. **Controller (`todoController.js`)**:
   - Validates data (is text present?).
   - Creates a new Todo object attached to that User ID.
   - Saves it to MongoDB.

### 4️⃣ Database (MongoDB)

1. MongoDB receives the data and stores it permanently.
   - **Local**: Stored on your laptop disk (via Compass).
   - **Atlas**: Stored in the cloud (AWS/Google Cloud).

### 5️⃣ Response

1. Database confirms save.
2. Controller sends back the new Todo object (JSON) with status `200 OK`.
3. Frontend receives the JSON.
4. `Dashboard.jsx` updates the `todos` state (`setTodos([...todos, newTodo])`).
5. React detects the state change and **Re-renders** the screen to show the new note.

---

## 🌐 3. Networking & Environments

### **Local Development 🏠**

_Everything runs on your machine._

- **Browser**: `http://localhost:5173`
- **Frontend**: Vite Server (Terminal 2)
  - _Proxy_: Forwards `/api` calls to `localhost:5000`.
- **Backend**: Node Server (Terminal 1) at `localhost:5000`.
- **Database**: MongoDB Community (`localhost:27017` or `27018`).

### **Mobile Testing 📱**

_Phone acts as external user._

- **Phone Browser**: Accesses via **ngrok** tunnel (`https://xyz.ngrok-free.app`).
- **Ngrok**: Forwards public internet traffic -> Your Laptop port `5173`.
- **Flow**: Phone -> Ngrok -> Vite -> Backend -> Local DB.

### **Production Deployment ☁️**

_Live on the internet._

- **User**: Accesses `https://my-todo-app.vercel.app`.
- **Frontend (Vercel)**:
  - Reads `VITE_API_BASE_URL`.
  - Sends API calls to Render.
- **Backend (Render)**:
  - Receives requests.
  - Reads `MONGO_URI` (Env Var).
  - Connects to MongoDB Atlas.
- **Database (Atlas)**:
  - Cloud Cluster0.

---

## 🔑 Key Concepts to Remember

1.  **JWT (JSON Web Token)**: The "Passport". When you log in, the server gives you a token. You must show this token with every request (handled by `authService`) to prove who you are.
2.  **State Management**: `useState` is used for simple temporary data (like form input). `Context` is used for global data (like "Who is logged in?").
3.  **Proxy vs. CORS**:
    - **Local**: We use Proxy to trick the browser into thinking frontend and backend are the same.
    - **Prod**: Frontend and Backend are different domains. We use **CORS** (Cross-Origin Resource Sharing) in `server.js` to allow them to talk.
