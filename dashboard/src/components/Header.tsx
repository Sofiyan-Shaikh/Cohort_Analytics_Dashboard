import React, { useContext, useEffect, useState } from 'react';
import { Calendar, User, Filter, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';

interface HeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showFilters, setShowFilters }) => {
  const location = useLocation();
  const context = useContext(AppContext);
  const [dateEditorOpen, setDateEditorOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<{ start: string; end: string }>({
    start: context?.dateRange.start ?? '',
    end: context?.dateRange.end ?? '',
  });
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (context?.dateRange) {
      setDraftRange(context.dateRange);
      setDateError(null);
    }
  }, [context?.dateRange]);

  const formattedRange = context
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
        new Date(context.dateRange.start),
      ) +
      ' - ' +
      new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(context.dateRange.end))
    : 'Select range';

  const applyRange = () => {
    if (!draftRange.start || !draftRange.end) {
      setDateError('Pick both dates');
      return;
    }
    if (new Date(draftRange.start) > new Date(draftRange.end)) {
      setDateError('Start must be before end');
      return;
    }
    context?.setDateRange(draftRange);
    setDateEditorOpen(false);
    setDateError(null);
  };

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
    <header className="flex h-14 items-center justify-between border-b border-slate-700/50 bg-[#0d1321] px-8">
      {/* Left: Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span 
              className={`${
                index === breadcrumbs.length - 1 
                  ? 'text-white font-medium' 
                  : 'text-slate-400 hover:text-slate-300 cursor-pointer'
              }`}
            >
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 mx-0.5" />
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right: Action Buttons */}
      <div className="flex items-center" style={{ gap: '1rem' }}>
        {/* Date Range Picker */}
        <div className="relative">
          <button
            onClick={() => setDateEditorOpen((prev) => !prev)}
            className="flex items-center gap-2 h-9 rounded-lg border border-slate-600/50 bg-[#111827] px-3 text-sm text-slate-200 hover:border-slate-500 hover:bg-[#1a2332] transition-all"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formattedRange}</span>
          </button>
          {dateEditorOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-600/50 bg-[#111827] p-4 shadow-2xl">
              <div className="grid gap-3">
                <label className="text-xs text-slate-400 font-medium">
                  Start date
                  <input
                    type="date"
                    value={draftRange.start}
                    max={draftRange.end || undefined}
                    onChange={(e) => {
                      setDraftRange((prev) => ({ ...prev, start: e.target.value }));
                      setDateError(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-600/50 bg-[#0d1321] px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </label>
                <label className="text-xs text-slate-400 font-medium">
                  End date
                  <input
                    type="date"
                    value={draftRange.end}
                    min={draftRange.start || undefined}
                    onChange={(e) => {
                      setDraftRange((prev) => ({ ...prev, end: e.target.value }));
                      setDateError(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-600/50 bg-[#0d1321] px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              </div>
              {dateError && <p className="mt-2 text-xs text-rose-400">{dateError}</p>}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setDateEditorOpen(false)}
                  className="h-8 rounded-lg border border-slate-600/50 px-3 text-xs text-slate-300 hover:bg-slate-700/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={applyRange} 
                  className="h-8 rounded-lg bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 h-9 rounded-lg border px-3 text-sm font-medium transition-all ${
            showFilters
              ? 'border-indigo-500 bg-indigo-500/20 text-white'
              : 'border-slate-600/50 bg-[#111827] text-slate-200 hover:border-slate-500 hover:bg-[#1a2332]'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 h-9 rounded-lg border border-slate-600/50 bg-[#111827] px-3 text-sm text-slate-200">
          <User className="w-4 h-4 text-slate-400" />
          <span>Ops Lead</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
