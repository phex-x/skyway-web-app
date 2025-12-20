import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import FlightSearchPage from './pages/FlightSearchPage/FlightSearchPage';
import BookingPage from './pages/BookingPage/BookingPage';
import ManageBookingPage from './pages/ManageBookingPage/ManageBookingPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import BookingSearchPage from './pages/BookingSearchPage/BookingSearchPage';
import StaffPanelPage from './pages/StaffPanel/StaffPanelPage';
import AdminPanelPage from './pages/AdminPanelPage/AdminPanelPage';
import DestinationsPage from './pages/DestinationPage/DestinationsPage';
import AboutPage from './pages/AboutPage/AboutPage';

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
