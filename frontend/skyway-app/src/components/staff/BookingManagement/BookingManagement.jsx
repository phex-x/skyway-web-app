import React, { useState, useEffect } from 'react';
import staffService from '../../../services/StaffService';
import styles from './BookingManagement.module.css';

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
            const bookingsList = Array.isArray(data) ? data : (data?.content || []);
            setBookings(bookingsList);
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
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            return `${day}.${month}.${year}`;
        }
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Управление бронированиями</div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Код бронирования</th>
                        <th className={styles.th}>Рейс</th>
                        <th className={styles.th}>Пользователь</th>
                        <th className={styles.th}>Дата бронирования</th>
                        <th className={styles.th}>Статус</th>
                        <th className={styles.th}>Класс</th>
                        <th className={styles.th}>Пассажиры</th>
                        <th className={styles.th}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan="9" className={`${styles.td} ${styles.empty}`}>
                                Нет бронирований
                            </td>
                        </tr>
                    ) : (
                        bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className={styles.td}>{booking.id}</td>
                                <td className={styles.td}>{booking.bookingReference}</td>
                                <td className={styles.td}>
                                    {booking.flight?.flightNumber || 'N/A'}
                                    <br />
                                    <small>
                                        {booking.flight?.departureAirport?.iataCode ||
                                            booking.flight?.departureAirport?.city ||
                                            booking.flight?.departureAirport?.name ||
                                            'N/A'} →{' '}
                                        {booking.flight?.arrivalAirport?.iataCode ||
                                            booking.flight?.arrivalAirport?.city ||
                                            booking.flight?.arrivalAirport?.name ||
                                            'N/A'}
                                    </small>
                                </td>
                                <td className={styles.td}>
                                    {booking.user?.firstName || ''} {booking.user?.lastName || ''}
                                    {booking.user?.firstName || booking.user?.lastName ? (
                                        <>
                                            <br />
                                            <small>{booking.user?.email || 'N/A'}</small>
                                        </>
                                    ) : (
                                        <span className={styles.userError}>Данные не загружены</span>
                                    )}
                                </td>
                                <td className={styles.td}>{formatDate(booking.bookingDate)}</td>
                                <td className={styles.td}>
                    <span
                        className={`${styles.status} ${
                            booking.status === 'CONFIRMED'
                                ? styles.statusConfirmed
                                : styles.statusCanceled
                        }`}
                    >
                      {booking.status === 'CONFIRMED'
                          ? 'Подтверждено'
                          : booking.status === 'CANCELED'
                              ? 'Отменено'
                              : booking.status}
                    </span>
                                </td>
                                <td className={styles.td}>
                                    {booking.seatClass === 'ECONOMY'
                                        ? 'Эконом'
                                        : booking.seatClass === 'BUSINESS'
                                            ? 'Бизнес'
                                            : booking.seatClass}
                                </td>
                                <td className={styles.td}>
                                    {booking.passengers?.length || 0} пассажир(ов)
                                    {booking.passengers?.length > 0 && (
                                        <div className={styles.passengers}>
                                            {booking.passengers.map((p, idx) => (
                                                <div key={p.id || `${booking.id}-${idx}`}>
                                                    {p.firstName} {p.lastName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.buttonGroup}>
                                        {booking.status === 'CONFIRMED' && (
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => handleCancel(booking.id)}
                                            >
                                                Отменить
                                            </button>
                                        )}
                                        <button
                                            className={styles.deleteButton}
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
