// src/components/staff/BookingManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../services/StaffService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }
    try {
      await staffService.cancelBooking(id);
      loadBookings();
      alert('Бронирование отменено');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это бронирование? Это действие необратимо.')) {
      return;
    }
    try {
      await staffService.deleteBooking(id);
      loadBookings();
      alert('Бронирование удалено');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
      }
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
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
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    statusConfirmed: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusCanceled: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    buttonGroup: {
      display: 'flex',
      gap: '5px'
    },
    cancelButton: {
      padding: '5px 10px',
      backgroundColor: '#ff9800',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
    },
    deleteButton: {
      padding: '5px 10px',
      backgroundColor: '#d32f2f',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px'
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
        <div style={styles.title}>Управление бронированиями</div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Код бронирования</th>
              <th style={styles.th}>Рейс</th>
              <th style={styles.th}>Пользователь</th>
              <th style={styles.th}>Дата бронирования</th>
              <th style={styles.th}>Статус</th>
              <th style={styles.th}>Класс</th>
              <th style={styles.th}>Пассажиры</th>
              <th style={styles.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ ...styles.td, textAlign: 'center', color: '#666' }}>
                  Нет бронирований
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={styles.td}>{booking.id}</td>
                  <td style={styles.td}>{booking.bookingReference}</td>
                  <td style={styles.td}>
                    {booking.flight?.flightNumber || 'N/A'}
                    <br />
                    <small>
                      {booking.flight?.departureAirport?.iataCode || 'N/A'} → {booking.flight?.arrivalAirport?.iataCode || 'N/A'}
                    </small>
                  </td>
                  <td style={styles.td}>
                    {booking.user?.firstName} {booking.user?.lastName}
                    <br />
                    <small>{booking.user?.email}</small>
                  </td>
                  <td style={styles.td}>{formatDate(booking.bookingDate)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.status,
                      ...(booking.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCanceled)
                    }}>
                      {booking.status === 'CONFIRMED' ? 'Подтверждено' : 
                       booking.status === 'CANCELED' ? 'Отменено' : booking.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {booking.seatClass === 'ECONOMY' ? 'Эконом' : 
                     booking.seatClass === 'BUSINESS' ? 'Бизнес' : booking.seatClass}
                  </td>
                  <td style={styles.td}>
                    {booking.passengers?.length || 0} пассажир(ов)
                  </td>
                  <td style={styles.td}>
                    <div style={styles.buttonGroup}>
                      {booking.status === 'CONFIRMED' && (
                        <button
                          style={styles.cancelButton}
                          onClick={() => handleCancel(booking.id)}
                        >
                          Отменить
                        </button>
                      )}
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(booking.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;

