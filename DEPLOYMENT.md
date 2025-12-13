# Deployment Guide

Follow these steps to deploy your Full Stack MERN Application for free.

## Prerequisites

- A [GitHub](https://github.com/) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free Database).
- A [Render](https://render.com/) account (Free Backend Hosting).
- A [Vercel](https://vercel.com/) account (Free Frontend Hosting).

---

## Step 1: Push Code to GitHub

1. Create a new public repository on GitHub called `my-todo-app`.
2. Open your terminal in the project folder and run:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/my-todo-app.git
   git push -u origin main
   ```
   _(Make sure to replace `YOUR_USERNAME` with your actual GitHub username)_

---

## Step 2: Setup MongoDB Atlas (Database)

1. Log in to **MongoDB Atlas**.
2. Create a new **Cluster** (Select the free "Shared" tier).
3. Whitelist your IP Address (Network Access -> Add IP Address -> Allow Access from Anywhere `0.0.0.0/0`).
4. Create a Database User (Database Access -> Add New Database User -> Create username/password).
5. Get Connection String (Connect -> Drivers -> Copy the string, e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

---

## Step 3: Deploy Backend (Render)

1. Log in to **Render** and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Select the `backend` folder as the **Root Directory** (if asked) or ensure settings are:
   - **Root Directory**: `backend` (Important!)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (Paste your MongoDB Connection String from Step 2)
   - `JWT_SECRET`: (Create a secret password, e.g., `mysecretkey123`)
   - `PORT`: `5000`
5. Click **Create Web Service**.
6. Once deployed, copy the **Render URL** (e.g., `https://my-todo-backend.onrender.com`).

---

## Step 4: Deploy Frontend (Vercel)

1. Log in to **Vercel** and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (Click Edit -> Select `frontend` folder).
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: (Paste your Render Backend URL + `/api`, e.g., `https://my-todo-backend.onrender.com/api`)
     _Make sure to include `/api` at the end!_
5. Click **Deploy**.

---

## Success! 🎉

Your app is now live!

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
