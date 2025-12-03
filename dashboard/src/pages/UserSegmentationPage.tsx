import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { motion } from 'framer-motion';
import { Users, Download, Target, Filter } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const UserSegmentationPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState('all');

  if (!context) return null;

  const { funnelData, cohortData } = context;

  const lifecycleData = useMemo(() => {
    return [
      { name: 'New Users', value: 35, color: '#3B82F6', count: 20 },
      { name: 'Active Users', value: 40, color: '#10B981', count: 23 },
      { name: 'At-Risk Users', value: 15, color: '#F59E0B', count: 9 },
      { name: 'Churned Users', value: 10, color: '#EF4444', count: 5 },
    ];
  }, []);

  const highValueUsers = useMemo(() => {
    const purchases = funnelData.find((s) => s.step === 'Purchase')?.users || 0;
    return Array.from({ length: Math.min(purchases, 10) }, (_, i) => ({
      id: 1000 + i,
      name: `User ${1000 + i}`,
      purchases: Math.floor(Math.random() * 5) + 1,
      ltv: Math.floor(Math.random() * 50000) + 20000,
      segment: ['High-Value', 'Power User', 'VIP'][Math.floor(Math.random() * 3)],
      lastPurchase: `Nov ${Math.floor(Math.random() * 28) + 1}`,
    }));
  }, [funnelData]);

  const filteredUsers = useMemo(() => {
    if (segmentFilter === 'all') return highValueUsers;
    return highValueUsers.filter((u) => u.segment === segmentFilter);
  }, [highValueUsers, segmentFilter]);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('segmentation-page');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('user-segmentation.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div id="segmentation-page" className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">User Segmentation</h1>
          <p className="text-slate-400 text-lg">Identify and target high-value user segments</p>
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

      {/* Lifecycle Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-100">User Lifecycle Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lifecycleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {lifecycleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.count} users)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {lifecycleData.map((segment, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="glass rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-all card-hover shadow-xl shadow-black/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-lg shadow-lg" style={{ backgroundColor: segment.color }} />
                  <h3 className="font-semibold text-slate-100">{segment.name}</h3>
                </div>
                <span className="text-2xl font-bold" style={{ color: segment.color }}>
                  {segment.count}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div className="h-2.5 rounded-full shadow-lg" style={{ width: `${segment.value}%`, backgroundColor: segment.color }} />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{segment.value}% of total users</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* High-Value Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl border border-slate-800 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-100">High-Value Users</h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Segments</option>
              <option value="High-Value">High-Value</option>
              <option value="Power User">Power User</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Purchases</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">LTV</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Segment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono">{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-semibold">
                      {user.purchases}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-400">₹{user.ltv.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.segment === 'VIP'
                          ? 'bg-purple-900/50 text-purple-400'
                          : user.segment === 'Power User'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-amber-900/50 text-amber-400'
                      }`}
                    >
                      {user.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.lastPurchase}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 p-6 rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-4">💡 Segmentation Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Target At-Risk Users',
              description: '9 users at risk of churning. Send personalized re-engagement emails with 15% discount.',
              impact: 'High',
            },
            {
              icon: '💎',
              title: 'VIP Program for High-Value',
              description: 'Top 10 users generate 45% of revenue. Offer exclusive perks and early access.',
              impact: 'High',
            },
            {
              icon: '📧',
              title: 'Win Back Churned Users',
              description: '5 churned users. Launch win-back campaign with special offers. Potential: ₹42K.',
              impact: 'Medium',
            },
            {
              icon: '🚀',
              title: 'Activate New Users',
              description: '20 new users need onboarding. Send product guides and first-purchase incentives.',
              impact: 'Medium',
            },
          ].map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{rec.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      rec.impact === 'High' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'
                    }`}
                  >
                    {rec.impact} Impact
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserSegmentationPage;
