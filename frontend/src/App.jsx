import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NutritionProvider } from './context/NutritionContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorMessages from './pages/DoctorMessages';
import UserDashboard from './pages/UserDashboard';
import DietAnalysis from './pages/DietAnalysis';
import FitnessTracker from './pages/FitnessTracker';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import AdminFoodManagement from './pages/AdminFoodManagement';
import AdminUsers from './pages/AdminUsers';
import AdminMessages from './pages/AdminMessages';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <NutritionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute roles={['user', 'admin']}><Profile /></ProtectedRoute>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor-messages" element={<ProtectedRoute roles={['doctor']}><DoctorMessages /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/diet-analysis" element={<ProtectedRoute roles={['user', 'admin']}><DietAnalysis /></ProtectedRoute>} />
          <Route path="/fitness" element={<ProtectedRoute roles={['user', 'admin']}><FitnessTracker /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute roles={['user', 'admin']}><Messages /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/food-management" element={<ProtectedRoute roles={['admin']}><AdminFoodManagement /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute roles={['admin']}><AdminMessages /></ProtectedRoute>} />
        </Routes>
      </Router>
    </NutritionProvider>
  );
}

export default App;
