import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { Users, ShoppingCart, RefreshCw, Zap, TrendingUp, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { cohortData, funnelData, dateRange } = context;

  const filteredCohortData = useMemo(() => {
    return cohortData.filter((cohort) => {
      const date = new Date(cohort.cohort_date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return date >= start && date <= end;
    });
  }, [cohortData, dateRange]);

  const metrics = useMemo(() => {
    const totalUsers = funnelData.find((s) => s.step === 'Page View')?.users || 0;
    const totalPurchases = funnelData.find((s) => s.step === 'Purchase')?.users || 0;
    let totalWeek0 = 0,
      totalWeek4 = 0;
    filteredCohortData.forEach((c) => {
      totalWeek0 += c.week_0;
      totalWeek4 += c.week_4;
    });
    const repeatRate = totalWeek0 > 0 ? ((totalWeek4 / totalWeek0) * 100).toFixed(1) : '0';
    const blackFridayCohort = filteredCohortData.find((c) => c.cohort_date >= '2025-11-24' && c.cohort_date <= '2025-11-30');
    const normalAvg =
      filteredCohortData.filter((c) => c.cohort_date < '2025-11-24').reduce((sum, c) => sum + c.week_0, 0) /
      Math.max(1, filteredCohortData.filter((c) => c.cohort_date < '2025-11-24').length);
    const blackFridayLift = blackFridayCohort ? (((blackFridayCohort.week_0 - normalAvg) / normalAvg) * 100).toFixed(1) : '0';
    return { totalUsers, totalPurchases, repeatRate, blackFridayLift };
  }, [funnelData, filteredCohortData]);

  const revenueByDay = useMemo(() => {
    return filteredCohortData.map((cohort) => {
      const date = new Date(cohort.cohort_date);
      const isBlackFriday = date >= new Date('2025-11-24') && date <= new Date('2025-11-30');
      const avgPrice = isBlackFriday ? 15000 : 8500;
      const dailyPurchases = Math.floor(cohort.week_0 * 0.33);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dailyPurchases * avgPrice,
        isBlackFriday,
      };
    });
  }, [filteredCohortData]);

  const kpiCards = [
    {
      label: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: Users,
      change: '+12%',
      link: '/user-segmentation',
    },
    {
      label: 'Total Orders',
      value: metrics.totalPurchases.toLocaleString(),
      icon: ShoppingCart,
      change: '+8%',
      link: '/funnel-analysis',
    },
    {
      label: 'Repeat Rate',
      value: `${metrics.repeatRate}%`,
      icon: RefreshCw,
      change: '+3%',
      link: '/cohort-analysis',
    },
    {
      label: 'Black Friday Lift',
      value: `+${metrics.blackFridayLift}%`,
      icon: Zap,
      change: 'vs avg',
      link: '/revenue-insights',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 stagger-children">
        {kpiCards.map((kpi, idx) => (
          <Link key={idx} to={kpi.link}>
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer card-hover shadow-xl shadow-black/30">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <kpi.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg text-emerald-400 text-xs font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="text-[#94a3b8] text-xs mb-2 uppercase tracking-wider font-semibold">{kpi.label}</div>
              <div className="text-[#f8fafc] text-4xl font-bold tracking-tight">{kpi.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue Trend */}
      <Card title="Revenue Trend" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueByDay}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 500 }} />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} style={{ fontSize: '12px', fontWeight: 500 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                fontSize: '13px',
                backdropFilter: 'blur(12px)',
                padding: '12px'
              }}
              labelStyle={{ color: '#cbd5e1', fontWeight: 600, marginBottom: '4px' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Analyze Cohorts',
            description: 'View retention heatmap and identify drop-off points',
            link: '/cohort-analysis',
            icon: Users,
          },
          {
            title: 'Optimize Funnel',
            description: 'Reduce cart abandonment and improve conversion',
            link: '/funnel-analysis',
            icon: TrendingUp,
          },
          {
            title: 'Segment Users',
            description: 'Target high-value users and re-engage customers',
            link: '/user-segmentation',
            icon: Users,
          },
        ].map((action, idx) => (
          <Link key={idx} to={action.link}>
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer card-hover shadow-xl shadow-black/30 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <action.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-[#f8fafc] text-lg font-semibold mb-2 tracking-tight">{action.title}</h3>
              <p className="text-[#94a3b8] text-sm mb-4 leading-relaxed">{action.description}</p>
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all group-hover:scale-105">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
