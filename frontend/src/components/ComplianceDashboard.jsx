// frontend/src/components/ComplianceOverview.jsx
// CHANGELOG: Modernized compliance dashboard layout with cleaner stat section, gauge redesign, and table-style alerts list.
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {Clipboard} from 'lucide-react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Loader,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { complianceService } from '../utils/complianceService';
import { adminService } from '../utils/adminService';
import { transformRecordsForCSV, downloadCSVFromData } from '../utils/csvExport';

// --- CUSTOM HOOK ---
const useComplianceData = () => {
  const [state, setState] = useState({
    stats: null,
    alerts: [],
    loading: true,
    error: '',
  });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const [statsData, alertsData] = await Promise.all([
        complianceService.getStats(),
        complianceService.getAlerts(),
      ]);
      setState({ stats: statsData, alerts: alertsData, loading: false, error: '' });
    } catch (err) {
      setState({
        stats: null,
        alerts: [],
        loading: false,
        error: err.message || 'Failed to fetch compliance data.',
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

// --- SUB COMPONENTS ---
const StatCard = memo(({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/60 
               rounded-xl p-4 shadow-md flex flex-col justify-between transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <Icon className={`h-5 w-5 text-${color}-400`} />
    </div>
    <p className="text-3xl font-bold text-white mt-2">{value}</p>
  </motion.div>
));

const ComplianceGauge = memo(({ score = 0 }) => {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90 ? '#22c55e' : score >= 75 ? '#facc15' : '#ef4444';

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/60 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center shadow-md">
      <svg width={size} height={size}>
        <circle
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{score}%</span>
        <p className="text-xs text-gray-400 mt-1">Compliance</p>
      </div>
    </div>
  );
});

// --- MAIN COMPONENT ---
const ComplianceDashboard = ({ addNotification, onViewDetails }) => {
  const { stats, alerts, loading, error } = useComplianceData();
  const [isExporting, setIsExporting] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    if (severityFilter === 'all') return alerts;
    return alerts.filter((a) => a.severity.toLowerCase() === severityFilter);
  }, [alerts, severityFilter]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const recordsToExport = await adminService.exportRecords();
      if (recordsToExport?.length > 0) {
        const csvData = transformRecordsForCSV(recordsToExport);
        downloadCSVFromData(
          csvData,
          `kyc_compliance_report_${new Date().toISOString().split('T')[0]}.csv`
        );
        addNotification('Report exported successfully!', 'info');
      } else {
        addNotification('No records available for export.', 'warning');
      }
    } catch (err) {
      addNotification(`Export failed: ${err.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [addNotification]);

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-400 bg-red-900/20 rounded-lg p-8">
        Error: {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Clipboard className="text-blue-400 h-9 w-9" />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Compliance Overview
          </h2>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
        >
          {isExporting ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {isExporting ? 'Exporting...' : 'Export Records'}
        </button>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ComplianceGauge score={Math.round(stats?.compliance_score || 0)} />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Records" value={stats?.total_records || 0} icon={BarChart3} color="blue" />
          <StatCard title="Active Alerts" value={stats?.active_alerts || 0} icon={AlertTriangle} color="red" />
          <StatCard title="24h Alerts" value={stats?.recent_alerts_24h || 0} icon={Clock} color="yellow" />
        </div>
      </div>

      {/* --- ALERTS SECTION --- */}
      <div className="bg-gray-900/50 border border-gray-700/60 rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" /> Active Fraud Alerts
          </h3>

          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-white text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* --- ALERT TABLE --- */}
        <div className="overflow-hidden border border-gray-700/50 rounded-xl divide-y divide-gray-700/40">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.alert_id}
                whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                className="flex justify-between items-center px-4 py-3 transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-100">{alert.message}</p>
                  <p className="text-xs text-gray-400">
                    Confidence: {alert.confidence_score}% &nbsp;|&nbsp;
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        alert.severity === 'high'
                          ? 'bg-red-600/30 text-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-600/30 text-yellow-300'
                          : 'bg-green-600/30 text-green-300'
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onViewDetails(alert.record_id)}
                  className="text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600/80 hover:bg-blue-700 text-white transition-all"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No alerts match the current filter.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceDashboard;
