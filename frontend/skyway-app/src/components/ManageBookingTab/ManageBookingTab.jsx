import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ManageBookingTab.module.css';

const ManageBookingTab = () => {
    const navigate = useNavigate();
    const [lastName, setLastName] = useState('');
    const [bookingCode, setBookingCode] = useState('');

    const handleManageBooking = (e) => {
        e.preventDefault();
        if (!lastName || !bookingCode) {
            alert('Заполните все поля');
            return;
        }
        navigate('/manage-booking', {
            state: {
                lastName,
                bookingCode
            }
        });
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Фамилия</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Фамилия"
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Код бронирования</label>
                <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder="Код бронирования"
                    className={styles.input}
                />
            </div>

            <button
                onClick={handleManageBooking}
                className={styles.button}
            >
                Управление бронированием
            </button>
        </div>
    );
};

export default ManageBookingTab;
