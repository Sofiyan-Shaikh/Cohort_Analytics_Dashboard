# Deploying Cohort Analytics Dashboard on Render

This guide walks you through deploying the Django backend and React frontend on Render.

---

## Quick Reference

### Environment Variables (Backend - Django)

| Variable | Value | Description |
|----------|-------|-------------|
| `PYTHON_VERSION` | `3.11.4` | Python version |
| `SECRET_KEY` | Auto-generate on Render | Django secret key |
| `DEBUG` | `False` | Disable debug mode |
| `RENDER` | `true` | Tells app it's on Render |
| `DATABASE_URL` | From Render PostgreSQL | Auto-set if using Render DB |
| `ALLOWED_HOSTS` | `.onrender.com` | Allowed hosts |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.onrender.com` | Frontend URL |

### Environment Variables (Frontend - React)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API URL |

### Build & Start Commands

**Backend (Web Service):**
- Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input`
- Start Command: `gunicorn cohort_analytics_dashboards.wsgi:application`

**Frontend (Static Site):**
- Build Command: `cd dashboard && npm install && npm run build`
- Publish Directory: `dashboard/dist`

---

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - Name: `cohort-analytics-db`
   - Database: `cohort_analytics`
   - User: Leave default
   - Region: Choose closest to your users
   - Plan: **Free** (for testing)
4. Click **Create Database**
5. Copy the **Internal Database URL** for later

### Step 3: Deploy Django Backend

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - Name: `cohort-analytics-api`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: `Cohort_Analytics_Dashboard` (if repo has multiple folders)
   - Runtime: **Python 3**
   - Build Command:
     ```
     pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input
     ```
   - Start Command:
     ```
     gunicorn cohort_analytics_dashboards.wsgi:application
     ```

4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `PYTHON_VERSION` | `3.11.4` |
   | `SECRET_KEY` | Click "Generate" |
   | `DEBUG` | `False` |
   | `RENDER` | `true` |
   | `DATABASE_URL` | Paste Internal Database URL from Step 2 |
   | `ALLOWED_HOSTS` | `.onrender.com` |

5. Click **Create Web Service**

### Step 4: Seed the Database

After backend deploys, seed your database:

1. Go to your Web Service → **Shell**
2. Run:
   ```bash
   python manage.py dbshell
   ```
3. Copy and paste contents of `create_tables.sql` (modify for PostgreSQL syntax if needed)

**Or** create a management command - add this file:

`cohort_analytics_dashboards/management/commands/seed_data.py`

### Step 5: Deploy React Frontend

1. Click **New** → **Static Site**
2. Connect the same GitHub repository
3. Configure:
   - Name: `cohort-analytics-frontend`
   - Branch: `main`
   - Root Directory: `Cohort_Analytics_Dashboard/dashboard`
   - Build Command:
     ```
     npm install && npm run build
     ```
   - Publish Directory: `dist`

4. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://cohort-analytics-api.onrender.com` |

5. Click **Create Static Site**

### Step 6: Update CORS Settings

After frontend deploys, update backend CORS:

1. Go to backend Web Service → **Environment**
2. Add/Update:
   | Key | Value |
   |-----|-------|
   | `CORS_ALLOWED_ORIGINS` | `https://cohort-analytics-frontend.onrender.com` |

3. Click **Save Changes** (triggers redeploy)

---

## Alternative: One-Click Deploy with render.yaml

If you have the `render.yaml` file in your repo root:

1. Go to Render Dashboard
2. Click **New** → **Blueprint**
3. Connect your repository
4. Render will auto-detect `render.yaml` and create all services

---

## Troubleshooting

### Backend won't start
- Check logs for missing dependencies
- Verify `DATABASE_URL` is set correctly
- Ensure `RENDER=true` environment variable is set

### Frontend can't connect to API
- Verify `VITE_API_URL` points to correct backend URL
- Check CORS settings include frontend URL
- Ensure backend is running and healthy

### Database connection errors
- Use **Internal Database URL** (not External) for better performance
- Check database is in same region as web service

### Static files not loading
- Ensure `whitenoise` is in requirements.txt
- Verify `collectstatic` runs in build command

---

## File Structure for Deployment

```
Cohort_Analytics_Dashboard/
├── requirements.txt          # Python dependencies
├── render.yaml               # Render blueprint (optional)
├── build.sh                  # Build script (optional)
├── manage.py
├── cohort_analytics_dashboards/
│   ├── settings.py           # Local settings
│   ├── settings_prod.py      # Production settings
│   ├── wsgi.py               # Updated for Render
│   └── ...
└── dashboard/
    ├── package.json
    ├── .env.example
    └── dist/                 # Built frontend (generated)
```

---

## Estimated Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Web Service | 750 hours/month | $7/month |
| Static Site | Unlimited | Free |
| PostgreSQL | 90 days, then $7/month | $7/month |

---

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL (automatic on Render)
3. Set up monitoring and alerts
4. Configure auto-deploy on push
