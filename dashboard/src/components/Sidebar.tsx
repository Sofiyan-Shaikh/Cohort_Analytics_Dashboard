import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Settings,
  HelpCircle,
  Download,
  FileText,
  BarChart2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [exportingData, setExportingData] = useState(false);

  const mainNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/cohort-analysis', icon: Users, label: 'Cohort Analysis' },
    { path: '/funnel-analysis', icon: TrendingUp, label: 'Funnel Analysis' },
    { path: '/revenue-insights', icon: DollarSign, label: 'Revenue Insights' },
    { path: '/user-segmentation', icon: Target, label: 'User Segmentation' },
  ];

  const handleExportData = async () => {
    setExportingData(true);
    try {
      const [cohorts, funnel, products, segments, users] = await Promise.all([
        fetch('http://127.0.0.1:8002/api/cohorts/').then(r => r.json()),
        fetch('http://127.0.0.1:8002/api/funnel/').then(r => r.json()),
        fetch('http://127.0.0.1:8002/api/products/').then(r => r.json()),
        fetch('http://127.0.0.1:8002/api/segments/').then(r => r.json()),
        fetch('http://127.0.0.1:8002/api/users/').then(r => r.json()),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        cohortRetention: cohorts,
        conversionFunnel: funnel,
        topProducts: products,
        userSegments: segments,
        highValueUsers: users,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportingData(false);
    }
  };

  const handleViewReports = () => {
    navigate('/');
  };

  const handleOpenDocs = () => {
    window.open('https://github.com', '_blank');
  };

  return (
    <aside className="flex w-48 min-w-[192px] max-w-[192px] flex-shrink-0 flex-col bg-slate-900/95 border-r border-slate-700/50">
      {/* Logo Section */}
      <div className="px-4 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white">Analytics Pro</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400/60">
          Menu
        </div>
        <div className="space-y-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-indigo-500/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-400/70 group-hover:text-indigo-300'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Tools Section */}
        <div className="mt-8 pt-5 border-t border-indigo-500/20">
          <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400/60">
            Tools
          </div>
          <div className="space-y-2">
            <button
              onClick={handleViewReports}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-transparent text-indigo-200 transition-all hover:bg-indigo-500/15 hover:text-white border-0 outline-none"
            >
              <FileText className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
              <span className="flex-1 text-left">Reports</span>
            </button>
            <button
              onClick={handleExportData}
              disabled={exportingData}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-transparent text-emerald-200 transition-all hover:bg-emerald-500/15 hover:text-emerald-100 disabled:opacity-50 border-0 outline-none"
            >
              {exportingData ? (
                <div className="w-5 h-5 border-2 border-emerald-500/50 border-t-emerald-300 rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
              )}
              <span className="flex-1 text-left">{exportingData ? 'Exporting...' : 'Export Data'}</span>
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8 pt-5 border-t border-indigo-500/20">
          <div className="space-y-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-200'
                    : 'bg-transparent text-violet-200 hover:bg-violet-500/15 hover:text-violet-100'
                }`
              }
            >
              <Settings className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
              <span className="flex-1">Settings</span>
            </NavLink>
            <button
              onClick={handleOpenDocs}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-transparent text-amber-200 transition-all hover:bg-amber-500/15 hover:text-amber-100 border-0 outline-none"
            >
              <HelpCircle className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
              <span className="flex-1 text-left">Help & Docs</span>
              <ExternalLink className="w-4 h-4 text-amber-400/70" />
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Stats */}
      <div className="border-t border-indigo-500/20 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300/70 mb-3">
            Quick Stats
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-indigo-500/20">
              <p className="text-[10px] text-indigo-300/60">Orders</p>
              <p className="text-lg font-bold text-white">19</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-300/60">Revenue</p>
              <p className="text-lg font-bold text-emerald-400">₹300K</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
