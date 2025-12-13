import React, { useState } from 'react';

const FlightSearchTab = () => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement flight search
    console.log('Search flights:', { departure, arrival });
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
    searchButton: {
      padding: '12px 30px',
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
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Аэропорт вылета</label>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="Аэропорт вылета"
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Аэропорт прибытия</label>
        <input
          type="text"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          placeholder="Аэропорт прибытия"
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.searchButton}>
        Поиск
      </button>
    </form>
  );
};

export default FlightSearchTab;

