import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheckIcon} from "@heroicons/react/24/solid"; // 👈 Import shield icon
import { Shield } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-md">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-8 w-8 text-cyan-400" /> {/* 👈 Shield logo */}
          <h1 className="text-2xl font-extrabold tracking-wide text-cyan-300 ">
            KYC Shield
          </h1>
        </div>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-600 text-black hover:bg-blue-700 text-black rounded-lg shadow-md transition duration-300"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Secure, Reliable & Fast <br />
          <span className="text-cyan-500">KYC Verification</span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          KYC Shield helps organizations verify customer identities quickly and
          securely using advanced AI-powered document and face verification.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-600 text-black text-lg font-semibold rounded-lg shadow-lg transition duration-300"
        >
          Start Your Journey
        </button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-8 py-16 max-w-6xl mx-auto">
        <div className="p-6 bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">
            🔒 Security First
          </h3>
          <p className="text-gray-300">
            Enterprise-grade encryption ensures all customer data is protected
            at every step.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">
            ⚡ Fast Verification
          </h3>
          <p className="text-gray-300">
            AI-powered document speeds up the verification
            process within seconds.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">
            🌍 Scalable Solution
          </h3>
          <p className="text-gray-300">
            Built to handle millions of verifications with global compliance
            support.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} KYC Shield. All Rights Reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
