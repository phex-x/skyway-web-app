// src/components/staff/AirplaneManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/StaffService';

const AirplaneManagement = () => {
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    model: '',
    registrationNumber: '',
    economySeatsAmount: 0,
    businessSeatsAmount: 0
  });

  useEffect(() => {
    loadAirplanes();
  }, [currentPage]);

  const loadAirplanes = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllAirplanes(currentPage, pageSize);
      console.log('AirplaneManagement: Loaded airplanes:', data);
      console.log('AirplaneManagement: totalPages:', data?.totalPages, 'totalElements:', data?.totalElements);
      
      // Если это Page объект, извлекаем content
      if (data && typeof data === 'object') {
        if ('content' in data) {
          // Это Page объект от Spring
          const content = Array.isArray(data.content) ? data.content : [];
          setAirplanes(content);
          setTotalPages(data.totalPages ?? 0);
          setTotalElements(data.totalElements ?? 0);
        } else if (Array.isArray(data)) {
          // Если это массив напрямую (старый формат)
          setAirplanes(data);
          setTotalPages(1);
          setTotalElements(data.length || 0);
        } else {
          console.warn('AirplaneManagement: Unexpected data format:', data);
          setAirplanes([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } else {
        console.warn('AirplaneManagement: Invalid data:', data);
        setAirplanes([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('AirplaneManagement: Error loading airplanes:', err);
      setError(err.message || 'Ошибка при загрузке самолетов');
      setAirplanes([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация данных
    if (!formData.model || !formData.registrationNumber) {
      alert('Заполните все обязательные поля');
      return;
    }
    
    if (formData.economySeatsAmount < 0 || formData.businessSeatsAmount < 0) {
      alert('Количество мест не может быть отрицательным');
      return;
    }
    
    try {
      console.log('Submitting airplane data:', formData);
      await staffService.createAirplane(formData);
      setShowForm(false);
      setFormData({
        model: '',
        registrationNumber: '',
        economySeatsAmount: 0,
        businessSeatsAmount: 0
      });
      loadAirplanes();
      alert('Самолет успешно добавлен');
    } catch (err) {
      console.error('Error creating airplane:', err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот самолет?')) {
      return;
    }
    try {
      await staffService.deleteAirplane(id);
      loadAirplanes();
      alert('Самолет успешно удален');
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
        <div style={styles.title}>Управление самолетами</div>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить самолет'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Модель *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Регистрационный номер *</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Количество мест эконом *</label>
              <input
                type="number"
                min="0"
                value={formData.economySeatsAmount}
                onChange={(e) => setFormData({ ...formData, economySeatsAmount: parseInt(e.target.value) || 0 })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Количество мест бизнес *</label>
              <input
                type="number"
                min="0"
                value={formData.businessSeatsAmount}
                onChange={(e) => setFormData({ ...formData, businessSeatsAmount: parseInt(e.target.value) || 0 })}
                style={styles.input}
                required
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
            <th style={styles.th}>Модель</th>
            <th style={styles.th}>Регистрационный номер</th>
            <th style={styles.th}>Места эконом</th>
            <th style={styles.th}>Места бизнес</th>
            <th style={styles.th}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {airplanes.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#666' }}>
                Нет самолетов
              </td>
            </tr>
          ) : (
            airplanes.map((airplane) => (
              <tr key={airplane.id}>
                <td style={styles.td}>{airplane.id || 'N/A'}</td>
                <td style={styles.td}>{airplane.model || '(пусто)'}</td>
                <td style={styles.td}>{airplane.registrationNumber || '(пусто)'}</td>
                <td style={styles.td}>{airplane.economySeatsAmount ?? '(пусто)'}</td>
                <td style={styles.td}>{airplane.businessSeatsAmount ?? '(пусто)'}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(airplane.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Пагинация - показываем всегда, если есть данные */}
      {totalElements > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 0 ? '#ccc' : '#004758',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage === 0}
          >
            ← Назад
          </button>
          
          <div style={{ padding: '8px 16px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
            Страница {currentPage + 1} из {totalPages || 1} ({totalElements} самолетов)
          </div>
          
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: (totalPages === 0 || currentPage >= totalPages - 1) ? '#ccc' : '#004758',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: (totalPages === 0 || currentPage >= totalPages - 1) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: (totalPages === 0 || currentPage >= totalPages - 1) ? 0.6 : 1
            }}
            onClick={() => {
              if (totalPages > 0 && currentPage < totalPages - 1) {
                setCurrentPage(currentPage + 1);
              }
            }}
            disabled={totalPages === 0 || currentPage >= totalPages - 1}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  );
};

export default AirplaneManagement;

