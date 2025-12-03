import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  Download,
  Sparkles,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
    { path: '/cohort-analysis', icon: Users, label: 'Cohort Analysis', section: 'main' },
    { path: '/funnel-analysis', icon: TrendingUp, label: 'Funnel Analysis', section: 'main' },
    { path: '/revenue-insights', icon: DollarSign, label: 'Revenue Insights', section: 'main' },
    { path: '/user-segmentation', icon: Target, label: 'User Segmentation', section: 'main' },
  ];

  const utilityItems = [
    { icon: BarChart3, label: 'Reports', action: () => console.log('Reports') },
    { icon: Download, label: 'Export Data', action: () => console.log('Export') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help & Docs', action: () => console.log('Help') },
  ];

  return (
    <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col overflow-y-auto flex-shrink-0 h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-indigo-400 tracking-tight">Analytics Pro</h1>
            <p className="text-xs text-slate-600">eCommerce Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Analytics Section */}
        <div className="px-3 mb-6">
          <div className="px-3 py-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Analytics
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-indigo-600 text-white border-l-4 border-indigo-400 pl-2.5 shadow-lg shadow-indigo-500/20'
                      : 'text-[#cbd5e1] hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-[#cbd5e1] group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Utility Section */}
        <div className="px-3 border-t border-slate-800 pt-4">
          <div className="px-3 py-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Tools
          </div>
          <div className="space-y-1">
            {utilityItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#cbd5e1] hover:bg-slate-800 hover:text-white transition-all duration-200 group"
              >
                <item.icon className="w-5 h-5 flex-shrink-0 text-[#cbd5e1] group-hover:text-white transition-colors" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Stats Section - Fixed at Bottom */}
      <div className="border-t border-slate-800 p-4 bg-[#020617]">
        <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[#64748b] text-xs font-bold uppercase tracking-wide">Total Users</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-emerald-400 text-xs font-semibold">Live</span>
            </div>
          </div>
          <div className="text-[#f8fafc] text-3xl font-bold mb-1 tracking-tight">57</div>
          <div className="text-[#64748b] text-xs mb-3">November 2025</div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-[#1e293b] rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-[#64748b] text-xs font-semibold">Orders</div>
            <div className="text-[#f8fafc] text-xl font-bold mt-1">19</div>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="text-[#64748b] text-xs font-semibold">Revenue</div>
            <div className="text-[#f8fafc] text-xl font-bold mt-1">₹2.4M</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
