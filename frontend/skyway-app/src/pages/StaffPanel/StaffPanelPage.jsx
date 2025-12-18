// src/pages/StaffPanelPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import AirplaneManagement from '../../components/staff/AIrplaneManagement/AirplaneManagement';
import AirportManagement from '../../components/staff/AirportManagement/AirportManagement';
import FlightManagement from '../../components/staff/FlightManagement/FlightManagement';
import BookingManagement from '../../components/staff/BookingManagement/BookingManagement';

const StaffPanelPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('airplanes');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'STAFF') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'STAFF') {
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
    tabs: {
      display: 'flex',
      borderBottom: '2px solid #e0e0e0',
      backgroundColor: '#f5f5f5'
    },
    tab: {
      padding: '15px 30px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      color: '#666',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s'
    },
    activeTab: {
      color: '#004758',
      borderBottomColor: '#004758',
      backgroundColor: '#fff'
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
            <div style={styles.title}>Панель управления персонала</div>
            <div style={styles.userInfo}>
              {user?.firstName} {user?.lastName} ({user?.email})
            </div>
          </div>
          <button style={styles.backButton} onClick={() => navigate('/')}>
            На главную
          </button>
        </div>

        <div style={styles.tabs}>
          <div
            style={{ ...styles.tab, ...(activeTab === 'airplanes' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('airplanes')}
          >
            Самолеты
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'airports' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('airports')}
          >
            Аэропорты
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'flights' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('flights')}
          >
            Рейсы
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'bookings' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('bookings')}
          >
            Бронирования
          </div>
        </div>

        <div style={styles.content}>
          {activeTab === 'airplanes' && <AirplaneManagement />}
          {activeTab === 'airports' && <AirportManagement />}
          {activeTab === 'flights' && <FlightManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
        </div>
      </div>
    </div>
  );
};

export default StaffPanelPage;

