import React from 'react';
import styles from './Statistics.module.css';

const AdminStatistics = ({ statistics }) => {
    if (!statistics) return null;

    // Поддерживаем оба варианта кейса полей с бэкенда
    const totalUsers = statistics.totalUsers ?? statistics.TotalUsers ?? 0;
    const totalAirports = statistics.totalAirports ?? statistics.TotalAirports ?? 0;
    const totalFlights = statistics.totalFlights ?? statistics.TotalFlights ?? 0;
    const totalAirplanes = statistics.totalAirplanes ?? statistics.TotalAirplanes ?? 0;
    const avgFlightDurationRaw =
        statistics.averageFlightDurationMinutes ??
        statistics.AverageFlightDurationMinutes ??
        0;

    const avgFlightDuration = Number(avgFlightDurationRaw) || 0;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.card}>
                    Всего пользователей
                    <div className={styles.value}>{totalUsers}</div>
                </div>

                <div className={styles.card}>
                    Аэропортов
                    <div className={styles.value}>{totalAirports}</div>
                </div>

                <div className={styles.card}>
                    Рейсов
                    <div className={styles.value}>{totalFlights}</div>
                </div>

                <div className={styles.card}>
                    Самолётов
                    <div className={styles.value}>{totalAirplanes}</div>
                </div>

                <div className={styles.card}>
                    Среднее время полёта (мин)
                    <div className={styles.value}>
                        {avgFlightDuration.toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;
