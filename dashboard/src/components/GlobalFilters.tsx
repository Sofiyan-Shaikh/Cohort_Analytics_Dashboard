import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Calendar, Filter, ChevronDown, Smartphone, Globe, Activity } from 'lucide-react';

interface GlobalFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ showFilters, setShowFilters }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { dateRange, setDateRange, deviceFilter, setDeviceFilter, sourceFilter, setSourceFilter, eventFilter, setEventFilter } =
    context;

  if (!showFilters) return null;

  return (
    <div className="bg-[#1e293b] border-b border-slate-700 px-8 py-8 animate-slide-in">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-6">Filter Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range */}
          <div>
            <label className="flex items-center gap-2 text-[#94a3b8] text-xs mb-2 font-semibold uppercase tracking-wide">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm flex-1 text-[#e2e8f0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm flex-1 text-[#e2e8f0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* Device */}
          <div>
            <label className="flex items-center gap-2 text-[#94a3b8] text-xs mb-2 font-semibold uppercase tracking-wide">
              <Smartphone className="w-4 h-4" />
              Device
            </label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm w-full text-[#e2e8f0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="flex items-center gap-2 text-[#94a3b8] text-xs mb-2 font-semibold uppercase tracking-wide">
              <Globe className="w-4 h-4" />
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm w-full text-[#e2e8f0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
            >
              <option value="all">All Sources</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="direct">Direct</option>
              <option value="blackfriday">Black Friday</option>
            </select>
          </div>

          {/* Event */}
          <div>
            <label className="flex items-center gap-2 text-[#94a3b8] text-xs mb-2 font-semibold uppercase tracking-wide">
              <Activity className="w-4 h-4" />
              Event
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm w-full text-[#e2e8f0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
            >
              <option value="all">All Events</option>
              <option value="page_view">Page View</option>
              <option value="add_to_cart">Add to Cart</option>
              <option value="checkout">Checkout</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilters;
