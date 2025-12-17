// src/pages/AdminPanelPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import AdminStatistics from '../components/admin/Statistics';
import adminService from '../services/AdminService';

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statisticsError, setStatisticsError] = useState('');

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
    tabsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      borderBottom: '1px solid #ddd'
    },
    tabButton: {
      padding: '10px 16px',
      border: 'none',
      borderBottom: '3px solid transparent',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#555'
    },
    tabButtonActive: {
      borderBottomColor: '#004758',
      color: '#004758'
    },
    statsError: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    statsLoading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666'
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

  const loadStatistics = async () => {
    try {
      setStatisticsLoading(true);
      setStatisticsError('');
      const data = await adminService.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('AdminPanelPage: error loading statistics', err);
      setStatisticsError(err.message || 'Ошибка при загрузке статистики');
    } finally {
      setStatisticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats' && statistics === null && !statisticsLoading) {
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
          <div style={styles.tabsContainer}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === 'users' ? styles.tabButtonActive : {})
              }}
              onClick={() => setActiveTab('users')}
            >
              Пользователи
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === 'stats' ? styles.tabButtonActive : {})
              }}
              onClick={() => setActiveTab('stats')}
            >
              Статистика
            </button>
          </div>

          {activeTab === 'users' && <UserManagement />}

          {activeTab === 'stats' && (
            <>
              {statisticsError && <div style={styles.statsError}>{statisticsError}</div>}
              {statisticsLoading && !statistics && (
                <div style={styles.statsLoading}>Загрузка статистики...</div>
              )}
              {!statisticsLoading && statistics && <AdminStatistics statistics={statistics} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;

