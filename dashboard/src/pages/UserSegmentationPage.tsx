import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { Users, Download, Target, Filter } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const UserSegmentationPage: React.FC = () => {
  const context = useContext(AppContext);
  const [exporting, setExporting] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState('all');

  if (!context) return null;

  const { segmentsData, highValueUsers } = context;

  // Normalize segments data
  const lifecycleData = useMemo(() => {
    return segmentsData.map((segment) => ({
      name: segment.segment_name,
      value: typeof segment.percentage === 'string' ? parseFloat(segment.percentage) : segment.percentage,
      color: segment.color,
      count: segment.user_count,
    }));
  }, [segmentsData]);

  // Filter high value users based on segment
  const filteredUsers = useMemo(() => {
    if (segmentFilter === 'all') return highValueUsers;
    return highValueUsers.filter((u) => u.segment === segmentFilter);
  }, [highValueUsers, segmentFilter]);

  // Get unique segments for filter dropdown
  const uniqueSegments = useMemo(() => {
    const segments = new Set(highValueUsers.map((u) => u.segment));
    return Array.from(segments);
  }, [highValueUsers]);

  // Calculate segment stats
  const segmentStats = useMemo(() => {
    const atRisk = lifecycleData.find((s) => s.name === 'At-Risk Users');
    const churned = lifecycleData.find((s) => s.name === 'Churned Users');
    const newUsers = lifecycleData.find((s) => s.name === 'New Users');
    const totalLTV = highValueUsers.reduce((sum, u) => sum + u.ltv, 0);
    const topUsersRevenue = highValueUsers.slice(0, 10).reduce((sum, u) => sum + u.ltv, 0);

    return {
      atRiskCount: atRisk?.count || 0,
      churnedCount: churned?.count || 0,
      newUsersCount: newUsers?.count || 0,
      totalLTV,
      topUsersRevenue,
      topUsersPercentage: totalLTV > 0 ? ((topUsersRevenue / totalLTV) * 100).toFixed(0) : 0,
    };
  }, [lifecycleData, highValueUsers]);

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
    <div id="segmentation-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Segmentation</h1>
          <p className="text-sm text-slate-400 mt-1">Identify and target high-value user segments</p>
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

      {/* Lifecycle Distribution */}
      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-cyan-500/15 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-base font-semibold text-white text-center mb-4">User Lifecycle</h2>
          {lifecycleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.count})`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              Loading segments data...
            </div>
          )}
        </div>

        <div className="space-y-3">
          {lifecycleData.map((segment, idx) => (
            <div key={idx} className="bg-[#111827] border border-slate-600/60 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
                  <span className="text-sm text-white font-medium">{segment.name}</span>
                </div>
                <span className="text-xl font-bold" style={{ color: segment.color }}>
                  {segment.count}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">{segment.value}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Value Users Table */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white">High-Value Users</h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
            >
              <option value="all">All Segments</option>
              {uniqueSegments.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600/60">
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Orders</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">LTV</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Segment</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="px-3 py-2 text-xs font-mono text-slate-300">{user.user_id}</td>
                    <td className="px-3 py-2 text-xs text-slate-300">{user.name}</td>
                    <td className="px-3 py-2 text-xs">
                      <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-medium">
                        {user.purchases}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs font-medium text-emerald-400">₹{user.ltv.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          user.segment === 'VIP'
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.segment === 'Power User'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {user.segment}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {new Date(user.last_purchase).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400 text-sm">
                    No users found for this segment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations - Now using real data */}
      <div className="bg-[#111827] border border-slate-600/60 rounded-2xl p-8">
        <h2 className="text-sm font-semibold text-white mb-4">💡 Segmentation Strategies</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: '🎯',
              title: 'Target At-Risk Users',
              description: `${segmentStats.atRiskCount} users at risk. Send re-engagement emails with 15% discount.`,
              impact: 'High',
            },
            {
              icon: '💎',
              title: 'VIP Program',
              description: `Top 10 users generate ${segmentStats.topUsersPercentage}% revenue. Offer exclusive perks.`,
              impact: 'High',
            },
            {
              icon: '📧',
              title: 'Win Back Churned',
              description: `${segmentStats.churnedCount} churned users. Launch win-back campaign. Potential: ₹${((segmentStats.churnedCount * 8500) / 1000).toFixed(0)}K.`,
              impact: 'Medium',
            },
            {
              icon: '🚀',
              title: 'Activate New Users',
              description: `${segmentStats.newUsersCount} new users need onboarding. Send product guides.`,
              impact: 'Medium',
            },
          ].map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-xl">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-white">{rec.title}</h3>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      rec.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {rec.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSegmentationPage;
