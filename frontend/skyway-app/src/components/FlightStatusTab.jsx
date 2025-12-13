import React, { useState } from 'react';

const FlightStatusTab = () => {
  const [flightNumber, setFlightNumber] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const handleCheckStatus = (e) => {
    e.preventDefault();
    // TODO: Implement flight status check
    console.log('Check flight status:', { flightNumber });
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
    dateDisplay: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '48px'
    },
    dateLabel: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '4px'
    },
    dateValue: {
      fontSize: '14px',
      color: '#000'
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
      whiteSpace: 'nowrap',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '48px'
    },
    buttonText: {
      lineHeight: '1.2'
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Номер рейса</label>
        <input
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="Номер рейса"
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Дата</label>
        <div style={styles.dateDisplay}>
          <div style={styles.dateLabel}>Дата</div>
          <div style={styles.dateValue}>{getTodayDate()}</div>
        </div>
      </div>
      <button onClick={handleCheckStatus} style={styles.button}>
        <span style={styles.buttonText}>Проверить</span>
        <span style={styles.buttonText}>статус</span>
      </button>
    </div>
  );
};

export default FlightStatusTab;

