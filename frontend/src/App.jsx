import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './utils/auth';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import LandingPage from './components/LandingPage'; // 👈 import landing page

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
          <p className="mb-4">Please try refreshing the page or contact support if the issue persists.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected route component
const ProtectedRoute = ({ children, role }) => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getStoredUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Main App component
function App() {
    return (
        <ErrorBoundary>
            <Routes>
                {/* 👇 Landing page will show by default */}
                <Route path="/" element={<LandingPage />} />  

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ErrorBoundary>
    );
}

export default App;
