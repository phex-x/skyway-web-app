import React from 'react';

const AdminStatistics = ({ statistics }) => {
    if (!statistics) return null;

    // Поддерживаем оба варианта кейса полей с бэкенда (totalUsers / TotalUsers и т.п.)
    const totalUsers = statistics.totalUsers ?? statistics.TotalUsers ?? 0;
    const totalAirports = statistics.totalAirports ?? statistics.TotalAirports ?? 0;
    const totalFlights = statistics.totalFlights ?? statistics.TotalFlights ?? 0;
    const totalAirplanes = statistics.totalAirplanes ?? statistics.TotalAirplanes ?? 0;
    const avgFlightDurationRaw =
        statistics.averageFlightDurationMinutes ??
        statistics.AverageFlightDurationMinutes ??
        0;
    const avgFlightDuration = Number(avgFlightDurationRaw) || 0;

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    };

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const valueStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        marginTop: '10px'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
    };

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>
                <div style={cardStyle}>
                    Всего пользователей
                    <div style={valueStyle}>{totalUsers}</div>
                </div>

                <div style={cardStyle}>
                    Аэропортов
                    <div style={valueStyle}>{totalAirports}</div>
                </div>

                <div style={cardStyle}>
                    Рейсов
                    <div style={valueStyle}>{totalFlights}</div>
                </div>

                <div style={cardStyle}>
                    Самолётов
                    <div style={valueStyle}>{totalAirplanes}</div>
                </div>

                <div style={cardStyle}>
                    Среднее время полёта (мин)
                    <div style={valueStyle}>
                        {avgFlightDuration.toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;
