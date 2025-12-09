import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Tasks from './pages/Tasks';
import AdvisorDashboard from './pages/AdvisorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/mood" element={
          <PrivateRoute>
            <MoodTracker />
          </PrivateRoute>
        } />

        <Route path="/journal" element={
          <PrivateRoute>
            <Journal />
          </PrivateRoute>
        } />

        <Route path="/tasks" element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        } />

        <Route path="/advisor" element={
          <PrivateRoute>
            <AdvisorDashboard />
          </PrivateRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
