// frontend/src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader,
  FileText,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "../utils/adminService";

const AdminPanel = ({ adminQueue = [], loading, onRefreshQueue }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAction = async (recordId, action) => {
    setActionLoading(true);
    try {
      await adminService.updateRecordStatus(recordId, action);
      setNotification(
        `Record ${action === "approve" ? "approved" : "rejected"} successfully.`
      );
      onRefreshQueue && onRefreshQueue();
      setSelectedRecord(null);
    } catch (err) {
      setNotification(`Failed to ${action} record: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3"
      >
        <ShieldAlert className="text-blue-400 h-8 w-8" />
        <h2 className="text-3xl font-bold text-white">Fraud Review Dashboard</h2>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center bg-blue-900/40 border border-blue-700 text-blue-300 py-2 rounded-lg shadow-md"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin h-8 w-8 text-blue-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminQueue.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8 bg-gray-800/30 rounded-xl border border-gray-700">
              No pending records for review.
            </div>
          ) : (
            adminQueue.map((record, idx) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 
                rounded-2xl p-5 shadow-lg hover:border-blue-500 transition-all duration-300"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-gray-100 text-lg">
                        {record.document_type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{record.filename}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          record.status === "pending"
                            ? "text-yellow-400"
                            : record.status === "approved"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="flex-1 bg-blue-600/80 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                    onClick={() =>
                      setSelectedRecord(
                        selectedRecord?._id === record._id ? null : record
                      )
                    }
                  >
                    <Eye className="h-4 w-4" /> View
                  </button>
                  <button
                    className="flex-1 bg-green-600/80 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                    onClick={() => handleAction(record._id, "approve")}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    className="flex-1 bg-red-600/80 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                    onClick={() => handleAction(record._id, "reject")}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>

                {/* Expanded Section */}
                <AnimatePresence>
                  {selectedRecord && selectedRecord._id === record._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-3 bg-gray-900/70 border border-gray-700/60 rounded-xl p-4 space-y-4"
                    >
                      {/* Extracted Fields */}
                      <div>
                        <h4 className="font-semibold text-gray-100 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-400" />
                          Extracted Fields
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-sm">
                          {Object.entries(record.extracted_fields).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fraud Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-100 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Fraud Analysis
                        </h4>
                        <div className="space-y-1 text-gray-300 text-sm">
                          <div>
                            <strong>Fraud Score:</strong>{" "}
                            <span className="text-white">{record.fraud_score}%</span>
                          </div>
                          <div>
                            <strong>Risk Category:</strong>{" "}
                            <span className="text-white">{record.risk_category}</span>
                          </div>
                          {record.risk_factors?.length > 0 && (
                            <div>
                              <strong>Factors:</strong>{" "}
                              {record.risk_factors.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
