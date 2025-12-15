# Deployment Guide

Follow these steps to deploy your Full Stack MERN Application for free.

## Database Strategy

- **Local Development**: Uses your local computer's database (MongoDB Community/Compass). Data stays on your laptop.
- **Production (Deployment)**: Uses MongoDB Atlas (Cloud). Data is stored securely in the cloud.

---

## Prerequisites

- A [GitHub](https://github.com/) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free Database).
- A [Render](https://render.com/) account (Free Backend Hosting).
- A [Vercel](https://vercel.com/) account (Free Frontend Hosting).

---

## Step 1: Push Code to GitHub

1. Open your terminal in the project folder and run:
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push origin main
   ```
   _(If prompted, enter your GitHub credentials)_

---

## Step 2: Ensure MongoDB Atlas (Database) is Ready

1. Log in to **MongoDB Atlas**.
2. Make sure you have your **Connection String** ready (e.g., `mongodb+srv://...`).
3. Ensure Network Access allows `0.0.0.0/0` (Access from Anywhere) so Render can connect.

---

## Step 3: Configure Backend (Render)

1. Go to your **Render Dashboard**.
2. Select your `backend` service.
3. Go to **Environment**.
4. Ensure the `MONGO_URI` is set to your **Atlas Connection String**.
   - _Note: Your local code uses `localhost`, but Render will use this variable instead._

---

## Step 4: Configure Frontend (Vercel)

1. Go to your **Vercel Dashboard**.
2. Select your `frontend` project.
3. Go to **Settings** -> **Environment Variables**.
4. Check `VITE_API_BASE_URL`.
   - It should be: `https://your-backend-url.onrender.com/api`
   - **Important:** Ensure it ends with `/api` (no trailing slash).
   - **Double Check:** Verify there are no typos, as this is the most common cause of connection issues.

---

## Step 5: Vercel Configuration (Important!)

To prevent **404 Not Found** errors on page refresh (since this is a Single Page Application), you must ensure the `frontend/vercel.json` file exists with the following content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to redirect all traffic to `index.html`, allowing React Router to handle the routing.

---

## Success! 🎉

Your app is configured for dual-environment:

- **Localhost**: fast, offline-capable, uses local DB.
- **Deployed**: accessible worldwide, uses cloud DB.
