# Chat App Deployment Setup Guide

## Prerequisites
✅ Heroku CLI installed  
✅ Procfile created  
✅ Production config files prepared  

## Step-by-Step Deployment Instructions

### Step 1: Heroku Login (Interactive Mode)
```bash
cd /workspaces/Chat_appV1.2
heroku login -i
```

When prompted, enter:
- **Email**: Your Heroku account email
- **Password**: Your Heroku account password

### Step 2: Create Production Databases

#### MongoDB Atlas Setup (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/chatapp`
5. Copy the URI

#### Redis Cloud Setup
1. Go to https://redis.com/try/
2. Create a free account
3. Create a database
4. Copy the connection URL

### Step 3: Configure Environment Variables on Heroku

Create the app first:
```bash
heroku create your-unique-app-name --region us
```

Then set all environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=4000
heroku config:set DB="mongodb+srv://your-username:your-password@cluster.mongodb.net/chatapp"
heroku config:set JWTPRIVATEKEY="your-very-long-random-secret-key-here"
heroku config:set SALT=10
heroku config:set BASE_URL="https://your-unique-app-name.herokuapp.com"
heroku config:set HOST=smtp.gmail.com
heroku config:set SERVICE=gmail
heroku config:set EMAIL_PORT=587
heroku config:set SECURE=false
heroku config:set SMTP_USER="your-email@gmail.com"
heroku config:set SMTP_PASS="your-gmail-app-password"
heroku config:set REDIS_URL="redis://default:your-password@hostname:port"
heroku config:set FRONTEND_URL="https://your-unique-app-name.herokuapp.com"
```

### Step 4: Setup Git Remote (if not done automatically)
```bash
heroku git:remote -a your-unique-app-name
```

### Step 5: Deploy
```bash
git add .
git commit -m "Prepare for production deployment"
git push heroku main
```

### Step 6: Verify Deployment
```bash
heroku logs --tail
heroku open
```

## Important Notes

### For Gmail SMTP (if using Gmail for emails)
1. Enable 2-Factor Authentication on Gmail
2. Create an App Password: https://support.google.com/accounts/answer/185833
3. Use the app password (not your Gmail password) for `SMTP_PASS`

### Generate a Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Verify Your App is Running
```bash
curl https://your-unique-app-name.herokuapp.com
```

## Troubleshooting

**App crashes on deploy?**
```bash
heroku logs --tail
```

**Check app status:**
```bash
heroku ps
```

**Restart the app:**
```bash
heroku restart
```

**View environment variables:**
```bash
heroku config
```

---

**Files already prepared for deployment:**
- ✅ `Procfile` - Defines how to start the app
- ✅ `.env.production` - Example production config
- ✅ `server/server.js` - Updated to serve frontend build
- ✅ `server/package.json` - Has postinstall script for frontend build
