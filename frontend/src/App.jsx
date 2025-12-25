import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Tasks from './pages/Tasks';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdvisorStudentView from './pages/AdvisorStudentView';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/resources" element={
          <PrivateRoute>
            <Resources />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
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

        <Route path="/advisor/student/:id" element={
          <PrivateRoute>
            <AdvisorStudentView />
          </PrivateRoute>
        } />

        <Route path="/academic" element={
          <PrivateRoute>
            {/* Academic Tracker was missing from App.jsx view in previous turn, adding it explicitly if needed or it was just not shown? 
                 Ah, looking at file view step 449, /academic route was NOT present in App.jsx. 
                 It WAS in Navbar links. This explains why it might not load. Adding it now. 
             */}
            <React.Suspense fallback={<div>Loading...</div>}>
              <AcademicWrapper />
            </React.Suspense>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Lazy load to avoid circular deps if any, or just direct import
import AcademicTracker from './pages/AcademicTracker';
const AcademicWrapper = () => <AcademicTracker />;

export default App;
