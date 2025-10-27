AI-KYC Fraud Detection
AI-Powered Identity Verification & Fraud Detection for KYC Compliance

🧭 Project Overview
This project aims to build a robust, end-to-end KYC / identity verification system using AI and data-driven techniques. It will:

Accept user documents (e.g. Aadhaar, utility bills)
Extract identity information using OCR
Detect fraud / tampering / duplicates
Provide a scoring & alert system for compliance officers
Use cases:

Banking onboarding
Financial services
Identity verification for regulatory compliance
📋 Milestones & Features
🚀 Milestone 1: OCR & Data Extraction
Collect synthetic Aadhaar/utility bill docs (15–20).
OCR using Pytesseract / EasyOCR.
Extract key fields: Name, Aadhaar, Address.
Clean & normalize → store in JSON/CSV.
Frontend: Upload UI, validations, OCR results preview.
Backend: REST APIs for upload, OCR, user docs storage.
🚀 Milestone 2: Fraud Detection & Verification
Fake Aadhaar/PAN detection (regex, mock DB check).
Duplicate detection via DB + hashing.
AI-powered name matching (FuzzyWuzzy/spaCy).
Document tampering check (heuristics / CNN planned).
Fraud risk scoring (Low/Medium/High).
Frontend: Verification dashboard, fraud score charts.
Backend: APIs → /verify-doc, /fraud-score.
🚀 Milestone 3: Real-Time Pipeline & AML Compliance
Wrap models (OCR/NLP/CNN/GNN) into APIs.
Real-time fraud alert pipeline (async queue).
Compliance rules + alert logging.
Frontend: Compliance officer dashboard (Verified/Flagged/Pending).
Backend: Endpoints for fraud check, AML alerts, logs.
🚀 Milestone 4: Deployment & Final Delivery
Integrate all milestones → full stack app.
CNN/GNN for fraud detection.
AML integration.
Deploy via Docker / Cloud.
Final dashboards + reports.
🛠️ Tech Stack
Frontend: React.js, TailwindCSS, Recharts/Chart.js
Backend: Node.js (Express), Tesseract.js, Python (OCR/ML services)
Database: MongoDB (flexible for document data)
AI/ML: Pytesseract, EasyOCR, FuzzyWuzzy, spaCy, scikit-learn, CNN/GNN
Infra: Kafka/RabbitMQ (for streaming alerts), Docker
