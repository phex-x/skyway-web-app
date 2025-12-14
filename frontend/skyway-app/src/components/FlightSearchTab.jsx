import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CityAutocomplete from './CityAutocomplete';
import { cities } from '../utils/cities';

const FlightSearchTab = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [seatClass, setSeatClass] = useState('ECONOMY');
  const [passengerCount, setPassengerCount] = useState(1);

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

  const styles = {
    formContainer: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end'
    },
    inputGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    },
    searchButton: {
      padding: '12px 30px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <div style={{ ...styles.inputGroup, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={(e) => setTripType(e.target.value)}
              style={{ marginRight: '5px' }}
            />
            В одну сторону
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={(e) => setTripType(e.target.value)}
              style={{ marginRight: '5px' }}
            />
            Туда-обратно
          </label>
        </div>
      </div>
      <div style={styles.inputGroup}>
        <CityAutocomplete
          value={departure}
          onChange={setDeparture}
          placeholder="Начните вводить город вылета"
          label="Город вылета"
          required={true}
        />
      </div>
      <div style={styles.inputGroup}>
        <CityAutocomplete
          value={arrival}
          onChange={setArrival}
          placeholder="Начните вводить город прибытия"
          label="Город прибытия"
          required={true}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Дата вылета</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      {tripType === 'round-trip' && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>Дата возврата</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            style={styles.input}
            required
          />
        </div>
      )}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Класс места</label>
        <select
          value={seatClass}
          onChange={(e) => setSeatClass(e.target.value)}
          style={styles.input}
        >
          <option value="ECONOMY">Эконом</option>
          <option value="BUSINESS">Бизнес</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Количество пассажиров</label>
        <input
          type="number"
          min="1"
          max="9"
          value={passengerCount}
          onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
          style={styles.input}
          required
        />
      </div>
      <button type="submit" style={styles.searchButton}>
        Поиск
      </button>
    </form>
  );
};

export default FlightSearchTab;

