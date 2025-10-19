// CHANGELOG: Rearranged UI structure with cards and grouped sections, keeping colors and logic intact
import React, { useEffect } from 'react';
import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, Shield, UserCheck, Send, Loader, CheckCircle ,Info } from 'lucide-react';
import { ocrService } from '../utils/ocrService';

// --- REUSABLE SUB-COMPONENTS ---

const FileDropzone = memo(({ selectedFile, onFileChange, onFileRemove, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative p-6 border-2 border-dashed rounded-xl transition-colors duration-300
        ${error ? 'border-red-500/50' : 'border-gray-600/80'}
        ${isDragging ? 'bg-blue-500/20 border-blue-400' : 'bg-gray-900/40'}`
      }
    >
      <input
        type="file"
        id="file-upload"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={onFileChange}
        className="absolute w-0 h-0 opacity-0"
      />
      {selectedFile ? (
        <div className="text-center">
          <FileText className="h-12 w-12 text-blue-400 mx-auto mb-2" />
          <p className="font-semibold text-white truncate">{selectedFile.name}</p>
          <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          <button
            onClick={onFileRemove}
            className="mt-4 text-sm text-red-400 hover:text-red-300 font-semibold flex items-center justify-center gap-1 mx-auto"
          >
            <X className="h-4 w-4" /> Remove File
          </button>
        </div>
      ) : (
        <label htmlFor="file-upload" className="text-center cursor-pointer flex flex-col items-center">
          <UploadCloud className={`h-12 w-12 mb-2 transition-transform duration-300 ${isDragging ? 'scale-110 text-blue-300' : 'text-gray-500'}`} />
          <p className="font-semibold text-white">Click to browse or drag & drop</p>
          <p className="text-sm text-gray-400">PDF, PNG, JPG (max 5MB)</p>
        </label>
      )}
    </div>
  );
});

const FeatureListItem = memo(({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-gray-700/50 rounded-lg mt-1"><Icon className="h-5 w-5 text-cyan-300" /></div>
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
));

// --- MAIN COMPONENT ---

const DocumentUpload = ({ onUploadSuccess, addNotification }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('aadhaar');
  const [userEnteredName, setUserEnteredName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size cannot exceed 5MB.');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) { setError('Please select a file to upload.'); return; }
    if (!userEnteredName.trim()) { setError('Please enter your full name for verification.'); return; }

    setUploading(true);
    setError('');

    try {
      setUploadStep(1);
      setTimeout(() => setUploadStep(2), 700);
      setTimeout(() => setUploadStep(3), 1500);

      const result = await ocrService.extractDocument({
        file: selectedFile,
        documentType,
        userEnteredName: userEnteredName.trim(),
      });

      setUploadStep(4);
      if (result.success && result.extraction_result) {
        onUploadSuccess(result.extraction_result);
      } else {
        throw new Error(result.error || 'Document processing failed.');
      }
    } catch (err) {
      setError(err.message);
      addNotification(`Upload failed: ${err.message}`, 'error');
      setUploading(false);
      setUploadStep(0);
    }
  }, [selectedFile, documentType, userEnteredName, onUploadSuccess, addNotification]);

  const uploadSteps = ["", "Uploading...", "AI Processing...", "Finalizing...", "Done!"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

      {/* Left Column: User Info + Upload */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="col-span-2 bg-gray-800/50 p-6 rounded-xl border border-cyan-900 space-y-6">

        <h2 className="text-2xl font-bold text-white text-center">Upload Your Document</h2>

        {/* Two-column Form inside card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Document Type</label>
            <select value={documentType} onChange={e => setDocumentType(e.target.value)} className="w-full bg-gray-700/80 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option value="aadhaar">Aadhaar Card</option>
              <option value="pan">PAN Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" value={userEnteredName} onChange={e => setUserEnteredName(e.target.value)}
              placeholder="Enter name as on document"
              className="w-full bg-gray-700/80 border border-gray-600 rounded-lg px-3 py-2 text-white" />
          </div>
        </div>

        <FileDropzone selectedFile={selectedFile} onFileChange={handleFileChange} onFileRemove={() => setSelectedFile(null)} error={!!error} />

        <AnimatePresence>
          {error && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
        </AnimatePresence>

        <button onClick={handleSubmit} disabled={uploading}
          className="w-full py-3 px-4 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {uploading ? <Loader className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
          {uploading ? uploadSteps[uploadStep] : 'Submit for Verification'}
        </button>
      </motion.div>

      {/* Right Column: Upload Tips */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gray-800/20 p-6 rounded-xl border border-dashed border-cyan-900 space-y-6"
>
  <div className="flex items-center gap-3">
    <Info className="h-6 w-6 text-blue-500" />
    <h3 className="text-xl font-bold text-white">Document Upload Tips</h3>
  </div>

  <div className="space-y-4">
    <FeatureListItem
      icon={UploadCloud}
      title="Supported Formats"
      description="Only PDF, PNG, and JPG files are accepted. Ensure your file is clear and readable."
    />
    <FeatureListItem
      icon={FileText}
      title="File Size"
      description="Keep your file under 5MB to avoid upload errors and faster processing."
    />
    <FeatureListItem
      icon={Shield}
      title="Ensure Accuracy"
      description="Make sure your name matches exactly with the document for successful verification."
    />
    <FeatureListItem
      icon={CheckCircle}
      title="Stable Connection"
      description="A stable internet connection ensures your document uploads smoothly without interruption."
    />
  </div>
</motion.div>


    </div>
  );
};

export default DocumentUpload;
