// src/components/FlightList.jsx
import React, { useState, useEffect } from 'react';
import flightService from '../../services/FlightService';

const FlightList = ({ searchParams, onFlightSelect, tripType, isReturnFlight }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('PRICE_ASC');

  // Сбрасываем страницу при изменении параметров поиска
  useEffect(() => {
    setCurrentPage(0);
  }, [searchParams, tripType, isReturnFlight]);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      try {
        let flightData;
        let pageData;
        
        // Добавляем sortBy к параметрам поиска
        const searchParamsWithSort = { ...searchParams, sortBy };
        
        if (tripType === 'round-trip' && !isReturnFlight) {
          // Для туда-обратно, показываем только рейсы туда
          const roundTripData = await flightService.searchRoundTripFlights(searchParamsWithSort, currentPage, pageSize);
          pageData = roundTripData.flightTo;
          flightData = pageData?.content || [];
        } else if (tripType === 'round-trip' && isReturnFlight) {
          // Показываем рейсы обратно
          const roundTripData = await flightService.searchRoundTripFlights(searchParamsWithSort, currentPage, pageSize);
          pageData = roundTripData.flightBack;
          flightData = pageData?.content || [];
        } else {
          // Для рейса в одну сторону
          pageData = await flightService.searchOneWayFlights(searchParamsWithSort, currentPage, pageSize);
          flightData = pageData?.content || [];
        }
        
        // Если данные пришли как массив (старый формат), используем их напрямую
        if (Array.isArray(flightData) && flightData.length > 0) {
          setFlights(flightData);
          // Если это Page объект
          if (pageData && typeof pageData === 'object' && 'totalPages' in pageData) {
            setTotalPages(pageData.totalPages || 0);
            setTotalElements(pageData.totalElements || 0);
          } else {
            // Старый формат - все данные на одной странице
            setTotalPages(1);
            setTotalElements(flightData.length);
          }
        } else {
          setFlights([]);
          if (pageData && typeof pageData === 'object' && 'totalPages' in pageData) {
            setTotalPages(pageData.totalPages || 0);
            setTotalElements(pageData.totalElements || 0);
          } else {
            setTotalPages(0);
            setTotalElements(0);
          }
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError(error.message || 'Ошибка при загрузке рейсов');
        setFlights([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams) {
      fetchFlights();
    }
  }, [searchParams, tripType, isReturnFlight, currentPage, sortBy]);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginationStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '30px',
      marginBottom: '20px'
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    buttonActive: {
      backgroundColor: '#B79C72'
    },
    pageInfo: {
      padding: '8px 16px',
      fontSize: '14px',
      color: '#666'
    }
  };

  if (loading && flights.length === 0) {
    return <div style={styles.loading}>Загрузка рейсов...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (flights.length === 0 && !loading) {
    return <div style={styles.noFlights}>Рейсы не найдены</div>;
  }

  const filterStyles = {
    container: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
      marginRight: '10px'
    },
    select: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      minWidth: '200px'
    },
    resultsInfo: {
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      {/* Фильтры сортировки */}
      <div style={filterStyles.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={filterStyles.label}>Сортировка:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(0); // Сбрасываем страницу при изменении сортировки
            }}
            style={filterStyles.select}
          >
            <option value="PRICE_ASC">Цена: по возрастанию</option>
            <option value="PRICE_DESC">Цена: по убыванию</option>
            <option value="DEPARTURE_ASC">Время вылета: раньше</option>
            <option value="DEPARTURE_DESC">Время вылета: позже</option>
          </select>
        </div>
        {totalElements > 0 && (
          <div style={filterStyles.resultsInfo}>
            Найдено рейсов: {totalElements}
          </div>
        )}
      </div>

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

      {/* Пагинация */}
      {totalPages > 1 && (
        <div style={paginationStyles.container}>
          <button
            style={{
              ...paginationStyles.button,
              ...(currentPage === 0 ? paginationStyles.buttonDisabled : {})
            }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Назад
          </button>
          
          <div style={paginationStyles.pageInfo}>
            Страница {currentPage + 1} из {totalPages} ({totalElements} рейсов)
          </div>
          
          <button
            style={{
              ...paginationStyles.button,
              ...(currentPage >= totalPages - 1 ? paginationStyles.buttonDisabled : {})
            }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightList;

