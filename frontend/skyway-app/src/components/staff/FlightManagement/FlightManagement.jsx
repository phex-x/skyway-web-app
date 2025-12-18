// src/components/staff/FlightManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../../services/StaffService';

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    flightNumber: '',
    airplaneId: '',
    departureAirportId: '',
    arrivalAirportId: '',
    scheduledDeparture: '',
    scheduledArrival: '',
    economySeatPrice: 0,
    businessSeatPrice: 0,
    remainingEconomySeats: 0,
    remainingBusinessSeats: 0
  });

  useEffect(() => {
    loadData();
    loadFlights(); // Загружаем рейсы при первом рендере
  }, []);

  useEffect(() => {
    loadFlights();
  }, [currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [airplanesData, airportsData] = await Promise.all([
        staffService.getAllAirplanes(0, 1000), // Загружаем все для выпадающих списков
        staffService.getAllAirports(0, 1000)
      ]);
      setAirplanes(Array.isArray(airplanesData) ? airplanesData : (airplanesData?.content || []));
      setAirports(Array.isArray(airportsData) ? airportsData : (airportsData?.content || []));
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const loadFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await staffService.getAllFlights(currentPage, pageSize);
      console.log('FlightManagement: Loaded flights data:', flightsData);
      console.log('FlightManagement: Data type:', typeof flightsData);
      console.log('FlightManagement: Has content?', flightsData && 'content' in flightsData);
      console.log('FlightManagement: totalPages:', flightsData?.totalPages);
      console.log('FlightManagement: totalElements:', flightsData?.totalElements);
      
      // Если это Page объект, извлекаем content
      if (flightsData && typeof flightsData === 'object') {
        if ('content' in flightsData) {
          // Это Page объект от Spring
          const content = Array.isArray(flightsData.content) ? flightsData.content : [];
          setFlights(content);
          setTotalPages(flightsData.totalPages ?? 0);
          setTotalElements(flightsData.totalElements ?? 0);
          console.log('FlightManagement: Set flights:', content.length, 'totalPages:', flightsData.totalPages, 'totalElements:', flightsData.totalElements);
        } else if (Array.isArray(flightsData)) {
          // Если это массив напрямую (старый формат)
          setFlights(flightsData);
          setTotalPages(1);
          setTotalElements(flightsData.length || 0);
        } else {
          // Если данные в другом формате
          console.warn('FlightManagement: Unexpected data format:', flightsData);
          setFlights([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } else {
        console.warn('FlightManagement: Invalid data:', flightsData);
        setFlights([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('FlightManagement: Error loading flights:', err);
      setError(err.message || 'Ошибка при загрузке рейсов');
      setFlights([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const airplane = airplanes.find(a => a.id === parseInt(formData.airplaneId));
      const departureAirport = airports.find(a => a.id === parseInt(formData.departureAirportId));
      const arrivalAirport = airports.find(a => a.id === parseInt(formData.arrivalAirportId));

      if (!airplane || !departureAirport || !arrivalAirport) {
        alert('Выберите все необходимые поля');
        return;
      }

      // Форматируем дату для Java LocalDateTime (формат: YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return null;
        // Если уже в правильном формате, возвращаем как есть
        if (dateTimeString.includes('T')) {
          return dateTimeString;
        }
        return dateTimeString;
      };

      const flightData = {
        flightNumber: formData.flightNumber,
        airplane: airplane,
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        scheduledDeparture: formatDateTime(formData.scheduledDeparture),
        scheduledArrival: formatDateTime(formData.scheduledArrival),
        economySeatPrice: parseFloat(formData.economySeatPrice),
        businessSeatPrice: parseFloat(formData.businessSeatPrice),
        remainingEconomySeats: parseInt(formData.remainingEconomySeats),
        remainingBusinessSeats: parseInt(formData.remainingBusinessSeats)
      };

      await staffService.createFlight(flightData);
      setShowForm(false);
      setFormData({
        flightNumber: '',
        airplaneId: '',
        departureAirportId: '',
        arrivalAirportId: '',
        scheduledDeparture: '',
        scheduledArrival: '',
        economySeatPrice: 0,
        businessSeatPrice: 0,
        remainingEconomySeats: 0,
        remainingBusinessSeats: 0
      });
      loadFlights();
      alert('Рейс успешно создан');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот рейс? Если у рейса есть бронирования, удаление будет невозможно.')) {
      return;
    }
    try {
      await staffService.deleteFlight(id);
      // Удаляем рейс из локального состояния, чтобы сразу обновить таблицу
      setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== id));
      setTotalElements((prevTotal) => (prevTotal > 0 ? prevTotal - 1 : 0));
      alert('Рейс успешно удален');
    } catch (err) {
      console.error('FlightManagement: Error deleting flight:', err);
      alert(`Ошибка при удалении рейса: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('ru-RU');
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
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
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
      backgroundColor: '#fff',
      fontSize: '12px'
    },
    th: {
      backgroundColor: '#004758',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '12px'
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
        <div style={styles.title}>Управление рейсами</div>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить рейс'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Номер рейса *</label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Самолет *</label>
              <select
                value={formData.airplaneId}
                onChange={(e) => setFormData({ ...formData, airplaneId: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Выберите самолет</option>
                {airplanes.map(airplane => (
                  <option key={airplane.id} value={airplane.id}>
                    {airplane.model} ({airplane.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Аэропорт вылета *</label>
              <select
                value={formData.departureAirportId}
                onChange={(e) => setFormData({ ...formData, departureAirportId: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Выберите аэропорт</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.id}>
                    {airport.name} ({airport.iataCode})
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Аэропорт прибытия *</label>
              <select
                value={formData.arrivalAirportId}
                onChange={(e) => setFormData({ ...formData, arrivalAirportId: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Выберите аэропорт</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.id}>
                    {airport.name} ({airport.iataCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Время вылета *</label>
              <input
                type="datetime-local"
                value={formData.scheduledDeparture}
                onChange={(e) => setFormData({ ...formData, scheduledDeparture: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Время прибытия *</label>
              <input
                type="datetime-local"
                value={formData.scheduledArrival}
                onChange={(e) => setFormData({ ...formData, scheduledArrival: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Цена эконом *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.economySeatPrice}
                onChange={(e) => setFormData({ ...formData, economySeatPrice: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Цена бизнес *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.businessSeatPrice}
                onChange={(e) => setFormData({ ...formData, businessSeatPrice: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Свободные места эконом *</label>
              <input
                type="number"
                min="0"
                value={formData.remainingEconomySeats}
                onChange={(e) => setFormData({ ...formData, remainingEconomySeats: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Свободные места бизнес *</label>
              <input
                type="number"
                min="0"
                value={formData.remainingBusinessSeats}
                onChange={(e) => setFormData({ ...formData, remainingBusinessSeats: e.target.value })}
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

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Номер</th>
              <th style={styles.th}>Вылет</th>
              <th style={styles.th}>Прибытие</th>
              <th style={styles.th}>Время вылета</th>
              <th style={styles.th}>Время прибытия</th>
              <th style={styles.th}>Цена эконом</th>
              <th style={styles.th}>Цена бизнес</th>
              <th style={styles.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ ...styles.td, textAlign: 'center', color: '#666' }}>
                  Нет рейсов
                </td>
              </tr>
            ) : (
              flights.map((flight) => (
                <tr key={flight.id}>
                  <td style={styles.td}>{flight.id}</td>
                  <td style={styles.td}>{flight.flightNumber}</td>
                  <td style={styles.td}>
                    {flight.departureAirport?.name || 'N/A'} ({flight.departureAirport?.iataCode || 'N/A'})
                  </td>
                  <td style={styles.td}>
                    {flight.arrivalAirport?.name || 'N/A'} ({flight.arrivalAirport?.iataCode || 'N/A'})
                  </td>
                  <td style={styles.td}>{formatDateTime(flight.scheduledDeparture)}</td>
                  <td style={styles.td}>{formatDateTime(flight.scheduledArrival)}</td>
                  <td style={styles.td}>{flight.economySeatPrice?.toFixed(2) || '0.00'}</td>
                  <td style={styles.td}>{flight.businessSeatPrice?.toFixed(2) || '0.00'}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(flight.id)}
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
              fontWeight: 'bold',
              opacity: currentPage === 0 ? 0.6 : 1
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
            Страница {currentPage + 1} из {totalPages || 1} ({totalElements} рейсов)
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

export default FlightManagement;

