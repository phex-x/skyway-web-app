// src/pages/ManageBookingPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/BookingService';
import styles from './ManageBookingPage.module.css';

const ManageBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastName, setLastName] = useState(location.state?.lastName || '');
  const [bookingCode, setBookingCode] = useState(location.state?.bookingCode || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const bookingData = await bookingService.searchBooking(bookingCode, lastName);
      setBooking(bookingData);
    } catch (err) {
      console.error('Search booking error:', err);
      setError(err.message || 'Бронирование не найдено');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async () => {
    if (!booking || booking.status !== 'CONFIRMED') return;
    
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }
    
    try {
      await bookingService.cancelBooking(booking.id);
      // Обновляем статус локально, чтобы сразу отобразить результат
      setBooking({ ...booking, status: 'CANCELED' });
      alert('Бронирование успешно отменено');
    } catch (error) {
      console.error('Cancel booking error:', error);
      if (error.message && error.message.includes('401')) {
        alert('Для отмены бронирования необходимо войти в личный кабинет.');
      } else {
        alert(`Ошибка при отмене бронирования: ${error.message || 'Неизвестная ошибка'}`);
      }
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>

        <div className={styles.title}>Управление бронированием</div>

        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Фамилия</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Код бронирования</label>
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Поиск...' : 'Управление бронированием'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {loading && <div className={styles.loading}>Поиск бронирования...</div>}

        {booking && (
          <div className={styles.bookingInfo}>
            <h3>Информация о бронировании</h3>
            <p><strong>Код бронирования:</strong> {booking.bookingReference || booking.id}</p>
            <p><strong>Статус:</strong> {
              booking.status === 'CONFIRMED' ? 'Подтверждено' : 
              booking.status === 'CANCELED' ? 'Отменено' : 
              booking.status
            }</p>
            {booking.flight && (
              <>
                <p><strong>Рейс:</strong> {booking.flight.flightNumber}</p>
                <p><strong>Маршрут:</strong> {
                  booking.flight.departureAirport?.city || booking.flight.departureAirport?.name
                } → {
                  booking.flight.arrivalAirport?.city || booking.flight.arrivalAirport?.name
                }</p>
                <p><strong>Дата вылета:</strong> {
                  booking.flight.scheduledDeparture ? 
                  new Date(booking.flight.scheduledDeparture).toLocaleString('ru-RU') : 
                  'N/A'
                }</p>
                <p><strong>Дата прибытия:</strong> {
                  booking.flight.scheduledArrival ? 
                  new Date(booking.flight.scheduledArrival).toLocaleString('ru-RU') : 
                  'N/A'
                }</p>
                <p><strong>Класс места:</strong> {
                  booking.seatClass === 'ECONOMY' ? 'Эконом' : 
                  booking.seatClass === 'BUSINESS' ? 'Бизнес' : 
                  booking.seatClass
                }</p>
              </>
            )}
            {booking.passengers && booking.passengers.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Пассажиры:</strong>
                {booking.passengers.map((p, idx) => (
                  <div key={idx} className={styles.passengerItem}>
                    {p.firstName} {p.lastName}
                    {p.email && ` (${p.email})`}
                  </div>
                ))}
              </div>
            )}
            {booking.status === 'CONFIRMED' &&
             booking.flight &&
             new Date(booking.flight.scheduledDeparture) > new Date() && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancelBooking}
              >
                Отменить бронирование
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingPage;

