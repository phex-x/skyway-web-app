// src/pages/StaffPanelPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import AirplaneManagement from '../../components/staff/AIrplaneManagement/AirplaneManagement';
import AirportManagement from '../../components/staff/AirportManagement/AirportManagement';
import FlightManagement from '../../components/staff/FlightManagement/FlightManagement';
import BookingManagement from '../../components/staff/BookingManagement/BookingManagement';
import styles from './StaffPanelPage.module.css';

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


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Панель управления персонала</div>
            <div className={styles.userInfo}>
              {user?.firstName} {user?.lastName} ({user?.email})
            </div>
          </div>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            На главную
          </button>
        </div>

        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === 'airplanes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('airplanes')}
          >
            Самолеты
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'airports' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('airports')}
          >
            Аэропорты
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'flights' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('flights')}
          >
            Рейсы
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Бронирования
          </div>
        </div>

        <div className={styles.content}>
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

