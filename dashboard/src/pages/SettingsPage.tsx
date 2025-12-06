import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bell,
  CheckCircle2,
  Database,
  Globe,
  RefreshCw,
  Save,
  ShieldCheck,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import { AppContext } from '../App';

type RangeOption = 'last7' | 'last30' | 'thisMonth';

interface SettingsState {
  fullName: string;
  email: string;
  timezone: string;
  notifyEmail: boolean;
  notifySlack: boolean;
  weeklyDigest: boolean;
  autoRefresh: number;
  defaultRange: RangeOption;
  currency: string;
  backendHost: string;
  slackWebhook: string;
  dataRegion: string;
}

type BooleanSetting = 'notifyEmail' | 'notifySlack' | 'weeklyDigest';

const STORAGE_KEY = 'cohort_analytics_settings';

const defaultSettings: SettingsState = {
  fullName: 'Sofiyan Shaikh',
  email: 'sofiyan@example.com',
  timezone: 'Asia/Kolkata',
  notifyEmail: true,
  notifySlack: false,
  weeklyDigest: true,
  autoRefresh: 15,
  defaultRange: 'last30',
  currency: 'INR',
  backendHost: 'http://127.0.0.1:8002',
  slackWebhook: '',
  dataRegion: 'Mumbai (India)',
};

const rangeToDates = (range: RangeOption) => {
  const end = new Date();
  let start = new Date(end);

  switch (range) {
    case 'last7':
      start.setDate(end.getDate() - 6);
      break;
    case 'last30':
      start.setDate(end.getDate() - 29);
      break;
    case 'thisMonth':
      start = new Date(end.getFullYear(), end.getMonth(), 1);
      break;
  }

  const toISO = (d: Date) => d.toISOString().split('T')[0];
  return { start: toISO(start), end: toISO(end) };
};

const SettingsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [lastSaved, setLastSaved] = useState<string>(() => {
    const timestamp = localStorage.getItem(`${STORAGE_KEY}_saved_at`);
    return timestamp ? new Date(timestamp).toLocaleString() : 'Never';
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleChange = <K extends keyof SettingsState>(field: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: BooleanSetting) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setError(null);
    if (!settings.fullName.trim() || !settings.email.includes('@')) {
      setError('Please provide a valid name and email address.');
      return;
    }

    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const timestamp = new Date().toISOString();
    localStorage.setItem(`${STORAGE_KEY}_saved_at`, timestamp);
    setLastSaved(new Date(timestamp).toLocaleString());

    if (context) {
      const { setDateRange } = context;
      setDateRange(rangeToDates(settings.defaultRange));
    }

    setFeedback('Settings updated');
    setTimeout(() => setFeedback(null), 2500);
    setSaving(false);
  };

  const handleTestConnection = async () => {
    setConnectionStatus('loading');
    setConnectionMessage('Testing API connectivity...');
    try {
      const response = await axios.get(`${settings.backendHost}/api/cohorts/`, { timeout: 5000 });
      setConnectionStatus('success');
      setConnectionMessage(`Backend reachable (status ${response.status})`);
    } catch (err) {
      setConnectionStatus('error');
      setConnectionMessage((err as Error).message || 'Unable to reach backend');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Control Center</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-white">Settings</h1>
            <p className="text-slate-400">Manage workspace preferences, alerts, and integrations.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        <div className="text-xs text-slate-500">Last saved: {lastSaved}</div>
        {error && <div className="text-rose-400 text-sm">{error}</div>}
        {feedback && <div className="text-emerald-400 text-sm">{feedback}</div>}
      </header>

      {/* Profile */}
      <section className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">Workspace Identity</h2>
            <p className="text-sm text-slate-400">Used across dashboards and exports.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Full Name
            <input
              type="text"
              value={settings.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Contact Email
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Timezone
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Singapore'].map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Currency
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              {['INR', 'USD', 'EUR', 'GBP'].map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-amber-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">Notifications & Alerts</h2>
            <p className="text-sm text-slate-400">Stay updated about anomalies and weekly summaries.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Email Alerts', field: 'notifyEmail' as const, description: 'Critical cohort drops and outages.' },
            { label: 'Slack Alerts', field: 'notifySlack' as const, description: 'Send alerts to workspace channel.' },
            { label: 'Weekly Digest', field: 'weeklyDigest' as const, description: 'Every Monday 9am in your timezone.' },
          ].map((toggle) => (
            <div key={toggle.field} className="rounded-xl border border-white/10 bg-[#0c1224] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{toggle.label}</span>
                <button
                  onClick={() => handleToggle(toggle.field)}
                  className={`flex h-6 w-12 items-center rounded-full transition ${
                    settings[toggle.field] ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white transition ${
                      settings[toggle.field] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-400">{toggle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data preferences */}
      <section className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="w-5 h-5 text-cyan-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">Data Preferences</h2>
            <p className="text-sm text-slate-400">Configure default date ranges and refresh cadence.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Auto-refresh interval (minutes): {settings.autoRefresh}
            </label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={settings.autoRefresh}
              onChange={(e) => handleChange('autoRefresh', Number(e.target.value))}
              className="w-full h-2 rounded-full bg-white/10 accent-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Default dashboard range</label>
            <select
              value={settings.defaultRange}
              onChange={(e) => handleChange('defaultRange', e.target.value as RangeOption)}
              className="w-full rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="thisMonth">This month</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">
              Applied to dashboard filters whenever settings are saved.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-emerald-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">Integrations</h2>
            <p className="text-sm text-slate-400">Connect APIs and Slack for instant insights.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Backend host
            <input
              type="text"
              value={settings.backendHost}
              onChange={(e) => handleChange('backendHost', e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Slack webhook URL
            <input
              type="text"
              value={settings.slackWebhook}
              onChange={(e) => handleChange('slackWebhook', e.target.value)}
              placeholder="https://hooks.slack.com/..."
              className="rounded-xl border border-white/10 bg-[#101a34] px-4 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={handleTestConnection}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-400/60"
          >
            <Wifi className="w-4 h-4" />
            Test API Connection
          </button>
          {connectionStatus === 'loading' && (
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              {connectionMessage}
            </span>
          )}
          {connectionStatus === 'success' && (
            <span className="text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {connectionMessage || 'Backend reachable'}
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="text-sm text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {connectionMessage}
            </span>
          )}
        </div>
      </section>

      {/* Compliance */}
      <section className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-purple-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">Data Residency & Compliance</h2>
            <p className="text-sm text-slate-400">Choose where anonymized exports are stored.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {['Mumbai (India)', 'Frankfurt (EU)', 'Oregon (US)'].map((region) => (
            <button
              key={region}
              onClick={() => handleChange('dataRegion', region)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                settings.dataRegion === region
                  ? 'border-indigo-500 text-white'
                  : 'border-white/10 text-slate-300 hover:border-indigo-500/40'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

