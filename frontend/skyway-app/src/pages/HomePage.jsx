import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome to Skyway App</h1>
      
      {isAuthenticated && user ? (
        <div>
          <p>Hello, {user.firstName} {user.lastName}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <nav>
            <Link to="/register">Register</Link> | 
            <Link to="/login">Login</Link>
          </nav>
          <p>Please register or login to continue.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
