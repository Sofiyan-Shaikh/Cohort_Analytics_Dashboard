import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Download, X, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CohortAnalysisPage: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedCell, setSelectedCell] = useState<{ cohort: string; week: string; users: number } | null>(null);
  const [exporting, setExporting] = useState(false);

  if (!context) return null;

  const { cohortData, dateRange } = context;

  const filteredCohortData = useMemo(() => {
    return cohortData.filter((cohort) => {
      const date = new Date(cohort.cohort_date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return date >= start && date <= end;
    });
  }, [cohortData, dateRange]);

  const retentionCurve = useMemo(() => {
    if (filteredCohortData.length === 0) return [];
    const weeks = ['week_0', 'week_1', 'week_2', 'week_3', 'week_4'] as const;
    return weeks.map((week, idx) => {
      const avg = filteredCohortData.reduce((sum, c) => sum + (c[week] / c.week_0) * 100, 0) / filteredCohortData.length;
      return { week: `Week ${idx}`, retention: avg.toFixed(1) };
    });
  }, [filteredCohortData]);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('cohort-page');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cohort-analysis.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div id="cohort-page" className="space-y-12 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold text-[#f8fafc] mb-3 tracking-tight">Cohort Analysis</h1>
          <p className="text-lg text-[#94a3b8]">Track user retention and identify drop-off patterns</p>
        </div>
        <button
          onClick={exportToPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 font-semibold hover:scale-105"
        >
          <Download className="w-5 h-5" />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </motion.div>

      {/* Retention Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1e293b] rounded-2xl border border-emerald-500/20 p-8 card-hover shadow-xl shadow-black/30 bg-gradient-to-br from-emerald-500/10 to-transparent min-h-[200px]">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-sm text-[#94a3b8] mb-3 font-semibold uppercase tracking-wide">Week 1 Retention</p>
            <p className="text-5xl font-bold text-emerald-400 mb-3 tracking-tight">{retentionCurve[1]?.retention}%</p>
            <p className="text-sm text-[#64748b]">Average across all cohorts</p>
          </div>
          <div className="bg-[#1e293b] rounded-2xl border border-amber-500/20 p-8 card-hover shadow-xl shadow-black/30 bg-gradient-to-br from-amber-500/10 to-transparent min-h-[200px]">
            <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-sm text-[#94a3b8] mb-3 font-semibold uppercase tracking-wide">Week 4 Retention</p>
            <p className="text-5xl font-bold text-amber-400 mb-3 tracking-tight">{retentionCurve[4]?.retention}%</p>
            <p className="text-sm text-[#64748b]">Long-term engagement</p>
          </div>
          <div className="bg-[#1e293b] rounded-2xl border border-rose-500/20 p-8 card-hover shadow-xl shadow-black/30 bg-gradient-to-br from-rose-500/10 to-transparent min-h-[200px]">
            <div className="w-14 h-14 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-rose-400" />
            </div>
            <p className="text-sm text-[#94a3b8] mb-3 font-semibold uppercase tracking-wide">Improvement Needed</p>
            <p className="text-5xl font-bold text-rose-400 mb-3 tracking-tight">
              {(100 - parseFloat(retentionCurve[4]?.retention || '0')).toFixed(1)}%
            </p>
            <p className="text-sm text-[#64748b]">Users churned by week 4</p>
          </div>
        </div>
      </motion.div>

      {/* Retention Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Retention Curve</h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={retentionCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="week" stroke="#94A3B8" style={{ fontSize: '12px', fontWeight: 500 }} />
            <YAxis stroke="#94A3B8" tickFormatter={(v) => `${v}%`} style={{ fontSize: '12px', fontWeight: 500 }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                padding: '12px'
              }}
              labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
              formatter={(value: number) => [`${value}%`, 'Retention']}
            />
            <Line type="monotone" dataKey="retention" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 6, strokeWidth: 2, stroke: '#0f172a' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Cohort Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Cohort Retention Heatmap</h2>
          <span className="text-sm text-slate-400 ml-2">(Click cells for details)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Cohort Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Week 0</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Week 1</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Week 2</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Week 3</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {filteredCohortData.map((row, idx) => {
                const isBlackFriday = row.cohort_date >= '2025-11-24' && row.cohort_date <= '2025-11-30';
                return (
                  <tr
                    key={idx}
                    className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                      isBlackFriday ? 'bg-amber-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-left font-medium text-slate-200">
                      {isBlackFriday && <span className="mr-2">🎉</span>}
                      {new Date(row.cohort_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    {(['week_0', 'week_1', 'week_2', 'week_3', 'week_4'] as const).map((week, i) => {
                      const users = row[week];
                      const pct = (users / row.week_0) * 100;
                      const bgColor =
                        week === 'week_0' 
                          ? 'bg-slate-700/50' 
                          : pct > 70 
                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' 
                            : pct >= 40 
                              ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                              : 'bg-gradient-to-br from-rose-600 to-rose-700';
                      return (
                        <td
                          key={i}
                          onClick={() => setSelectedCell({ cohort: row.cohort_date, week, users })}
                          className={`px-4 py-3 font-semibold ${bgColor} hover:scale-105 hover:shadow-lg hover:z-10 transition-all cursor-pointer rounded-lg`}
                          title={`Click to see user details`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-lg text-white">{week === 'week_0' ? users : `${pct.toFixed(0)}%`}</span>
                            <span className="text-xs text-white/75">{week !== 'week_0' && `${users} users`}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl border border-indigo-500/20 p-6 shadow-xl shadow-black/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Retention Improvement Recommendations</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              title: 'Week 1 Drop-off is Critical',
              description: `${(100 - parseFloat(retentionCurve[1]?.retention || '0')).toFixed(1)}% users churn after week 1. Send welcome email series with product tips.`,
              impact: 'High',
            },
            {
              title: 'Re-engage Week 2-3 Users',
              description: 'Users who stay past week 2 are 3x more likely to become repeat customers. Offer personalized discounts.',
              impact: 'High',
            },
            {
              title: 'Launch Loyalty Program',
              description: `Week 4 retention at ${retentionCurve[4]?.retention}%. Reward repeat purchases to boost long-term retention by 25%.`,
              impact: 'Medium',
            },
          ].map((rec, idx) => (
            <div key={idx} className="glass rounded-lg p-5 border border-slate-800 hover:border-slate-700 transition-all card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-2 text-lg">{rec.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{rec.description}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
                    rec.impact === 'High' 
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {rec.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Drill-down Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl border border-slate-700 p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">User Details</h2>
                <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-slate-100 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-lg p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-2 font-medium">Cohort Date</p>
                    <p className="text-xl font-bold text-slate-100">
                      {new Date(selectedCell.cohort).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="glass rounded-lg p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-2 font-medium">Week</p>
                    <p className="text-xl font-bold text-slate-100">{selectedCell.week.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <div className="glass rounded-lg p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
                  <p className="text-sm text-slate-400 mb-3 font-medium">Active Users in This Cell</p>
                  <p className="text-5xl font-bold text-emerald-400">{selectedCell.users}</p>
                </div>
                <div className="glass rounded-lg p-5 border border-slate-800">
                  <p className="text-sm text-slate-400 mb-4 font-medium">Sample User IDs (Mock Data)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: Math.min(selectedCell.users, 9) }, (_, i) => (
                      <div key={i} className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm text-center text-slate-200 font-medium">
                        User {1000 + i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CohortAnalysisPage;
