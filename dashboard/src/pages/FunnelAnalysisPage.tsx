import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { TrendingUp, Download, ShoppingCart, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FunnelAnalysisPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);

  if (!context) return null;

  const { funnelData } = context;

  // Normalize funnel data to ensure percentage is a number
  const normalizedFunnelData = useMemo(() => {
    if (!funnelData || funnelData.length === 0) return [];
    return funnelData.map(item => ({
      ...item,
      percentage: typeof item.percentage === 'string' ? parseFloat(item.percentage) : item.percentage
    }));
  }, [funnelData]);

  const abandonedCartMetrics = useMemo(() => {
    if (!normalizedFunnelData || normalizedFunnelData.length === 0) {
      return { abandoned: 0, abandonmentRate: '0', potentialRevenue: 0 };
    }
    const cartAdds = normalizedFunnelData.find((s) => s.step === 'Add to Cart')?.users || 0;
    const purchases = normalizedFunnelData.find((s) => s.step === 'Purchase')?.users || 0;
    const abandoned = cartAdds - purchases;
    const abandonmentRate = cartAdds > 0 ? ((abandoned / cartAdds) * 100).toFixed(1) : '0';
    const potentialRevenue = abandoned * 8500 * 0.7;
    return { abandoned, abandonmentRate, potentialRevenue };
  }, [normalizedFunnelData]);

  // Show loading state if no data
  if (!normalizedFunnelData || normalizedFunnelData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading funnel data...</div>
      </div>
    );
  }

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('funnel-page');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('funnel-analysis.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div id="funnel-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Funnel Analysis</h1>
          <p className="text-sm text-slate-400 mt-1">Optimize conversion and reduce cart abandonment</p>
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

      {/* Metrics */}
      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)' }}>
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">{abandonedCartMetrics.abandoned}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Abandoned Carts</p>
            <p className="text-xs text-slate-500 mt-1">{abandonedCartMetrics.abandonmentRate}% rate</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#f43f5e' }} />
        </div>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
              <ShoppingCart className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">₹{(abandonedCartMetrics.potentialRevenue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Potential Revenue</p>
            <p className="text-xs text-slate-500 mt-1">From abandoned</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#f59e0b' }} />
        </div>
        <div className="relative overflow-hidden bg-[#111827] border border-slate-600/60 rounded-2xl p-8 hover:border-slate-600/50 transition-all group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white tracking-tight">₹{((abandonedCartMetrics.potentialRevenue * 0.3) / 1000).toFixed(1)}K</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Recovery Potential</p>
            <p className="text-xs text-slate-500 mt-1">30% recovery</p>
          </div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: '#10b981' }} />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Conversion Funnel</h2>
          <span className="text-xs text-slate-500">Users at each step</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={normalizedFunnelData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis type="number" stroke="#64748b" style={{ fontSize: '11px' }} />
            <YAxis dataKey="step" type="category" stroke="#64748b" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value: number, _name: string, props: any) => {
                const percentage = props?.payload?.percentage ?? 0;
                return [`${value} users (${percentage.toFixed(1)}%)`, 'Conversions'];
              }}
            />
            <Bar dataKey="users" radius={[0, 4, 4, 0]}>
              {normalizedFunnelData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][index]} />
              ))}
              <LabelList dataKey="users" position="right" fill="#94a3b8" style={{ fontSize: '11px' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Funnel Steps */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <h2 className="text-base font-semibold text-white mb-4">Funnel Breakdown</h2>
        <div className="space-y-2">
          {normalizedFunnelData.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" 
                   style={{ backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][idx] }}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">{step.step}</span>
                  <span className="text-sm font-bold text-white">{step.users} users</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1">
                  <div className="h-1.5 rounded-full" style={{ width: `${step.percentage}%`, backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][idx] }} />
                </div>
              </div>
              <span className="text-xs text-slate-400 w-12 text-right">{step.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <h2 className="text-base font-semibold text-white mb-4">💡 Optimization Recommendations</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🛒', title: 'Reduce Abandonment', description: 'Exit-intent popup with 10% discount.', impact: 'High', potential: `+₹${((abandonedCartMetrics.potentialRevenue * 0.3) / 1000).toFixed(1)}K` },
            { icon: '📧', title: 'Recovery Emails', description: 'Send emails within 24 hours.', impact: 'High', potential: `+₹${((abandonedCartMetrics.potentialRevenue * 0.25) / 1000).toFixed(1)}K` },
            { icon: '⚡', title: 'Simplify Checkout', description: 'Single-page checkout flow.', impact: 'Medium', potential: `+₹${((abandonedCartMetrics.potentialRevenue * 0.15) / 1000).toFixed(1)}K` },
            { icon: '🎁', title: 'Free Shipping', description: 'Free shipping above ₹999.', impact: 'Medium', potential: `+₹${((abandonedCartMetrics.potentialRevenue * 0.12) / 1000).toFixed(1)}K` },
          ].map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-xl">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-white">{rec.title}</h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${rec.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {rec.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                <p className="text-xs text-emerald-400 font-medium mt-1">{rec.potential}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunnelAnalysisPage;
