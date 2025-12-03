import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import { DollarSign, Download, TrendingUp, Sliders, Package } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RevenueInsightsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);
  const [improvementSlider, setImprovementSlider] = useState(15);

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

  const revenueData = useMemo(() => {
    const purchases = funnelData.find((s) => s.step === 'Purchase')?.users || 0;
    const revenueByDay = filteredCohortData.map((cohort) => {
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

    const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0);
    const avgOrderValue = totalRevenue / purchases;
    const avgRetention = filteredCohortData.reduce((sum, c) => sum + c.week_4 / c.week_0, 0) / filteredCohortData.length;
    const customerLifetimeValue = avgOrderValue * (1 + avgRetention * 3);

    // What-if simulation
    const improvedRetention = avgRetention * (1 + improvementSlider / 100);
    const improvedLTV = avgOrderValue * (1 + improvedRetention * 3);
    const additionalRevenue = (improvedLTV - customerLifetimeValue) * purchases;

    const topProducts = [
      { name: 'iPhone 15 Pro', revenue: 450000, units: 18 },
      { name: 'Samsung 4K TV', revenue: 380000, units: 22 },
      { name: 'Nike Air Max', revenue: 180000, units: 45 },
      { name: 'Dyson Vacuum', revenue: 165000, units: 15 },
      { name: 'Sony Headphones', revenue: 145000, units: 32 },
    ];

    return {
      totalRevenue,
      avgOrderValue,
      customerLifetimeValue,
      revenueByDay,
      topProducts,
      additionalRevenue,
      improvedLTV,
    };
  }, [filteredCohortData, funnelData, improvementSlider]);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('revenue-page');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('revenue-insights.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div id="revenue-page" className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Revenue & Retention Insights</h1>
          <p className="text-slate-400 text-lg">Maximize revenue through retention optimization</p>
        </div>
        <button
          onClick={exportToPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 font-medium"
        >
          <Download className="w-5 h-5" />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </motion.div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: `₹${(revenueData.totalRevenue / 1000).toFixed(1)}K`,
            icon: DollarSign,
            color: 'emerald',
            change: '+18%',
          },
          {
            label: 'Avg Order Value',
            value: `₹${revenueData.avgOrderValue.toFixed(0)}`,
            icon: TrendingUp,
            color: 'blue',
            change: '+5%',
          },
          {
            label: 'Customer LTV',
            value: `₹${revenueData.customerLifetimeValue.toFixed(0)}`,
            icon: DollarSign,
            color: 'purple',
            change: '+12%',
          },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl border border-slate-800 p-6 card-hover shadow-xl shadow-black/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${kpi.color}-500/10 rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} />
              </div>
              <span className="text-xs px-2 py-1 bg-emerald-500/10 rounded-lg text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
            <p className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wide">{kpi.label}</p>
            <p className="text-3xl font-bold text-slate-100">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Daily Revenue Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData.revenueByDay}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => {
                const day = revenueData.revenueByDay.find((d) => d.date === label);
                return day?.isBlackFriday ? `${label} 🎉 BLACK FRIDAY` : label;
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* What-If Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl border border-indigo-500/20 p-6 shadow-xl shadow-black/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Sliders className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">"What If" Retention Simulator</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">If retention improves by: {improvementSlider}%</label>
            <input
              type="range"
              min="0"
              max="50"
              value={improvementSlider}
              onChange={(e) => setImprovementSlider(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Current LTV</p>
              <p className="text-2xl font-bold text-gray-300">₹{revenueData.customerLifetimeValue.toFixed(0)}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Improved LTV</p>
              <p className="text-2xl font-bold text-cyan-400">₹{revenueData.improvedLTV.toFixed(0)}</p>
            </div>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Additional Revenue Potential</p>
            <p className="text-4xl font-bold text-emerald-400">+₹{(revenueData.additionalRevenue / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800 border border-slate-700 p-6 rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-6 h-6 text-purple-400" />
          Top 5 Products by Revenue
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData.topProducts} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" width={90} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value: number, _name: string, props: any) => [
                `₹${value.toLocaleString()} (${props.payload.units} units)`,
                'Revenue',
              ]}
            />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 8, 8, 0]}>
              <LabelList dataKey="revenue" position="right" fill="#fff" formatter={(v: any) => `₹${(v / 1000).toFixed(0)}K`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 p-6 rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-4">💡 Revenue Growth Strategies</h2>
        <div className="space-y-3">
          {[
            {
              title: 'Launch Loyalty Program',
              description: `Improve retention by ${improvementSlider}% → Generate +₹${(revenueData.additionalRevenue / 1000).toFixed(1)}K additional revenue`,
              impact: 'High',
            },
            {
              title: 'Upsell Top Products',
              description: 'iPhone 15 Pro generates ₹450K. Bundle with accessories to increase AOV by 20%.',
              impact: 'High',
            },
            {
              title: 'Re-engage Churned Users',
              description: 'Win back 15% of churned users with personalized offers. Potential: ₹85K.',
              impact: 'Medium',
            },
          ].map((rec, idx) => (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-300">{rec.description}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    rec.impact === 'High' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'
                  }`}
                >
                  {rec.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueInsightsPage;
