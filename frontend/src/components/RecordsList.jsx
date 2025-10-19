// FILE: frontend/src/components/RecordsList.jsx
import React from 'react';
import { Clock, FileText, Eye, Trash2, Database } from 'lucide-react';
import { recordsService } from '../utils/recordsService';

const RecordsList = ({ records, StatusBadgeComponent, onViewRecord, addNotification, fetchDashboardData }) => {
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
    try {
      await recordsService.deleteRecord(recordId);
      fetchDashboardData(); // Refresh stats and records list
      addNotification('Record deleted successfully', 'success');
    } catch (err) {
      addNotification(`Failed to delete record: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-cyan-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Document Records</h2>
            <p className="text-cyan-200 text-sm">All processed documents with AI analysis results</p>
          </div>
        </div>
      </div>

      {/* Records List */}
      {records && records.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-gray-800/50 backdrop-blur-xl border border-cyan-900/60 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col sm:flex-row justify-between gap-4"
            >
              {/* Left Section: Icon + Document Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-100 capitalize">{record.document_type} Document</h3>
                  <p className="text-sm text-gray-400 truncate max-w-[250px]" title={record.filename}>
                    {record.filename}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-300">Uploaded:</span>{' '}
                      <span className="text-gray-400">{new Date(record.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Fraud Score:</span>{' '}
                      <span className="text-gray-400">{record.fraud_score != null ? `${record.fraud_score}%` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Risk Category:</span>{' '}
                      <span className="text-gray-400 capitalize">{record.risk_category || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300">Verified Name:</span>{' '}
                      <span className="text-gray-400">{record.verified_name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Status & Actions */}
              <div className="flex flex-col sm:items-end justify-between gap-2 mt-4 sm:mt-0">
                <StatusBadgeComponent status={record.status} />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onViewRecord(record)}
                    className="flex items-center justify-center px-4 py-2 bg-cyan-800 hover:bg-cyan-600 text-white rounded-xl font-semibold transition"
                  >
                    <Eye className="h-4 w-4 mr-2" /> View
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record._id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-800 hover:bg-red-800 text-white rounded-xl font-semibold transition"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 p-8">No records found. Upload a document to get started.</div>
      )}
    </div>
  );
};

export default RecordsList;
