import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import { TrendingUp, Download, ShoppingCart, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FunnelAnalysisPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);

  if (!context) return null;

  const { funnelData } = context;

  const userJourneyData = useMemo(() => {
    const pageViews = funnelData.find((s) => s.step === 'Page View')?.users || 0;
    const cartAdds = funnelData.find((s) => s.step === 'Add to Cart')?.users || 0;
    const checkouts = funnelData.find((s) => s.step === 'Checkout')?.users || 0;
    const purchases = funnelData.find((s) => s.step === 'Purchase')?.users || 0;

    return [
      { from: 'Page View', to: 'Product View', value: Math.floor(pageViews * 0.8), color: '#3B82F6' },
      { from: 'Product View', to: 'Add to Cart', value: cartAdds, color: '#8B5CF6' },
      { from: 'Product View', to: 'Exit', value: Math.floor(pageViews * 0.8) - cartAdds, color: '#EF4444' },
      { from: 'Add to Cart', to: 'Checkout', value: checkouts, color: '#EC4899' },
      { from: 'Add to Cart', to: 'Abandoned', value: cartAdds - checkouts, color: '#F59E0B' },
      { from: 'Checkout', to: 'Purchase', value: purchases, color: '#10B981' },
      { from: 'Checkout', to: 'Failed', value: checkouts - purchases, color: '#EF4444' },
    ];
  }, [funnelData]);

  const abandonedCartMetrics = useMemo(() => {
    const cartAdds = funnelData.find((s) => s.step === 'Add to Cart')?.users || 0;
    const purchases = funnelData.find((s) => s.step === 'Purchase')?.users || 0;
    const abandoned = cartAdds - purchases;
    const abandonmentRate = ((abandoned / cartAdds) * 100).toFixed(1);
    const potentialRevenue = abandoned * 8500 * 0.7; // 70% of AOV
    return { abandoned, abandonmentRate, potentialRevenue };
  }, [funnelData]);

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
    <div id="funnel-page" className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Funnel Analysis</h1>
          <p className="text-slate-400 text-lg">Optimize conversion and reduce cart abandonment</p>
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

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Conversion Funnel</h2>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={funnelData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94A3B8" />
            <YAxis dataKey="step" type="category" stroke="#94A3B8" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                padding: '12px'
              }}
              labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
              formatter={(value: number, _name: string, props: any) => [
                `${value} users (${props.payload.percentage.toFixed(1)}%)`,
                'Conversions',
              ]}
            />
            <Bar dataKey="users" radius={[0, 12, 12, 0]} animationDuration={1000}>
              {funnelData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][index]} />
              ))}
              <LabelList dataKey="users" position="right" fill="#f1f5f9" style={{ fontWeight: 600 }} formatter={(v: any) => v?.toLocaleString()} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* User Journey Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">User Journey Flow</h2>
        </div>
        <div className="space-y-3">
          {userJourneyData.map((journey, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex-1 glass rounded-lg p-4 text-sm font-medium text-slate-200 border border-slate-800">{journey.from}</div>
              <div className="flex-shrink-0">
                <div className="relative w-36 h-12 glass rounded-lg overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((journey.value / 60) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className="absolute left-0 top-0 h-full rounded-lg shadow-lg"
                    style={{ backgroundColor: journey.color }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold z-10 text-white">{journey.value}</span>
                </div>
              </div>
              <div className="flex-1 glass rounded-lg p-4 text-sm font-medium text-slate-200 border border-slate-800">{journey.to}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Abandoned Cart Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass rounded-xl border border-rose-500/20 p-6 card-hover shadow-xl shadow-black/20 bg-gradient-to-br from-rose-500/10 to-transparent">
          <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wide">Abandoned Carts</p>
          <p className="text-4xl font-bold text-rose-400 mb-2">{abandonedCartMetrics.abandoned}</p>
          <p className="text-xs text-slate-500">{abandonedCartMetrics.abandonmentRate}% abandonment rate</p>
        </div>
        <div className="glass rounded-xl border border-amber-500/20 p-6 card-hover shadow-xl shadow-black/20 bg-gradient-to-br from-amber-500/10 to-transparent">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wide">Potential Revenue</p>
          <p className="text-4xl font-bold text-amber-400 mb-2">₹{(abandonedCartMetrics.potentialRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500">From abandoned carts</p>
        </div>
        <div className="glass rounded-xl border border-emerald-500/20 p-6 card-hover shadow-xl shadow-black/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wide">Recovery Potential</p>
          <p className="text-4xl font-bold text-emerald-400 mb-2">₹{(abandonedCartMetrics.potentialRevenue * 0.3 / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500">30% recovery rate</p>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl border border-indigo-500/20 p-6 shadow-xl shadow-black/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Conversion Optimization Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🛒',
              title: 'Reduce Cart Abandonment',
              description: `${abandonedCartMetrics.abandonmentRate}% abandonment rate is high. Implement exit-intent popup with 10% discount code.`,
              impact: 'High',
              potential: `+₹${(abandonedCartMetrics.potentialRevenue * 0.3 / 1000).toFixed(1)}K`,
            },
            {
              icon: '📧',
              title: 'Cart Recovery Emails',
              description: `Send automated emails to ${abandonedCartMetrics.abandoned} users who abandoned carts within 24 hours.`,
              impact: 'High',
              potential: `+₹${(abandonedCartMetrics.potentialRevenue * 0.25 / 1000).toFixed(1)}K`,
            },
            {
              icon: '⚡',
              title: 'Simplify Checkout',
              description: 'Reduce checkout steps from 3 to 1. Single-page checkout can improve conversion by 15%.',
              impact: 'Medium',
              potential: '+₹45K',
            },
            {
              icon: '🎁',
              title: 'Free Shipping Threshold',
              description: 'Offer free shipping above ₹999 to increase average order value and reduce abandonment.',
              impact: 'Medium',
              potential: '+₹38K',
            },
          ].map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="glass rounded-lg p-5 border border-slate-800 hover:border-slate-700 transition-all card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{rec.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-2 text-lg">{rec.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                        rec.impact === 'High' 
                          ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {rec.impact} Impact
                    </span>
                    <span className="text-sm font-bold text-emerald-400">{rec.potential}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FunnelAnalysisPage;
