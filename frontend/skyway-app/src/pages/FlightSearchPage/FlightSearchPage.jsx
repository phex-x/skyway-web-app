import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FlightList from '../../components/FlightList/FlightList';
import styles from './FlightSearchPage.module.css';

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
      navigate('/booking', {
        state: {
          outboundFlight: flight,
          searchParams: searchParams
        }
      });
    } else {
      if (!selectedOutboundFlight) {
        navigate('/flights', {
          state: {
            ...searchParams,
            tripType: 'round-trip',
            selectedOutboundFlight: flight,
            step: 'return'
          }
        });
      } else {
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


  if (!searchParams) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            ← Назад на главную
          </button>
          <div className={styles.title}>Параметры поиска не найдены</div>
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
        
        {tripType === 'round-trip' && selectedOutboundFlight && (
          <div className={styles.stepIndicator}>
            Рейс туда выбран. Выберите рейс обратно.
          </div>
        )}
        
        {tripType === 'round-trip' && !selectedOutboundFlight && (
          <div className={styles.stepIndicator}>
            Выберите рейс туда.
          </div>
        )}

        <div className={styles.title}>
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

