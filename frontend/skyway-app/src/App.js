import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import FlightSearchPage from './pages/FlightSearchPage';
import BookingPage from './pages/BookingPage';
import ManageBookingPage from './pages/ManageBookingPage';
import ProfilePage from './pages/ProfilePage';
import BookingSearchPage from './pages/BookingSearchPage';
import StaffPanelPage from './pages/StaffPanelPage';
import AdminPanelPage from './pages/AdminPanelPage';
import DestinationsPage from './pages/DestinationsPage';
import AboutPage from './pages/AboutPage';

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking-search" element={<BookingSearchPage />} />
        <Route path="/flights" element={<FlightSearchPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/manage-booking" element={<ManageBookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/staff-panel" element={<StaffPanelPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
