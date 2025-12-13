// src/components/staff/AirportManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/StaffService';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    iataCode: '',
    icaoCode: '',
    name: '',
    country: '',
    city: '',
    latitude: '',
    longtitude: ''
  });

  useEffect(() => {
    loadAirports();
  }, []);

  const loadAirports = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllAirports();
      console.log('AirportManagement: Loaded airports:', data);
      setAirports(data);
    } catch (err) {
      console.error('AirportManagement: Error loading airports:', err);
      setError(err.message || 'Ошибка при загрузке аэропортов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация данных
    if (!formData.iataCode || !formData.icaoCode || !formData.name || !formData.city || !formData.country) {
      alert('Заполните все обязательные поля');
      return;
    }
    
    try {
      const airportData = {
        iataCode: formData.iataCode,
        icaoCode: formData.icaoCode,
        name: formData.name,
        country: formData.country,
        city: formData.city,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longtitude: formData.longtitude ? parseFloat(formData.longtitude) : null,
        timezone: null // Можно добавить поле для timezone если нужно
      };
      
      console.log('Submitting airport data:', airportData);
      await staffService.createAirport(airportData);
      setShowForm(false);
      setFormData({
        iataCode: '',
        icaoCode: '',
        name: '',
        country: '',
        city: '',
        latitude: '',
        longtitude: ''
      });
      loadAirports();
      alert('Аэропорт успешно создан');
    } catch (err) {
      console.error('Error creating airport:', err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот аэропорт?')) {
      return;
    }
    try {
      await staffService.deleteAirport(id);
      loadAirports();
      alert('Аэропорт успешно удален');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const styles = {
    container: {
      width: '100%'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#000'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    form: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    formRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '15px'
    },
    formGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px'
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    cancelButton: {
      padding: '10px 20px',
      backgroundColor: '#666',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff'
    },
    th: {
      backgroundColor: '#004758',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px'
    },
    deleteButton: {
      padding: '5px 15px',
      backgroundColor: '#d32f2f',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#666'
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Управление аэропортами</div>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить аэропорт'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>IATA код *</label>
              <input
                type="text"
                value={formData.iataCode}
                onChange={(e) => setFormData({ ...formData, iataCode: e.target.value })}
                style={styles.input}
                required
                maxLength={3}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ICAO код *</label>
              <input
                type="text"
                value={formData.icaoCode}
                onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value })}
                style={styles.input}
                required
                maxLength={4}
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Название *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Город *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Страна *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Широта</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Долгота</label>
              <input
                type="number"
                step="any"
                value={formData.longtitude}
                onChange={(e) => setFormData({ ...formData, longtitude: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>Сохранить</button>
            <button type="button" style={styles.cancelButton} onClick={() => setShowForm(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>IATA</th>
            <th style={styles.th}>ICAO</th>
            <th style={styles.th}>Название</th>
            <th style={styles.th}>Город</th>
            <th style={styles.th}>Страна</th>
            <th style={styles.th}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {airports.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#666' }}>
                Нет аэропортов
              </td>
            </tr>
          ) : (
            airports.map((airport) => (
              <tr key={airport.id}>
                <td style={styles.td}>{airport.id || 'N/A'}</td>
                <td style={styles.td}>{airport.iataCode || '(пусто)'}</td>
                <td style={styles.td}>{airport.icaoCode || '(пусто)'}</td>
                <td style={styles.td}>{airport.name || '(пусто)'}</td>
                <td style={styles.td}>{airport.city || '(пусто)'}</td>
                <td style={styles.td}>{airport.country || '(пусто)'}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(airport.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AirportManagement;

