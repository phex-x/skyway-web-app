// src/components/staff/AirplaneManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../../services/StaffService';
import styles from './AirplaneManagement.module.css';

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


  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Управление самолетами</div>
        <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить самолет'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Модель *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Регистрационный номер *</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Количество мест эконом *</label>
              <input
                type="number"
                min="0"
                value={formData.economySeatsAmount}
                onChange={(e) => setFormData({ ...formData, economySeatsAmount: parseInt(e.target.value) || 0 })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Количество мест бизнес *</label>
              <input
                type="number"
                min="0"
                value={formData.businessSeatsAmount}
                onChange={(e) => setFormData({ ...formData, businessSeatsAmount: parseInt(e.target.value) || 0 })}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Сохранить</button>
            <button type="button" className={styles.cancelButton} onClick={() => setShowForm(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Модель</th>
            <th className={styles.th}>Регистрационный номер</th>
            <th className={styles.th}>Места эконом</th>
            <th className={styles.th}>Места бизнес</th>
            <th className={styles.th}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {airplanes.length === 0 ? (
            <tr>
              <td colSpan="6" className={`${styles.td} ${styles.emptyCell}`}>
                Нет самолетов
              </td>
            </tr>
          ) : (
            airplanes.map((airplane) => (
              <tr key={airplane.id}>
                <td className={styles.td}>{airplane.id || 'N/A'}</td>
                <td className={styles.td}>{airplane.model || '(пусто)'}</td>
                <td className={styles.td}>{airplane.registrationNumber || '(пусто)'}</td>
                <td className={styles.td}>{airplane.economySeatsAmount ?? '(пусто)'}</td>
                <td className={styles.td}>{airplane.businessSeatsAmount ?? '(пусто)'}</td>
                <td className={styles.td}>
                  <button
                    className={styles.deleteButton}
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
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationButton} ${currentPage === 0 ? styles.paginationButtonDisabled : ''}`}
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage === 0}
          >
            ← Назад
          </button>
          
          <div className={styles.paginationInfo}>
            Страница {currentPage + 1} из {totalPages || 1} ({totalElements} самолетов)
          </div>
          
          <button
            className={`${styles.paginationButton} ${(totalPages === 0 || currentPage >= totalPages - 1) ? styles.paginationButtonDisabled : ''}`}
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

