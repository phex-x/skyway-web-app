import React, { useState } from 'react';
import styles from './FlightStatusTab.module.css';

const FlightStatusTab = () => {
  const [flightNumber, setFlightNumber] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const handleCheckStatus = (e) => {
    e.preventDefault();
    // TODO: Implement flight status check
    console.log('Check flight status:', { flightNumber });
  };


  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Номер рейса</label>
        <input
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="Номер рейса"
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Дата</label>
        <div className={styles.dateDisplay}>
          <div className={styles.dateLabel}>Дата</div>
          <div className={styles.dateValue}>{getTodayDate()}</div>
        </div>
      </div>
      <button onClick={handleCheckStatus} className={styles.button}>
        <span className={styles.buttonText}>Проверить</span>
        <span className={styles.buttonText}>статус</span>
      </button>
    </div>
  );
};

export default FlightStatusTab;

