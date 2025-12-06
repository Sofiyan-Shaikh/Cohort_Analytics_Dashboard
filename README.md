# Cohort Analytics Dashboard

A full-stack eCommerce analytics dashboard for tracking user cohorts, conversion funnels, revenue insights, and user segmentation.

## Tech Stack

### Backend
- **Python 3.x** - Core programming language
- **Django 5.2** - Web framework for REST API
- **SQLite** - Database for storing analytics data
- **django-cors-headers** - CORS handling for frontend communication

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for data visualization
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **jsPDF + html2canvas** - PDF export functionality

## Project Structure

```
Cohort_Analytics_Dashboard/
├── cohort_analytics_dashboards/    # Django backend
│   ├── __init__.py
│   ├── settings.py                 # Django configuration
│   ├── urls.py                     # API routes
│   ├── views.py                    # API endpoints
│   ├── wsgi.py                     # WSGI config
│   └── asgi.py                     # ASGI config
├── dashboard/                      # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Side navigation
│   │   │   └── GlobalFilters.tsx   # Filter panel
│   │   ├── pages/                  # Dashboard pages
│   │   │   ├── HomePage.tsx        # Overview dashboard
│   │   │   ├── CohortAnalysisPage.tsx
│   │   │   ├── FunnelAnalysisPage.tsx
│   │   │   ├── RevenueInsightsPage.tsx
│   │   │   ├── UserSegmentationPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── App.tsx                 # Main app with routing & context
│   │   └── index.css               # Global styles & theme
│   ├── package.json
│   └── vite.config.ts
├── create_tables.sql               # Database schema & seed data
├── db.sqlite3                      # SQLite database
└── manage.py                       # Django CLI
```

## Backend Architecture

### Django Configuration (settings.py)

The backend uses Django with the following key configurations:

- **Database**: SQLite (`db.sqlite3`) for simple deployment
- **CORS**: Configured to allow requests from `localhost:5173` and `localhost:5174`
- **Middleware**: Includes `corsheaders.middleware.CorsMiddleware` for cross-origin requests

### API Views (views.py)

All API endpoints use raw SQL queries with Django's database connection for direct data access:

```python
# Example: Cohort Analysis View
def cohort_analysis(request):
    query = """
    SELECT cohort_date, week_0, week_1, week_2, week_3, week_4
    FROM cohort_retention
    ORDER BY cohort_date;
    """
    with connection.cursor() as cursor:
        cursor.execute(query)
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return JsonResponse(results, safe=False)
```

### API Endpoints (urls.py)

| Endpoint | Method | View Function | Description |
|----------|--------|---------------|-------------|
| `/api/cohorts/` | GET | `cohort_analysis` | Weekly cohort retention data |
| `/api/funnel/` | GET | `funnel_analysis` | Conversion funnel steps |
| `/api/products/` | GET | `top_products` | Top 8 products by revenue |
| `/api/segments/` | GET | `user_segments` | User segment distribution |
| `/api/users/` | GET | `high_value_users` | High-value users (supports `?segment=` filter) |

### API Response Examples

**GET /api/cohorts/**
```json
[
  {
    "cohort_date": "2025-11-03",
    "week_0": 15,
    "week_1": 11,
    "week_2": 8,
    "week_3": 6,
    "week_4": 5
  }
]
```

**GET /api/funnel/**
```json
[
  { "step": "Page View", "users": 57, "percentage": 100.0 },
  { "step": "Add to Cart", "users": 41, "percentage": 71.9 },
  { "step": "Checkout", "users": 28, "percentage": 49.1 },
  { "step": "Purchase", "users": 19, "percentage": 33.3 }
]
```

**GET /api/segments/**
```json
[
  { "segment_name": "Active Users", "user_count": 23, "percentage": 40.0, "color": "#10B981" },
  { "segment_name": "New Users", "user_count": 20, "percentage": 35.0, "color": "#3B82F6" }
]
```

**GET /api/users/?segment=VIP**
```json
[
  {
    "user_id": 1007,
    "name": "Rajesh Nair",
    "email": "rajesh.nair@email.com",
    "purchases": 5,
    "ltv": 72000,
    "segment": "VIP",
    "last_purchase": "2025-11-22"
  }
]
```

## Database Schema

### Tables

**cohort_retention** - Weekly user retention by cohort
| Column | Type | Description |
|--------|------|-------------|
| cohort_date | DATE | Cohort start date |
| week_0 | INTEGER | Users at week 0 (baseline) |
| week_1-4 | INTEGER | Retained users per week |

**conversion_funnel** - Funnel step data
| Column | Type | Description |
|--------|------|-------------|
| step | VARCHAR(50) | Funnel step name |
| users | INTEGER | Users at this step |
| percentage | DECIMAL | Percentage of total |

**top_products** - Product performance
| Column | Type | Description |
|--------|------|-------------|
| name | VARCHAR(100) | Product name |
| category | VARCHAR(50) | Product category |
| revenue | INTEGER | Total revenue (₹) |
| units | INTEGER | Units sold |

**user_segments** - User lifecycle segments
| Column | Type | Description |
|--------|------|-------------|
| segment_name | VARCHAR(50) | Segment name |
| user_count | INTEGER | Users in segment |
| percentage | DECIMAL | Percentage of total |
| color | VARCHAR(20) | Display color (hex) |

**high_value_users** - Top customers
| Column | Type | Description |
|--------|------|-------------|
| user_id | INTEGER | User ID |
| name | VARCHAR(100) | Customer name |
| email | VARCHAR(100) | Email address |
| purchases | INTEGER | Total purchases |
| ltv | INTEGER | Lifetime value (₹) |
| segment | VARCHAR(50) | User segment |
| last_purchase | DATE | Last purchase date |

## Frontend Features

### Dashboard Pages

1. **Overview** - Key metrics (revenue, users, conversion, retention), revenue trend chart, funnel preview
2. **Cohort Analysis** - Retention heatmap, retention curve chart, weekly metrics
3. **Funnel Analysis** - Horizontal bar chart, funnel breakdown, cart abandonment metrics
4. **Revenue Insights** - Revenue trend, What-If LTV simulator, top products chart
5. **User Segmentation** - Pie chart, segment breakdown, high-value users table with filtering

### Key Functionality
- Date range filtering with URL sync
- PDF export for all pages
- Real-time data fetching from Django API
- Responsive sidebar navigation
- Interactive charts with tooltips

## Getting Started

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django django-cors-headers

# Initialize database with sample data
sqlite3 db.sqlite3 < create_tables.sql

# Start server on port 8002
python manage.py runserver 8002
```

### Frontend Setup

```bash
cd dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8002/api/

## Design System

- **Background**: Navy blue (#1a2942)
- **Cards**: Dark charcoal (#111827)
- **Borders**: Slate (#475569 at 60% opacity)
- **Accent Colors**: Indigo (#6366f1), Violet (#8b5cf6), Emerald (#10b981), Amber (#f59e0b)
- **Typography**: Inter font family
- **Border Radius**: 1.25rem (rounded-2xl)
