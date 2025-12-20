import React, { useState, useEffect } from 'react';
import staffService from '../../../services/StaffService';
import styles from './FlightManagement.module.css';

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

      if (flightsData && typeof flightsData === 'object') {
        if ('content' in flightsData) {
          const content = Array.isArray(flightsData.content) ? flightsData.content : [];
          setFlights(content);
          setTotalPages(flightsData.totalPages ?? 0);
          setTotalElements(flightsData.totalElements ?? 0);
          console.log('FlightManagement: Set flights:', content.length, 'totalPages:', flightsData.totalPages, 'totalElements:', flightsData.totalElements);
        } else if (Array.isArray(flightsData)) {
          setFlights(flightsData);
          setTotalPages(1);
          setTotalElements(flightsData.length || 0);
        } else {
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


  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Управление рейсами</div>
        <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить рейс'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Номер рейса *</label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Самолет *</label>
              <select
                value={formData.airplaneId}
                onChange={(e) => setFormData({ ...formData, airplaneId: e.target.value })}
                className={styles.select}
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
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Аэропорт вылета *</label>
              <select
                value={formData.departureAirportId}
                onChange={(e) => setFormData({ ...formData, departureAirportId: e.target.value })}
                className={styles.select}
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
            <div className={styles.formGroup}>
              <label className={styles.label}>Аэропорт прибытия *</label>
              <select
                value={formData.arrivalAirportId}
                onChange={(e) => setFormData({ ...formData, arrivalAirportId: e.target.value })}
                className={styles.select}
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
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Время вылета *</label>
              <input
                type="datetime-local"
                value={formData.scheduledDeparture}
                onChange={(e) => setFormData({ ...formData, scheduledDeparture: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Время прибытия *</label>
              <input
                type="datetime-local"
                value={formData.scheduledArrival}
                onChange={(e) => setFormData({ ...formData, scheduledArrival: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Цена эконом *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.economySeatPrice}
                onChange={(e) => setFormData({ ...formData, economySeatPrice: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Цена бизнес *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.businessSeatPrice}
                onChange={(e) => setFormData({ ...formData, businessSeatPrice: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Свободные места эконом *</label>
              <input
                type="number"
                min="0"
                value={formData.remainingEconomySeats}
                onChange={(e) => setFormData({ ...formData, remainingEconomySeats: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Свободные места бизнес *</label>
              <input
                type="number"
                min="0"
                value={formData.remainingBusinessSeats}
                onChange={(e) => setFormData({ ...formData, remainingBusinessSeats: e.target.value })}
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Номер</th>
              <th className={styles.th}>Вылет</th>
              <th className={styles.th}>Прибытие</th>
              <th className={styles.th}>Время вылета</th>
              <th className={styles.th}>Время прибытия</th>
              <th className={styles.th}>Цена эконом</th>
              <th className={styles.th}>Цена бизнес</th>
              <th className={styles.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr>
                <td colSpan="9" className={`${styles.td} ${styles.emptyCell}`}>
                  Нет рейсов
                </td>
              </tr>
            ) : (
              flights.map((flight) => (
                <tr key={flight.id}>
                  <td className={styles.td}>{flight.id}</td>
                  <td className={styles.td}>{flight.flightNumber}</td>
                  <td className={styles.td}>
                    {flight.departureAirport?.name || 'N/A'} ({flight.departureAirport?.iataCode || 'N/A'})
                  </td>
                  <td className={styles.td}>
                    {flight.arrivalAirport?.name || 'N/A'} ({flight.arrivalAirport?.iataCode || 'N/A'})
                  </td>
                  <td className={styles.td}>{formatDateTime(flight.scheduledDeparture)}</td>
                  <td className={styles.td}>{formatDateTime(flight.scheduledArrival)}</td>
                  <td className={styles.td}>{flight.economySeatPrice?.toFixed(2) || '0.00'}</td>
                  <td className={styles.td}>{flight.businessSeatPrice?.toFixed(2) || '0.00'}</td>
                  <td className={styles.td}>
                    <button
                      className={styles.deleteButton}
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
            Страница {currentPage + 1} из {totalPages || 1} ({totalElements} рейсов)
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

export default FlightManagement;

