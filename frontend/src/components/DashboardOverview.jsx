// FILE: frontend/src/components/DashboardOverview.jsx
import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, AlertTriangle, Star, FileText, Eye } from 'lucide-react';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// --- REUSABLE SUB-COMPONENTS ---
const StatCard = memo(({ title, value, icon: Icon, color }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-cyan-800/60 flex flex-col items-center justify-center text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300`}
  >
    <div className={`p-5 rounded-full bg-${color}-500/10 mb-4`}>
      <Icon className={`h-8 w-8 text-${color}-400`} />
    </div>
    <p className="text-sm text-gray-400 font-medium">{title}</p>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </motion.div>
));

const RecentRecordItem = memo(({ record, StatusBadgeComponent, onViewRecord }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gray-800/50 border border-cyan-900/60 rounded-xl p-4 flex items-start gap-4 hover:shadow-lg transition-shadow"
  >
    <div className="flex-shrink-0 mt-1">
      <div className="p-2 bg-gray-700/40 rounded-lg">
        <FileText className="h-5 w-5 text-gray-300" />
      </div>
    </div>
    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex flex-col">
          <p className="text-gray-200 font-semibold truncate max-w-[220px]" title={record.filename}>
            {record.filename}
          </p>
          <p className="text-xs text-gray-400">{new Date(record.created_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <StatusBadgeComponent status={record.status} />
        <button
          onClick={() => onViewRecord(record)}
          className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-blue-500/10"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </button>
      </div>
    </div>
  </motion.div>
));

// --- MAIN COMPONENT ---
const DashboardOverview = ({ user, stats, records, StatusBadgeComponent, onViewRecord }) => {
  const recentRecords = useMemo(() => records.slice(0, 5), [records]);

  const statCards = useMemo(
    () => [
      { title: 'Total Records', value: stats.total_records || 0, icon: BarChart3, color: 'blue' },
      { title: 'Verified Documents', value: stats.verified_count || 0, icon: CheckCircle, color: 'green' },
      { title: 'High-Risk Flags', value: stats.high_risk_count || 0, icon: AlertTriangle, color: 'red' },
      { title: 'Avg. Confidence', value: `${Math.round(stats.avg_confidence || 0)}%`, icon: Star, color: 'yellow' },
    ],
    [stats]
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-gray-400 mt-1">Here's a summary of your KYC activity.</p>
      </motion.div>

      {/* Stat Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </motion.div>

      {/* Recent Activity Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <p className="text-gray-400 text-sm mt-1">All your recent uploads and verifications.</p>
      </motion.div>

      {/* Recent Activity Stack */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {recentRecords.length > 0 ? (
          recentRecords.map((record) => (
            <RecentRecordItem
              key={record._id}
              record={record}
              StatusBadgeComponent={StatusBadgeComponent}
              onViewRecord={onViewRecord}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <p className="font-semibold">No recent activity.</p>
            <p className="text-sm">Upload a document to get started.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default memo(DashboardOverview);
