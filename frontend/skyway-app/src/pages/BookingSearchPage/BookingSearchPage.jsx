// src/pages/BookingSearchPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearchTab from '../../components/FlightSearchTab/FlightSearchTab';

const BookingSearchPage = () => {
  const navigate = useNavigate();

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '20px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>
        
        <div style={styles.title}>Поиск и бронирование рейсов</div>
        
        <FlightSearchTab />
      </div>
    </div>
  );
};

export default BookingSearchPage;

