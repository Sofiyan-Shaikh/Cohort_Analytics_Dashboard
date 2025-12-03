# 🚀 Revenue-Focused Analytics Dashboard

## Overview
A production-grade, revenue-focused analytics dashboard built with React, TypeScript, Tailwind CSS, and Recharts. This dashboard demonstrates advanced data visualization, predictive analytics, and business intelligence capabilities.

## 🎯 Key Features

### 1. Revenue Overview Cards
- **Total Revenue**: ₹XXK with month-over-month growth
- **Average Order Value (AOV)**: Per-transaction revenue
- **Customer Lifetime Value (LTV)**: Predicted customer value
- **Repeat Revenue %**: Percentage of revenue from returning customers

### 2. Revenue Analytics
- **Daily Revenue Trend**: Area chart showing revenue by day with Black Friday spike clearly labeled
- **30-Day Revenue Prediction**: Linear projection with confidence bands (upper/lower bounds)
- **Real-time calculations** based on actual cohort and funnel data

### 3. Product Intelligence
- **Top 10 Products by Revenue**: Horizontal bar chart with:
  - Product names
  - Revenue amounts (₹)
  - Unit sales
  - Category-based pricing logic

### 4. Abandoned Cart Recovery
- **Potential Revenue**: ₹XXK from abandoned carts
- **Recovery Rate**: 30% estimated recovery
- **Actionable CTA**: "Launch Recovery Campaign" button
- **Real-time calculation** from funnel data

### 5. AI-Powered Smart Recommendations
Auto-generated business insights with:
- **Cart Abandonment Strategy**: Exit-intent popup recommendations
- **High-Value Category Focus**: Targeted campaign suggestions
- **Loyalty Program**: Repeat purchase optimization
- **Mobile Optimization**: A/B testing recommendations
- Each recommendation shows:
  - Impact level (High/Medium)
  - Potential revenue gain (₹)
  - Actionable description

### 6. Interactive Filters
- **Date Range Picker**: Nov 1-30, 2025 (customizable)
- **Cohort Type**: Weekly/Daily toggle
- **Device Filter**: All/Mobile/Desktop
- **Source Filter**: All/Google/Facebook/Black Friday
- All filters update ALL charts instantly

### 7. Cohort Retention Heatmap
- Color-coded retention percentages
- Black Friday cohorts highlighted with 🎉
- Hover tooltips showing exact user counts
- Week-over-week retention tracking

### 8. Conversion Funnel
- 4-stage funnel visualization
- Color-coded stages
- Percentage and absolute numbers
- Horizontal bar chart layout

### 9. Export to PDF
- **One-click PDF export** of entire dashboard
- High-quality rendering (2x scale)
- Preserves dark theme
- Professional formatting

## 💰 Realistic Pricing Logic

### Category-Based Pricing
- **Electronics**: ₹8,000 - ₹25,000
- **Fashion**: ₹1,500 - ₹6,000
- **Beauty**: ₹800 - ₹3,000
- **Sports**: ₹3,000 - ₹12,000
- **Home & Kitchen**: ₹2,000 - ₹8,000

### Revenue Calculations
- Black Friday orders: 1.5x normal pricing
- AOV calculated from total revenue / purchases
- LTV = AOV × (1 + retention rate × 3)
- Repeat revenue = Week 4 users × AOV

## 🎨 Design Features

### Professional Dark Theme
- Slate-900 background
- Gradient cards with glassmorphism
- Smooth animations with Framer Motion
- Lucide React icons
- Responsive grid layouts

### Interactive Elements
- Hover effects on all cards
- Scale animations on KPI cards
- Smooth filter panel transitions
- Loading states with spinner
- Error handling with retry

### Data Visualization
- Area charts with gradients
- Horizontal bar charts
- Color-coded heatmaps
- Confidence bands on predictions
- Custom tooltips

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas
- **Backend**: Django + PostgreSQL
- **API**: RESTful endpoints

## 📊 Data Sources

- **Cohort Data**: PostgreSQL table `cohort_retention`
- **Funnel Data**: PostgreSQL table `conversion_funnel`
- **Real-time API**: Django REST endpoints on port 8001

## 🚀 Running the Dashboard

### Backend (Django)
```bash
source .venv/bin/activate
python manage.py runserver 8001
```

### Frontend (React)
```bash
cd dashboard
npm run dev
```

Access at: **http://localhost:5174/**

## 💼 Business Impact

This dashboard demonstrates:
- **Revenue optimization** thinking
- **Predictive analytics** capabilities
- **Data-driven decision making**
- **Product management** skills
- **Full-stack development** expertise

Perfect for:
- College project submissions
- Portfolio showcases
- Job interviews
- Product manager roles
- Data analyst positions

## 🎓 Learning Outcomes

- Advanced React patterns (useMemo, useRef, custom hooks)
- TypeScript interfaces and type safety
- Complex data transformations
- Business metrics calculations
- Professional UI/UX design
- PDF generation from web content
- Real-time data filtering
- Responsive design principles

---

**Built with ❤️ for maximum impact and learning**
