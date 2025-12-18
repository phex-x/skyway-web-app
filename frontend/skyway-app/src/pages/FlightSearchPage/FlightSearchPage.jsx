// src/pages/FlightSearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FlightList from '../../components/FlightList/FlightList';

const FlightSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState(null);
  const [tripType, setTripType] = useState('one-way'); // 'one-way' or 'round-trip'
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);

  useEffect(() => {
    if (location.state) {
      setSearchParams(location.state);
      setTripType(location.state.tripType || 'one-way');
      setSelectedOutboundFlight(location.state.selectedOutboundFlight || null);
    }
  }, [location.state]);

  const handleFlightSelect = (flight) => {
    if (tripType === 'one-way') {
      // Для рейса в одну сторону - сразу на страницу бронирования
      navigate('/booking', {
        state: {
          outboundFlight: flight,
          searchParams: searchParams
        }
      });
    } else {
      // Для туда-обратно
      if (!selectedOutboundFlight) {
        // Сохраняем выбранный рейс туда и переходим к выбору обратного рейса
        navigate('/flights', {
          state: {
            ...searchParams,
            tripType: 'round-trip',
            selectedOutboundFlight: flight,
            step: 'return'
          }
        });
      } else {
        // Выбран обратный рейс - переходим на страницу бронирования
        navigate('/booking', {
          state: {
            outboundFlight: selectedOutboundFlight,
            returnFlight: flight,
            searchParams: searchParams
          }
        });
      }
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '20px'
    },
    stepIndicator: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontSize: '14px'
    }
  };

  if (!searchParams) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button style={styles.backButton} onClick={() => navigate('/')}>
            ← Назад на главную
          </button>
          <div style={styles.title}>Параметры поиска не найдены</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>
        
        {tripType === 'round-trip' && selectedOutboundFlight && (
          <div style={styles.stepIndicator}>
            Рейс туда выбран. Выберите рейс обратно.
          </div>
        )}
        
        {tripType === 'round-trip' && !selectedOutboundFlight && (
          <div style={styles.stepIndicator}>
            Выберите рейс туда.
          </div>
        )}

        <div style={styles.title}>
          {tripType === 'round-trip' && selectedOutboundFlight
            ? 'Рейсы обратно'
            : tripType === 'round-trip'
            ? 'Рейсы туда'
            : 'Доступные рейсы'}
        </div>

        <FlightList
          searchParams={searchParams}
          onFlightSelect={handleFlightSelect}
          tripType={tripType}
          isReturnFlight={tripType === 'round-trip' && selectedOutboundFlight !== null}
        />
      </div>
    </div>
  );
};

export default FlightSearchPage;

