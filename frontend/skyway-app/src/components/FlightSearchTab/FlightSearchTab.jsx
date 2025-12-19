import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CityAutocomplete from '../CityAutocomplete/CityAutocomplete';
import { cities } from '../../utils/cities';
import styles from './FlightSearchTab.module.css';

const FlightSearchTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Загружаем сохраненные данные из localStorage или из location.state
  const loadSavedData = () => {
    const saved = localStorage.getItem('flightSearchData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const savedData = loadSavedData();
  const stateData = location.state;

  const [departure, setDeparture] = useState(stateData?.departure || savedData?.departure || '');
  const [arrival, setArrival] = useState(stateData?.arrival || savedData?.arrival || '');
  const [tripType, setTripType] = useState(stateData?.tripType || savedData?.tripType || 'one-way');
  const [departureDate, setDepartureDate] = useState(stateData?.departureDate || savedData?.departureDate || '');
  const [returnDate, setReturnDate] = useState(stateData?.returnDate || savedData?.returnDate || '');
  const [seatClass, setSeatClass] = useState(stateData?.seatClass || savedData?.seatClass || 'ECONOMY');
  const [passengerCount, setPassengerCount] = useState(stateData?.passengerCount || savedData?.passengerCount || 1);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    const searchData = {
      departure,
      arrival,
      tripType,
      departureDate,
      returnDate,
      seatClass,
      passengerCount
    };
    localStorage.setItem('flightSearchData', JSON.stringify(searchData));
  }, [departure, arrival, tripType, departureDate, returnDate, seatClass, passengerCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация городов
    if (!departure || !arrival || !departureDate) {
      alert('Заполните все обязательные поля');
      return;
    }
    
    // departure и arrival уже содержат только названия городов (благодаря CityAutocomplete)
    // Но проверяем, что они валидны
    const departureCity = cities.find(c => c.city === departure);
    const arrivalCity = cities.find(c => c.city === arrival);
    
    if (!departureCity) {
      alert('Выберите город вылета из списка');
      return;
    }
    
    if (!arrivalCity) {
      alert('Выберите город прибытия из списка');
      return;
    }
    
    if (departureCity.city === arrivalCity.city) {
      alert('Город вылета и город прибытия не могут совпадать');
      return;
    }
    
    if (tripType === 'round-trip' && !returnDate) {
      alert('Укажите дату возврата');
      return;
    }
    
    // Отправляем только название города
    navigate('/flights', {
      state: {
        departure: departure, // Уже только название города
        arrival: arrival, // Уже только название города
        tripType,
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : null,
        seatClass,
        passengerCount
      }
    });
  };


  // Получаем минимальную дату (сегодня)
  const today = new Date().toISOString().split('T')[0];
  
  // Получаем максимальную дату для даты возврата (не раньше даты вылета)
  const getMinReturnDate = () => {
    if (departureDate) {
      return departureDate;
    }
    return today;
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.radioContainer}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={(e) => setTripType(e.target.value)}
              className={styles.radioInput}
            />
            В одну сторону
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={(e) => setTripType(e.target.value)}
              className={styles.radioInput}
            />
            Туда-обратно
          </label>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <CityAutocomplete
          value={departure}
          onChange={setDeparture}
          placeholder="Начните вводить город вылета"
          label="Город вылета"
          required={true}
        />
      </div>
      <div className={styles.inputGroup}>
        <CityAutocomplete
          value={arrival}
          onChange={setArrival}
          placeholder="Начните вводить город прибытия"
          label="Город прибытия"
          required={true}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Дата вылета</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className={styles.input}
          min={today}
          required
        />
      </div>
      {tripType === 'round-trip' && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Дата возврата</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className={styles.input}
            min={getMinReturnDate()}
            required
          />
        </div>
      )}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Класс места</label>
        <select
          value={seatClass}
          onChange={(e) => setSeatClass(e.target.value)}
          className={styles.select}
        >
          <option value="ECONOMY">Эконом</option>
          <option value="BUSINESS">Бизнес</option>
        </select>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Количество пассажиров</label>
        <input
          type="number"
          min="1"
          max="9"
          value={passengerCount}
          onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.searchButton}>
        Поиск
      </button>
    </form>
  );
};

export default FlightSearchTab;

