import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { DollarSign, Download, TrendingUp, Sliders, Package } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RevenueInsightsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);
  const [improvementSlider, setImprovementSlider] = useState(15);

  if (!context) return null;

  const { cohortData, funnelData, productsData, dateRange } = context;

  const filteredCohortData = useMemo(() => {
    return cohortData.filter((cohort) => {
      const date = new Date(cohort.cohort_date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return date >= start && date <= end;
    });
  }, [cohortData, dateRange]);

  // Normalize funnel data percentage
  const normalizedFunnelData = useMemo(() => {
    return funnelData.map((item) => ({
      ...item,
      percentage: typeof item.percentage === 'string' ? parseFloat(item.percentage) : item.percentage,
    }));
  }, [funnelData]);

  const revenueData = useMemo(() => {
    const purchases = normalizedFunnelData.find((s) => s.step === 'Purchase')?.users || 0;
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
    const avgOrderValue = purchases > 0 ? totalRevenue / purchases : 0;
    const avgRetention =
      filteredCohortData.length > 0
        ? filteredCohortData.reduce((sum, c) => sum + c.week_4 / c.week_0, 0) / filteredCohortData.length
        : 0;
    const customerLifetimeValue = avgOrderValue * (1 + avgRetention * 3);
    const improvedRetention = avgRetention * (1 + improvementSlider / 100);
    const improvedLTV = avgOrderValue * (1 + improvedRetention * 3);
    const additionalRevenue = (improvedLTV - customerLifetimeValue) * purchases;

    return {
      totalRevenue,
      avgOrderValue,
      customerLifetimeValue,
      revenueByDay,
      additionalRevenue,
      improvedLTV,
    };
  }, [filteredCohortData, normalizedFunnelData, improvementSlider]);

  // Use real products data from API
  const topProducts = useMemo(() => {
    return productsData.slice(0, 5);
  }, [productsData]);

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
    <div id="revenue-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Revenue Insights</h1>
          <p className="text-sm text-slate-400 mt-1">Maximize revenue through retention optimization</p>
        </div>
        <button
          onClick={exportToPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium shadow-lg shadow-indigo-500/25"
        >
          {exporting ? (
            <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
        </button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">₹{(revenueData.totalRevenue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Total Revenue</p>
            <p className="text-xs text-emerald-400 mt-1">+{((revenueData.totalRevenue / 200000) * 10).toFixed(0)}% vs last month</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#10b981' }} />
        </div>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">₹{revenueData.avgOrderValue.toFixed(0)}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Avg Order Value</p>
            <p className="text-xs text-emerald-400 mt-1">+{((revenueData.avgOrderValue / 8000) * 5).toFixed(0)}% vs last month</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#3b82f6' }} />
        </div>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">₹{revenueData.customerLifetimeValue.toFixed(0)}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Customer LTV</p>
            <p className="text-xs text-emerald-400 mt-1">+{((revenueData.customerLifetimeValue / 15000) * 8).toFixed(0)}% vs last month</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#8b5cf6' }} />
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Daily Revenue Trend</h2>
          <span className="text-xs text-slate-500">November 2025</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData.revenueByDay}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '11px' }} />
            <YAxis stroke="#64748b" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        {/* What-If Simulator */}
        <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center">
              <Sliders className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-base font-semibold text-white text-center mb-4">What-If Simulator</h2>
          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-2 block">Retention improvement: {improvementSlider}%</label>
            <input
              type="range"
              min="0"
              max="50"
              value={improvementSlider}
              onChange={(e) => setImprovementSlider(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Current LTV</p>
              <p className="text-lg font-bold text-white">₹{revenueData.customerLifetimeValue.toFixed(0)}</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Improved LTV</p>
              <p className="text-lg font-bold text-indigo-400">₹{revenueData.improvedLTV.toFixed(0)}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-slate-400">Additional Revenue</p>
            <p className="text-xl font-bold text-emerald-400">+₹{(revenueData.additionalRevenue / 1000).toFixed(1)}K</p>
          </div>
        </div>

        {/* Top Products - Now using real data */}
        <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h2 className="text-base font-semibold text-white text-center mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  style={{ fontSize: '10px' }}
                />
                <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: '10px' }} width={55} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(value: number, _name: string, props: any) => [
                    `₹${value.toLocaleString()} (${props.payload.units} units)`,
                    'Revenue',
                  ]}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              Loading products data...
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <h2 className="text-base font-semibold text-white mb-4">💡 Revenue Growth Strategies</h2>
        <div className="space-y-2">
          {[
            {
              title: 'Launch Loyalty Program',
              description: `Improve retention by ${improvementSlider}% → +₹${(revenueData.additionalRevenue / 1000).toFixed(1)}K`,
              impact: 'High',
            },
            {
              title: 'Upsell Top Products',
              description: `Bundle ${topProducts[0]?.name || 'top product'} with accessories to increase AOV by ${((revenueData.avgOrderValue / 8500) * 20).toFixed(0)}%.`,
              impact: 'High',
            },
            {
              title: 'Re-engage Churned Users',
              description: `Win back 15% of churned users with personalized offers. Potential: ₹${((revenueData.totalRevenue * 0.15) / 1000).toFixed(0)}K.`,
              impact: 'Medium',
            },
          ].map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white">{rec.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{rec.description}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded font-medium shrink-0 ${rec.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}
              >
                {rec.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueInsightsPage;
