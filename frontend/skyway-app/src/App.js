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
