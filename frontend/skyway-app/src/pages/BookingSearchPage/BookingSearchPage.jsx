import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearchTab from '../../components/FlightSearchTab/FlightSearchTab';
import styles from './BookingSearchPage.module.css';

const BookingSearchPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>
        
        <div className={styles.title}>Поиск и бронирование рейсов</div>
        
        <FlightSearchTab />
      </div>
    </div>
  );
};

export default BookingSearchPage;

