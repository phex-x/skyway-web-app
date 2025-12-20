import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import bookingService from '../../services/BookingService';
import passengerService from '../../services/PassengerService';
import styles from './BookingPage.module.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [existingPassengers, setExistingPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const loadPassengers = async () => {
      if (isAuthenticated && bookingData) {
        try {
          setLoading(true);
          const savedPassengers = await passengerService.getAllPassengers();
          setExistingPassengers(savedPassengers);

          if (savedPassengers && savedPassengers.length > 0) {
            const formattedPassengers = savedPassengers.map(p => ({
              id: p.id,
              firstName: p.firstName,
              lastName: p.lastName,
              passportNumber: p.passportNumber || '',
              citizenship: p.citizenship || '',
              birthday: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
              gender: p.gender || 'MALE',
              isExisting: true
            }));
            setPassengers(formattedPassengers);
            setSelectedPassengers(formattedPassengers.map(p => p.id));
          } else {
            setPassengers([{
              id: 'new-passenger-1',
              firstName: '',
              lastName: '',
              passportNumber: '',
              citizenship: '',
              birthday: '',
              gender: 'MALE',
              isExisting: false
            }]);
            setSelectedPassengers(['new-passenger-1']);
          }
        } catch (error) {
          console.error('Error loading passengers:', error);
          setPassengers([{
            id: 'new-passenger-1',
            firstName: '',
            lastName: '',
            passportNumber: '',
            citizenship: '',
            birthday: '',
            gender: 'MALE',
            isExisting: false
          }]);
          setSelectedPassengers(['new-passenger-1']);
        } finally {
          setLoading(false);
        }
      } else if (bookingData && !isAuthenticated) {
        setPassengers([{
          id: 'new-passenger-1',
          firstName: '',
          lastName: '',
          passportNumber: '',
          citizenship: '',
          birthday: '',
          gender: 'MALE',
          isExisting: false
        }]);
        setSelectedPassengers(['new-passenger-1']);
      }
    };

    loadPassengers();
  }, [isAuthenticated, bookingData]);

  const handleAddPassenger = () => {
    const newPassenger = {
      id: `new-passenger-${Date.now()}`,
      firstName: '',
      lastName: '',
      passportNumber: '',
      citizenship: '',
      birthday: '',
      gender: 'MALE',
      isExisting: false
    };
    setPassengers([...passengers, newPassenger]);
    setSelectedPassengers([...selectedPassengers, newPassenger.id]);
  };

  const handlePassengerChange = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleTogglePassenger = (id) => {
    if (selectedPassengers.includes(id)) {
      setSelectedPassengers(selectedPassengers.filter(p => p !== id));
    } else {
      setSelectedPassengers([...selectedPassengers, id]);
    }
  };

  const handleRemovePassenger = (id) => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger?.isExisting) {
      setSelectedPassengers(selectedPassengers.filter(p => p !== id));
    } else {
      setPassengers(passengers.filter(p => p.id !== id));
      setSelectedPassengers(selectedPassengers.filter(p => p !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Необходимо войти в систему для создания бронирования');
      navigate('/login');
      return;
    }

    if (selectedPassengers.length === 0) {
      alert('Выберите хотя бы одного пассажира');
      return;
    }

    const selectedPassengersData = passengers.filter(p => selectedPassengers.includes(p.id));

    for (const passenger of selectedPassengersData) {
      if (!passenger.firstName || !passenger.lastName || !passenger.passportNumber || 
          !passenger.citizenship || !passenger.birthday || !passenger.gender) {
        alert('Заполните все обязательные поля для всех выбранных пассажиров');
        return;
      }
    }

    try {
      setLoading(true);

      const passengersForBooking = [];
      
      for (const passenger of selectedPassengersData) {
        if (passenger.isExisting) {
          const existingPassenger = existingPassengers.find(p => p.id === passenger.id);
          if (existingPassenger) {
            const dateOfBirth = existingPassenger.dateOfBirth 
              ? new Date(existingPassenger.dateOfBirth).toISOString()
              : null;
            
            passengersForBooking.push({
              id: existingPassenger.id,
              firstName: existingPassenger.firstName,
              lastName: existingPassenger.lastName,
              passportNumber: existingPassenger.passportNumber,
              citizenship: existingPassenger.citizenship,
              dateOfBirth: dateOfBirth,
              gender: existingPassenger.gender
            });
          }
        } else {
          const birthdayDate = new Date(passenger.birthday);
          const passengerData = {
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            passportNumber: passenger.passportNumber,
            citizenship: passenger.citizenship,
            birthday: birthdayDate.toISOString(),
            gender: passenger.gender
          };
          
          const createdPassenger = await passengerService.createPassenger(passengerData);

          const dateOfBirth = createdPassenger.dateOfBirth 
            ? new Date(createdPassenger.dateOfBirth).toISOString()
            : null;
          
          passengersForBooking.push({
            id: createdPassenger.id,
            firstName: createdPassenger.firstName,
            lastName: createdPassenger.lastName,
            passportNumber: createdPassenger.passportNumber,
            citizenship: createdPassenger.citizenship,
            dateOfBirth: dateOfBirth,
            gender: createdPassenger.gender
          });
        }
      }

      const outboundFlight = bookingData.outboundFlight;
      if (outboundFlight) {
        await bookingService.createBooking(outboundFlight, passengersForBooking);
      }

      if (bookingData.returnFlight) {
        await bookingService.createBooking(bookingData.returnFlight, passengersForBooking);
      }

      alert('Бронирование успешно создано!');
      navigate('/');
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Ошибка при создании бронирования: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  if (!bookingData) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.title}>Данные бронирования не найдены</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>

        <div className={styles.title}>Бронирование рейса</div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Информация о рейсе</div>
          {bookingData.outboundFlight && (
            <div className={styles.flightInfo}>
              <strong>Рейс туда:</strong> {bookingData.outboundFlight.flightNumber} 
              {' '} {bookingData.outboundFlight.departureAirport?.city || bookingData.outboundFlight.departureAirport?.name || 'N/A'} 
              → {bookingData.outboundFlight.arrivalAirport?.city || bookingData.outboundFlight.arrivalAirport?.name || 'N/A'}
              {' '} {bookingData.outboundFlight.departureTime ? new Date(bookingData.outboundFlight.departureTime).toLocaleString('ru-RU') : 'N/A'} 
              - {bookingData.outboundFlight.arrivalTime ? new Date(bookingData.outboundFlight.arrivalTime).toLocaleString('ru-RU') : 'N/A'}
            </div>
          )}
          {bookingData.returnFlight && (
            <div className={styles.flightInfo}>
              <strong>Рейс обратно:</strong> {bookingData.returnFlight.flightNumber}
              {' '} {bookingData.returnFlight.departureAirport?.city || bookingData.returnFlight.departureAirport?.name || 'N/A'} 
              → {bookingData.returnFlight.arrivalAirport?.city || bookingData.returnFlight.arrivalAirport?.name || 'N/A'}
              {' '} {bookingData.returnFlight.departureTime ? new Date(bookingData.returnFlight.departureTime).toLocaleString('ru-RU') : 'N/A'} 
              - {bookingData.returnFlight.arrivalTime ? new Date(bookingData.returnFlight.arrivalTime).toLocaleString('ru-RU') : 'N/A'}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Пассажиры</div>
          {loading && passengers.length === 0 && (
            <div className={styles.loadingText}>Загрузка пассажиров...</div>
          )}
          <button className={styles.addButton} onClick={handleAddPassenger} disabled={loading}>
            + Добавить пассажира
          </button>

          {passengers.map(passenger => (
            <div key={passenger.id} className={styles.passengerCard}>
              <input
                type="checkbox"
                checked={selectedPassengers.includes(passenger.id)}
                onChange={() => handleTogglePassenger(passenger.id)}
                className={styles.checkbox}
              />
              <div className={styles.passengerFormRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Имя *</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(passenger.id, 'firstName', e.target.value)}
                    className={styles.input}
                    required
                    disabled={passenger.isExisting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Фамилия *</label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(passenger.id, 'lastName', e.target.value)}
                    className={styles.input}
                    required
                    disabled={passenger.isExisting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Номер паспорта *</label>
                  <input
                    type="text"
                    value={passenger.passportNumber}
                    onChange={(e) => handlePassengerChange(passenger.id, 'passportNumber', e.target.value)}
                    className={styles.input}
                    required
                    disabled={passenger.isExisting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Гражданство *</label>
                  <input
                    type="text"
                    value={passenger.citizenship}
                    onChange={(e) => handlePassengerChange(passenger.id, 'citizenship', e.target.value)}
                    className={styles.input}
                    required
                    disabled={passenger.isExisting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Дата рождения *</label>
                  <input
                    type="date"
                    value={passenger.birthday}
                    onChange={(e) => handlePassengerChange(passenger.id, 'birthday', e.target.value)}
                    className={styles.input}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    disabled={passenger.isExisting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Пол *</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(passenger.id, 'gender', e.target.value)}
                    className={styles.input}
                    required
                    disabled={passenger.isExisting}
                  >
                    <option value="MALE">Мужской</option>
                    <option value="FEMALE">Женский</option>
                  </select>
                </div>
              </div>
              {!passenger.isExisting && (
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemovePassenger(passenger.id)}
                >
                  Удалить
                </button>
              )}
            </div>
          ))}

          {passengers.length === 0 && (
            <div className={styles.emptyText}>
              Добавьте хотя бы одного пассажира
            </div>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={selectedPassengers.length === 0 || loading}
          >
            {loading ? 'Создание бронирования...' : 'Подтвердить бронирование'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

