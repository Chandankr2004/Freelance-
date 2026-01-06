import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import AnimatedRoute from './components/AnimatedRoute';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Public pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Jobs from './pages/Jobs/Jobs';
import JobDetail from './pages/Jobs/JobDetail';
import Freelancers from './pages/Freelancers/Freelancers';
import FreelancerProfile from './pages/Freelancers/FreelancerProfile';

// Protected pages
import BuyerDashboard from './pages/Dashboard/BuyerDashboard';
import FreelancerDashboard from './pages/Dashboard/FreelancerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PostJob from './pages/Jobs/PostJob';
import MyBids from './pages/Bids/MyBids';
import Contracts from './pages/Contracts/Contracts';
import ContractDetail from './pages/Contracts/ContractDetail';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import Transactions from './pages/Payments/Transactions';
import Support from './pages/Support/Support';

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="App">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
            <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
            <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />
            <Route path="/jobs" element={<AnimatedRoute><Jobs /></AnimatedRoute>} />
            <Route path="/jobs/:id" element={<AnimatedRoute><JobDetail /></AnimatedRoute>} />
            <Route path="/freelancers" element={<AnimatedRoute><Freelancers /></AnimatedRoute>} />
            <Route path="/freelancers/:userId" element={<AnimatedRoute><FreelancerProfile /></AnimatedRoute>} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <BuyerDashboard />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/freelancer-dashboard"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <FreelancerDashboard />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute requiredRole="admin">
                  <AnimatedRoute>
                    <AdminDashboard />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <PrivateRoute requiredRole="buyer">
                  <AnimatedRoute>
                    <PostJob />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bids"
              element={
                <PrivateRoute requiredRole="freelancer">
                  <AnimatedRoute>
                    <MyBids />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Contracts />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts/:id"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <ContractDetail />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Messages />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Profile />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Transactions />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <AnimatedRoute>
                    <Support />
                  </AnimatedRoute>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
