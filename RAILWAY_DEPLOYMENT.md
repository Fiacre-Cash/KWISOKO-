# 🚀 Railway Deployment Guide - One-Click Setup

**Status:** Your repo is **100% Railway-ready**. Just 3 UI clicks needed.

---

## 📋 Pre-Deployment Checklist

✅ Backend code ready  
✅ Frontend code ready  
✅ Nixpacks config (`railway.json`)  
✅ Start command configured  

---

## 🎯 Deploy Backend on Railway (5 minutes)

### **Step 1: Create Railway Project from GitHub**

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Find and select **`KWISOKO-`** repo
5. Click **"Deploy Now"**

Railway will auto-start building. **Wait for it to fail** (we need to add PostgreSQL first).

---

### **Step 2: Add PostgreSQL Database**

**In your Railway project dashboard:**

1. Click **"+ Add"** button (top right area)
2. Select **"Database"**
3. Click **"PostgreSQL"**
4. Railway auto-creates and injects `DATABASE_URL` ✓

---

### **Step 3: Set Environment Variables**

**Go to your project → Click "Variables" tab**

Add these variables (copy-paste):

```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://kwisoko.vercel.app

JWT_SECRET=<generate-random-32-char-hex>
JWT_REFRESH_SECRET=<generate-random-32-char-hex>

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

MOMO_API_KEY=optional
MOMO_API_SECRET=optional
```

**Generate random JWT secrets:**
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

### **Step 4: Set Root Directory**

**Still in Railway project settings:**

1. Click **"Service"** tab (or settings icon)
2. Find **"Root Directory"** field
3. Enter: `backend`
4. Click **"Save"**

---

### **Step 5: Redeploy**

1. Click **"Deploy"** or **"Redeploy"** button
2. Watch the build logs (should take 3-5 min)
3. Look for green ✓ message

---

### **Step 6: Get Your Backend URL**

Once deployed:

1. Click on your service name (top left)
2. Look for **"Public URL"** or **"Domain"**
3. Copy it (looks like: `https://kwisoko-production.up.railway.app`)
4. ✅ Save this URL for frontend setup

---

## 🎨 Deploy Frontend on Vercel (2 minutes)

### **Step 1: Create Vercel Project**

1. Go to https://vercel.com
2. Click **"Import Project"** or **"New"**
3. Select **`KWISOKO-`** repository
4. Click **"Import"**

---

### **Step 2: Configure**

1. **Root Directory:** Select **`frontend`** from dropdown
2. Click **"Deploy"**

---

### **Step 3: Add Environment Variable**

After deploy starts:

1. Go to **Settings** → **Environment Variables**
2. Add variable:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_URL/api/v1
   ```
   (Replace `YOUR_RAILWAY_URL` with your Railway backend URL from Step 6 above)
3. Redeploy

---

## ✅ You're Live!

```
Frontend: https://kwisoko.vercel.app
Backend:  https://your-railway-url.up.railway.app/api/v1
API Docs: https://your-railway-url.up.railway.app/api/docs
```

---

## 🆘 Troubleshooting

### Build fails with "package.json not found"
→ Make sure **Root Directory** is set to `backend` in Railway settings

### Database connection error
→ PostgreSQL plugin added? Go to **Variables** tab and confirm `DATABASE_URL` exists

### Frontend can't reach backend
→ Update `NEXT_PUBLIC_API_URL` in Vercel environment variables with correct Railway URL

---

## 📞 Need Help?

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- GitHub repo: https://github.com/Fiacre-Cash/KWISOKO-
