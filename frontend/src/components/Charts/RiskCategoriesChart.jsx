// FILE: frontend/src/components/Charts/RiskCategoriesChart.jsx
// CHANGELOG: Redesigned as a Gradient Risk Meter (stacked horizontal bar with percentage and labels)

import React, { useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertTriangle } from "lucide-react";

// --- CHART CONFIGURATION ---
const CHART_CONFIG = [
  { name: "Low Risk", dataKey: "low_risk_count", color: "#10b981" }, // Green
  { name: "Medium Risk", dataKey: "medium_risk_count", color: "#f59e0b" }, // Amber
  { name: "High Risk", dataKey: "high_risk_count", color: "#ef4444" }, // Red
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0];
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-3 border border-gray-600 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-white mb-1" style={{ color: fill }}>
          {name}
        </p>
        <p className="text-gray-300">
          Count: <span className="font-semibold text-white">{value}</span>
        </p>
      </div>
    );
  }
  return null;
});

// --- MAIN COMPONENT ---
const RiskCategoriesChart = ({ data }) => {
  const chartData = useMemo(() => {
    const total =
      (data?.low_risk_count || 0) +
      (data?.medium_risk_count || 0) +
      (data?.high_risk_count || 0);

    return [
      {
        name: "Risk Levels",
        Low: data?.low_risk_count || 0,
        Medium: data?.medium_risk_count || 0,
        High: data?.high_risk_count || 0,
        total,
      },
    ];
  }, [data]);

  const totalDocuments = chartData[0]?.total || 0;

  if (totalDocuments === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-600" />
          <p className="font-semibold">No Risk Data Available</p>
          <p className="text-xs">Risk levels will be shown here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="text-center mb-2">
        <h2 className="text-gray-200 font-semibold text-lg">Risk Distribution</h2>
        <p className="text-sm text-gray-400">
          Total Documents: <span className="font-semibold">{totalDocuments}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Low" stackId="a" fill="#10b981" radius={[10, 0, 0, 10]} />
          <Bar dataKey="Medium" stackId="a" fill="#f59e0b" />
          <Bar dataKey="High" stackId="a" fill="#ef4444" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-between mt-3 text-sm text-gray-300">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full" /> Low Risk (
          {chartData[0].Low})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500 rounded-full" /> Medium Risk (
          {chartData[0].Medium})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full" /> High Risk (
          {chartData[0].High})
        </span>
      </div>
    </div>
  );
};

export default memo(RiskCategoriesChart);
// FILE: frontend/src/components/AnalyticsDashboard.jsx