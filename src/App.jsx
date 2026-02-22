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
import './App.css';

function App() {
  return (
    <NutritionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-messages" element={<DoctorMessages />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/diet-analysis" element={<DietAnalysis />} />
          <Route path="/fitness" element={<FitnessTracker />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/food-management" element={<AdminFoodManagement />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Routes>
      </Router>
    </NutritionProvider>
  );
}

export default App;
