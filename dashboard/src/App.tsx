import React, { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalFilters from './components/GlobalFilters';
import HomePage from './pages/HomePage';
import CohortAnalysisPage from './pages/CohortAnalysisPage';
import FunnelAnalysisPage from './pages/FunnelAnalysisPage';
import RevenueInsightsPage from './pages/RevenueInsightsPage';
import UserSegmentationPage from './pages/UserSegmentationPage';
import SettingsPage from './pages/SettingsPage';
import { AlertCircle } from 'lucide-react';

export interface CohortData {
  cohort_date: string;
  week_0: number;
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
}

export interface FunnelData {
  step: string;
  users: number;
  percentage: number | string;
}

export interface ProductData {
  name: string;
  category: string;
  revenue: number;
  units: number;
}

export interface SegmentData {
  segment_name: string;
  user_count: number;
  percentage: number | string;
  color: string;
}

export interface HighValueUser {
  user_id: number;
  name: string;
  email: string;
  purchases: number;
  ltv: number;
  segment: string;
  last_purchase: string;
}

export interface AppContextType {
  cohortData: CohortData[];
  funnelData: FunnelData[];
  productsData: ProductData[];
  segmentsData: SegmentData[];
  highValueUsers: HighValueUser[];
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  deviceFilter: string;
  setDeviceFilter: (device: string) => void;
  sourceFilter: string;
  setSourceFilter: (source: string) => void;
  eventFilter: string;
  setEventFilter: (event: string) => void;
  loading: boolean;
  error: string | null;
}

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [productsData, setProductsData] = useState<ProductData[]>([]);
  const [segmentsData, setSegmentsData] = useState<SegmentData[]>([]);
  const [highValueUsers, setHighValueUsers] = useState<HighValueUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [dateRange, setDateRange] = useState({
    start: searchParams.get('start') || '2025-11-01',
    end: searchParams.get('end') || '2025-11-30',
  });
  const [deviceFilter, setDeviceFilter] = useState(searchParams.get('device') || 'all');
  const [sourceFilter, setSourceFilter] = useState(searchParams.get('source') || 'all');
  const [eventFilter, setEventFilter] = useState(searchParams.get('event') || 'all');

  useEffect(() => {
    setSearchParams({
      start: dateRange.start,
      end: dateRange.end,
      device: deviceFilter,
      source: sourceFilter,
      event: eventFilter,
    });
  }, [dateRange, deviceFilter, sourceFilter, eventFilter, setSearchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cohortResponse, funnelResponse, productsResponse, segmentsResponse, usersResponse] = await Promise.all([
        axios.get<CohortData[]>('http://127.0.0.1:8002/api/cohorts/'),
        axios.get<FunnelData[]>('http://127.0.0.1:8002/api/funnel/'),
        axios.get<ProductData[]>('http://127.0.0.1:8002/api/products/'),
        axios.get<SegmentData[]>('http://127.0.0.1:8002/api/segments/'),
        axios.get<HighValueUser[]>('http://127.0.0.1:8002/api/users/'),
      ]);
      setCohortData(cohortResponse.data);
      setFunnelData(funnelResponse.data);
      setProductsData(productsResponse.data);
      setSegmentsData(segmentsResponse.data);
      setHighValueUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please ensure backend is running on port 8002.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-8">
        <div className="bg-[#1e293b] rounded-2xl border border-rose-500/30 p-8 max-w-md text-center animate-scale-in shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[#f8fafc] mb-2">Connection Error</h2>
          <p className="text-[#94a3b8] mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const contextValue: AppContextType = {
    cohortData,
    funnelData,
    productsData,
    segmentsData,
    highValueUsers,
    dateRange,
    setDateRange,
    deviceFilter,
    setDeviceFilter,
    sourceFilter,
    setSourceFilter,
    eventFilter,
    setEventFilter,
    loading,
    error,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#0d1321] text-[#dbe4ff]">
        <div className="flex h-screen flex-col">
          <Header showFilters={showFilters} setShowFilters={setShowFilters} />
          <div className="flex flex-1 overflow-hidden" style={{ gap: '1.5rem' }}>
            <Sidebar />
            <main className="flex-1 overflow-y-auto rounded-tl-3xl main-content-bg">
              <GlobalFilters showFilters={showFilters} setShowFilters={setShowFilters} />
              <div className="w-full px-10 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cohort-analysis" element={<CohortAnalysisPage />} />
                  <Route path="/funnel-analysis" element={<FunnelAnalysisPage />} />
                  <Route path="/revenue-insights" element={<RevenueInsightsPage />} />
                  <Route path="/user-segmentation" element={<UserSegmentationPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
