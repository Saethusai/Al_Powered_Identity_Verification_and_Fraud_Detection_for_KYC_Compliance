import React, { useState, useMemo, useCallback, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../utils/auth";
import OTPVerification from "./OTPVerification";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, UserPlus, Shield, Loader } from "lucide-react";

// --- CUSTOM HOOK FOR SIGNUP LOGIC ---
const useSignup = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const result = await authService.signup(formData.name, formData.email, formData.password);
      if (result.success) {
        onSuccess(formData.email);
      } else {
        setStatus({ loading: false, error: result.error || "Signup failed." });
      }
    } catch (err) {
      setStatus({ loading: false, error: "An unexpected error occurred." });
    }
  }, [formData, onSuccess]);

  return { ...formData, ...status, handleChange, handleSubmit };
};

// --- PASSWORD STRENGTH BAR ---
const PasswordStrengthIndicator = memo(({ password }) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Weak', 'Medium', 'Medium', 'Strong'];
  const textColors = ['text-red-500', 'text-yellow-500', 'text-yellow-600', 'text-green-600'];

  return (
    <div className="mt-2">
      <div className="flex h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className={`flex-1 ${idx < strength ? colors[strength-1] : 'bg-gray-600'}`} />
        ))}
      </div>
      {strength > 0 && <span className={`text-sm font-semibold mt-1 block ${textColors[strength-1]}`}>{labels[strength-1]}</span>}
    </div>
  );
});

// --- MAIN SIGNUP COMPONENT ---
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [flowState, setFlowState] = useState({ step: 'signup', email: '' });
  const [showWelcomeCard, setShowWelcomeCard] = useState(true); // Controls welcome card visibility

  const { name, email, password, loading, error, handleChange, handleSubmit } = useSignup({
    onSuccess: (submittedEmail) => {
      setShowWelcomeCard(false); // Hide welcome card
      setFlowState({ step: 'otp', email: submittedEmail });
    }
  });

  const formVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 50 } };
  const otpVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className={`w-full max-w-4xl grid gap-8 z-10 ${showWelcomeCard ? 'md:grid-cols-2' : 'grid-cols-1 justify-items-center'}`}>
        
        {/* Left Info Panel: Show only on Signup */}
        {showWelcomeCard && (
          <motion.div
            className="hidden md:flex flex-col justify-center bg-gradient-to-br from-cyan-700 via-cyan-900 to-blue-900 rounded-2xl p-10 text-white shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Shield className="h-14 w-14 mb-6" />
            <h2 className="text-4xl font-bold mb-2">Welcome to AI-KYC</h2>
            <p className="text-cyan-200/80">Secure and streamlined KYC verification with AI-powered fraud detection. Create an account to get started.</p>
          </motion.div>
        )}

        {/* Right Form Panel */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-8">
          <AnimatePresence mode="wait">
            {flowState.step === 'signup' ? (
              <motion.div key="signup" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
                  <p className="text-cyan-200/80">Join the AI-KYC Platform</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 text-red-300 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-blue-200">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name" name="name" type="text" required value={name} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-200">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email" name="email" type="email" required value={email} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-blue-200">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={handleChange}
                        className="w-full pl-11 pr-12 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 via-cyan-600 to-cyan-700 text-black disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="animate-spin h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    {loading ? 'Signing Up...' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-blue-200">
                  Already have an account? <Link to="/login" className="text-blue-300 hover:underline font-medium">Sign In</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp" variants={otpVariants} initial="hidden" animate="visible" exit="exit">
                <OTPVerification email={flowState.email} onBack={() => setFlowState({ step: 'signup', email: '' })} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
