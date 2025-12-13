// src/components/FlightList.jsx
import React, { useState, useEffect } from 'react';
import flightService from '../services/FlightService';

const FlightList = ({ searchParams, onFlightSelect, tripType, isReturnFlight }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      try {
        let flightData;
        
        if (tripType === 'round-trip' && !isReturnFlight) {
          // Для туда-обратно, показываем только рейсы туда
          const roundTripData = await flightService.searchRoundTripFlights(searchParams);
          flightData = roundTripData.flightTo || [];
        } else if (tripType === 'round-trip' && isReturnFlight) {
          // Показываем рейсы обратно
          const roundTripData = await flightService.searchRoundTripFlights(searchParams);
          flightData = roundTripData.flightBack || [];
        } else {
          // Для рейса в одну сторону
          flightData = await flightService.searchOneWayFlights(searchParams);
        }
        
        setFlights(flightData);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError(error.message || 'Ошибка при загрузке рейсов');
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams) {
      fetchFlights();
    }
  }, [searchParams, tripType, isReturnFlight]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('ru-RU');
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return '';
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const styles = {
    container: {
      marginTop: '20px'
    },
    flightCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      transition: 'box-shadow 0.3s'
    },
    flightInfo: {
      flex: 1
    },
    flightNumber: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#004758',
      marginBottom: '10px'
    },
    route: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '10px'
    },
    airport: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#000'
    },
    airportCity: {
      fontSize: '14px',
      color: '#666',
      marginTop: '2px'
    },
    time: {
      fontSize: '14px',
      color: '#666'
    },
    duration: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
    },
    priceSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px'
    },
    price: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000'
    },
    bookButton: {
      padding: '12px 30px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '16px',
      color: '#666'
    },
    noFlights: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '16px',
      color: '#666'
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '16px',
      color: '#d32f2f',
      backgroundColor: '#ffebee',
      borderRadius: '4px'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка рейсов...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (flights.length === 0) {
    return <div style={styles.noFlights}>Рейсы не найдены</div>;
  }

  return (
    <div style={styles.container}>
      {flights.map(flight => (
        <div key={flight.flightId} style={styles.flightCard}>
          <div style={styles.flightInfo}>
            <div style={styles.flightNumber}>{flight.flightNumber}</div>
            <div style={styles.route}>
              <div>
                <div style={styles.airport}>
                  {flight.departureAirport?.city || flight.departureAirport?.name || 'N/A'}
                </div>
                <div style={styles.airportCity}>
                  {flight.departureAirport?.code || ''}
                </div>
                <div style={styles.time}>
                  {formatDateTime(flight.departureTime)}
                </div>
                <div style={styles.time}>
                  {formatDate(flight.departureTime)}
                </div>
              </div>
              <div>→</div>
              <div>
                <div style={styles.airport}>
                  {flight.arrivalAirport?.city || flight.arrivalAirport?.name || 'N/A'}
                </div>
                <div style={styles.airportCity}>
                  {flight.arrivalAirport?.code || ''}
                </div>
                <div style={styles.time}>
                  {formatDateTime(flight.arrivalTime)}
                </div>
                <div style={styles.time}>
                  {formatDate(flight.arrivalTime)}
                </div>
              </div>
            </div>
            <div style={styles.duration}>
              Время в пути: {calculateDuration(flight.departureTime, flight.arrivalTime)}
            </div>
            <div style={styles.duration}>
              Класс: {flight.seatClass === 'ECONOMY' ? 'Эконом' : 'Бизнес'}
            </div>
          </div>
          <div style={styles.priceSection}>
            <div style={styles.price}>{Math.round(flight.price).toLocaleString('ru-RU')} ₽</div>
            <button
              style={styles.bookButton}
              onClick={() => onFlightSelect(flight)}
            >
              {tripType === 'round-trip' && !isReturnFlight
                ? 'Выбрать'
                : tripType === 'round-trip' && isReturnFlight
                ? 'Выбрать'
                : 'Забронировать'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightList;

