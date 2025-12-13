// src/pages/AdminPanelPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    header: {
      backgroundColor: '#004758',
      color: '#fff',
      padding: '20px 30px',
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
    userInfo: {
      fontSize: '14px'
    },
    content: {
      padding: '30px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Панель управления администратора</div>
            <div style={styles.userInfo}>
              {user?.firstName} {user?.lastName} ({user?.email})
            </div>
          </div>
          <button style={styles.backButton} onClick={() => navigate('/')}>
            На главную
          </button>
        </div>

        <div style={styles.content}>
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;

