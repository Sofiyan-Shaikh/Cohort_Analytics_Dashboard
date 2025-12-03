import React from 'react';
import { Calendar, Circle, User, Filter, Download, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showFilters, setShowFilters }) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return ['Analytics Pro', 'Dashboard', 'Overview'];
    if (path === '/cohort-analysis') return ['Analytics Pro', 'Dashboard', 'Cohort Analysis'];
    if (path === '/funnel-analysis') return ['Analytics Pro', 'Dashboard', 'Funnel Analysis'];
    if (path === '/revenue-insights') return ['Analytics Pro', 'Dashboard', 'Revenue Insights'];
    if (path === '/user-segmentation') return ['Analytics Pro', 'Dashboard', 'User Segmentation'];
    return ['Analytics Pro', 'Dashboard'];
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="h-16 bg-[#0f172a] border-b border-slate-800 z-[100] flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className={index === breadcrumbs.length - 1 ? 'text-[#f8fafc] font-semibold' : 'text-[#64748b]'}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[#475569]" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Date Range */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-lg text-[#e2e8f0] text-sm hover:border-slate-600 transition-colors cursor-pointer">
          <Calendar className="w-4 h-4 text-[#94a3b8]" />
          <span className="font-semibold">Nov 1 – Nov 30, 2025</span>
        </div>

        {/* Live Data Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shadow-lg shadow-emerald-500/10">
          <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-semibold">Live Data</span>
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            showFilters
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-[#1e293b] text-[#e2e8f0] border border-slate-700 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {/* Export PDF Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-700" />

        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
