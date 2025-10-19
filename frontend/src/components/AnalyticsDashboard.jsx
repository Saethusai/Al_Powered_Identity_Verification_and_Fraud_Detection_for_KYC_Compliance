// FILE: frontend/src/components/AnalyticsDashboard.jsx
// CHANGELOG: Refined chart layout alignment and improved container centering for consistent visual structure.

import React, { lazy, Suspense, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckSquare,
  Layers,
  AlertTriangle,
  Calendar,
  Activity,
} from 'lucide-react';

// Lazy load charts
const DocumentTypesChart = lazy(() => import('./Charts/DocumentTypesChart'));
const FraudTrendsChart = lazy(() => import('./Charts/FraudTrendsChart'));
const RiskCategoriesChart = lazy(() => import('./Charts/RiskCategoriesChart'));
const DocumentStatusChart = lazy(() => import('./Charts/DocumentStatusChart'));

// === REUSABLE COMPONENTS ===

const KpiCard = memo(({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 250 }}
    className="bg-gray-900/70 backdrop-blur-sm border border-cyan-700/60 p-5 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-cyan-500/10 transition-all"
  >
    <div>
      <p className="text-sm text-gray-400 uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-${color}-500/10`}>
      <Icon className={`h-7 w-7 text-${color}-400`} />
    </div>
  </motion.div>
));

const ChartCard = memo(({ title, subtitle, children }) => (
  <div className="bg-gray-800/60 backdrop-blur-md border border-cyan-700/50 p-6 rounded-2xl shadow-lg h-full min-h-[380px] flex flex-col">
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-gray-100 flex items-center justify-between">
        {title}
        {subtitle && <span className="text-xs text-gray-400 font-normal">{subtitle}</span>}
      </h3>
      <div className="h-[2px] bg-gradient-to-r from-cyan-500/30 to-transparent mt-2 rounded-full"></div>
    </div>
    <div className="flex-1 flex justify-center items-center">
      {children}
    </div>
  </div>
));

const SkeletonLoader = () => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/60 h-full min-h-[380px] animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-[calc(100%-32px)] bg-gray-700/50 rounded-lg"></div>
  </div>
);

// === MAIN COMPONENT ===

const AnalyticsDashboard = ({ stats = {}, fraudTrends = [], fraudPatterns = [] }) => {
  const kpiData = useMemo(
    () => [
      { title: 'Total Documents', value: stats.total_records || 0, icon: Layers, color: 'blue' },
      { title: 'Verified IDs', value: stats.verified_count || 0, icon: CheckSquare, color: 'green' },
      { title: 'High Risk Cases', value: stats.high_risk_count || 0, icon: AlertTriangle, color: 'red' },
      {
        title: 'Avg. Confidence',
        value: `${(stats.average_confidence_score || 0).toFixed(1)}%`,
        icon: PieChart,
        color: 'purple',
      },
    ],
    [stats]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {/* === HEADER === */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center tracking-tight">
            <BarChart3 className="h-8 w-8 mr-3 text-cyan-400" />
            KYC Fraud Intelligence Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            A deep analytical view of document verification trends and risk indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-800/70 px-4 py-2 rounded-lg border border-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select className="bg-transparent text-sm text-white focus:outline-none">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>All Time</option>
          </select>
        </div>
      </header>

      {/* === KPI OVERVIEW === */}
      <section>
        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          System Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </section>

      {/* === TRENDS SECTION === */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Performance & Confidence Trends
        </h3>
        <Suspense fallback={<SkeletonLoader />}>
          <ChartCard
            title="Fraud and Confidence Evolution"
            subtitle="Visual analysis of fraud trends and verification reliability over time"
          >
            <FraudTrendsChart
              data={fraudTrends}
              colorScheme={['#06b6d4', '#a855f7', '#22c55e']}
            />
          </ChartCard>
        </Suspense>
      </section>

      {/* === DISTRIBUTIONS SECTION === */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-400" />
          Document & Risk Insights
        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Risk Category - switched from U shape to donut/pie layout */}
          <Suspense fallback={<SkeletonLoader />}>
            <ChartCard title="Risk Category Segmentation" subtitle="Low / Medium / High risk distribution">
              <RiskCategoriesChart
                data={stats}
                colorPalette={  ['#22c55e', '#facc15', '#ef4444']}
                chartType="donut" // instruct chart to render donut instead of U-bar
              />
            </ChartCard>
          </Suspense>

          <Suspense fallback={<SkeletonLoader />}>
            <ChartCard title="Document Status Overview" subtitle="Pending, Verified, and Rejected docs">
              <DocumentStatusChart
                data={stats}
                colorPalette={['#38bdf8', '#10b981', '#f43f5e']}
              />
            </ChartCard>
          </Suspense>

          <Suspense fallback={<SkeletonLoader />}>
            <ChartCard title="Document Type Breakdown" subtitle="Types of IDs processed by AI engine">
              <DocumentTypesChart
                data={stats}
                colorPalette={['#818cf8', '#06b6d4', '#f59e0b']}
              />
            </ChartCard>
          </Suspense>
        </div>
      </section>

      {/* === FRAUD PATTERNS SECTION === */}
      {fraudPatterns.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Detected Fraud Anomalies
          </h3>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/60 max-h-[420px] overflow-y-auto">
            <div className="space-y-4">
              {fraudPatterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(239,68,68,0.5)' }}
                  className="p-4 bg-gray-800/60 rounded-xl flex items-start gap-4 border border-transparent transition-all"
                >
                  <div className="p-2 bg-red-500/10 rounded-full mt-1">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{pattern.name}</p>
                    <p className="text-sm text-gray-400">{pattern.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default AnalyticsDashboard;
