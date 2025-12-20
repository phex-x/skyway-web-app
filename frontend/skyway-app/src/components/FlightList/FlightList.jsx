import React, { useState, useEffect } from 'react';
import flightService from '../../services/FlightService';
import styles from './FlightList.module.css';

const FlightList = ({ searchParams, onFlightSelect, tripType, isReturnFlight }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [sortBy, setSortBy] = useState('PRICE_ASC');

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

                const searchParamsWithSort = { ...searchParams, sortBy };

                if (tripType === 'round-trip' && !isReturnFlight) {
                    const roundTripData =
                        await flightService.searchRoundTripFlights(
                            searchParamsWithSort,
                            currentPage,
                            pageSize
                        );
                    pageData = roundTripData.flightTo;
                    flightData = pageData?.content || [];
                } else if (tripType === 'round-trip' && isReturnFlight) {
                    const roundTripData =
                        await flightService.searchRoundTripFlights(
                            searchParamsWithSort,
                            currentPage,
                            pageSize
                        );
                    pageData = roundTripData.flightBack;
                    flightData = pageData?.content || [];
                } else {
                    pageData = await flightService.searchOneWayFlights(
                        searchParamsWithSort,
                        currentPage,
                        pageSize
                    );
                    flightData = pageData?.content || [];
                }

                if (Array.isArray(flightData) && flightData.length > 0) {
                    setFlights(flightData);
                    if (pageData && typeof pageData === 'object' && 'totalPages' in pageData) {
                        setTotalPages(pageData.totalPages || 0);
                        setTotalElements(pageData.totalElements || 0);
                    } else {
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
        return new Date(dateTimeString).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';
        return new Date(dateTimeString).toLocaleDateString('ru-RU');
    };

    const calculateDuration = (departureTime, arrivalTime) => {
        if (!departureTime || !arrivalTime) return '';
        const diff = new Date(arrivalTime) - new Date(departureTime);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}ч ${minutes}м`;
    };

    if (loading && flights.length === 0) {
        return <div className={styles.loading}>Загрузка рейсов...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (flights.length === 0 && !loading) {
        return <div className={styles.noFlights}>Рейсы не найдены</div>;
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            {/* Сортировка */}
            <div className={styles.filterContainer}>
                <div className={styles.filterLeft}>
                    <label className={styles.filterLabel}>Сортировка:</label>
                    <select
                        className={styles.filterSelect}
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <option value="PRICE_ASC">Цена: по возрастанию</option>
                        <option value="PRICE_DESC">Цена: по убыванию</option>
                        <option value="DEPARTURE_ASC">Время вылета: раньше</option>
                        <option value="DEPARTURE_DESC">Время вылета: позже</option>
                    </select>
                </div>

                {totalElements > 0 && (
                    <div className={styles.resultsInfo}>
                        Найдено рейсов: {totalElements}
                    </div>
                )}
            </div>

            {flights.map((flight) => (
                <div key={flight.flightId} className={styles.flightCard}>
                    <div className={styles.flightInfo}>
                        <div className={styles.flightNumber}>{flight.flightNumber}</div>

                        <div className={styles.route}>
                            <div>
                                <div className={styles.airport}>
                                    {flight.departureAirport?.city ||
                                        flight.departureAirport?.name ||
                                        'N/A'}
                                </div>
                                <div className={styles.airportCity}>
                                    {flight.departureAirport?.code || ''}
                                </div>
                                <div className={styles.time}>
                                    {formatDateTime(flight.departureTime)}
                                </div>
                                <div className={styles.time}>
                                    {formatDate(flight.departureTime)}
                                </div>
                            </div>

                            <div className={styles.arrow}>→</div>

                            <div>
                                <div className={styles.airport}>
                                    {flight.arrivalAirport?.city ||
                                        flight.arrivalAirport?.name ||
                                        'N/A'}
                                </div>
                                <div className={styles.airportCity}>
                                    {flight.arrivalAirport?.code || ''}
                                </div>
                                <div className={styles.time}>
                                    {formatDateTime(flight.arrivalTime)}
                                </div>
                                <div className={styles.time}>
                                    {formatDate(flight.arrivalTime)}
                                </div>
                            </div>
                        </div>

                        <div className={styles.duration}>
                            Время в пути:{' '}
                            {calculateDuration(
                                flight.departureTime,
                                flight.arrivalTime
                            )}
                        </div>
                        <div className={styles.duration}>
                            Класс: {flight.seatClass === 'ECONOMY' ? 'Эконом' : 'Бизнес'}
                        </div>
                    </div>

                    <div className={styles.priceSection}>
                        <div className={styles.price}>
                            {Math.round(flight.price).toLocaleString('ru-RU')} ₽
                        </div>
                        <button
                            className={styles.bookButton}
                            onClick={() => onFlightSelect(flight)}
                        >
                            {tripType === 'round-trip' ? 'Выбрать' : 'Забронировать'}
                        </button>
                    </div>
                </div>
            ))}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={`${styles.pageButton} ${
                            currentPage === 0 ? styles.pageButtonDisabled : ''
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        ← Назад
                    </button>

                    <div className={styles.pageInfo}>
                        Страница {currentPage + 1} из {totalPages} ({totalElements} рейсов)
                    </div>

                    <button
                        className={`${styles.pageButton} ${
                            currentPage >= totalPages - 1
                                ? styles.pageButtonDisabled
                                : ''
                        }`}
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
