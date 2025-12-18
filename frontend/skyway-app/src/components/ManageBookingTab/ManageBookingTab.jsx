import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageBookingTab = () => {
  const navigate = useNavigate();
  const [lastName, setLastName] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  const handleManageBooking = (e) => {
    e.preventDefault();
    if (!lastName || !bookingCode) {
      alert('Заполните все поля');
      return;
    }
    navigate('/manage-booking', {
      state: {
        lastName,
        bookingCode
      }
    });
  };

  const styles = {
    formContainer: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end'
    },
    inputGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    },
    button: {
      padding: '12px 20px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Фамилия</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Фамилия"
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Код бронирования</label>
        <input
          type="text"
          value={bookingCode}
          onChange={(e) => setBookingCode(e.target.value)}
          placeholder="Код бронирования"
          style={styles.input}
        />
      </div>
      <button onClick={handleManageBooking} style={styles.button}>
        Управление бронированием
      </button>
    </div>
  );
};

export default ManageBookingTab;

