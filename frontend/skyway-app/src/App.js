import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Home</Link>
      {!isAuthenticated && (
        <>
          <Link to="/register" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Register</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</Link>
        </>
      )}
    </nav>
  );
};

const AppContent = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
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
