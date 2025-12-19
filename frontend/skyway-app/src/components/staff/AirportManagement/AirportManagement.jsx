// src/components/staff/AirportManagement.jsx
import React, { useState, useEffect } from 'react';
import staffService from '../../../services/StaffService';
import styles from './AirportManagement.module.css';

const AirportManagement = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [formData, setFormData] = useState({
        iataCode: '',
        icaoCode: '',
        name: '',
        country: '',
        city: '',
        latitude: '',
        longtitude: ''
    });

    useEffect(() => {
        loadAirports();
    }, [currentPage]);

    const loadAirports = async () => {
        try {
            setLoading(true);
            const data = await staffService.getAllAirports(currentPage, pageSize);

            if (data && typeof data === 'object') {
                if ('content' in data) {
                    const content = Array.isArray(data.content) ? data.content : [];
                    setAirports(content);
                    setTotalPages(data.totalPages ?? 0);
                    setTotalElements(data.totalElements ?? 0);
                } else if (Array.isArray(data)) {
                    setAirports(data);
                    setTotalPages(1);
                    setTotalElements(data.length || 0);
                } else {
                    setAirports([]);
                    setTotalPages(0);
                    setTotalElements(0);
                }
            } else {
                setAirports([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке аэропортов');
            setAirports([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.iataCode || !formData.icaoCode || !formData.name || !formData.city || !formData.country) {
            alert('Заполните все обязательные поля');
            return;
        }

        try {
            const airportData = {
                iataCode: formData.iataCode,
                icaoCode: formData.icaoCode,
                name: formData.name,
                country: formData.country,
                city: formData.city,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longtitude: formData.longtitude ? parseFloat(formData.longtitude) : null,
                timezone: null
            };

            await staffService.createAirport(airportData);
            setShowForm(false);
            setFormData({
                iataCode: '',
                icaoCode: '',
                name: '',
                country: '',
                city: '',
                latitude: '',
                longtitude: ''
            });
            loadAirports();
            alert('Аэропорт успешно создан');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот аэропорт?')) {
            return;
        }
        try {
            await staffService.deleteAirport(id);
            loadAirports();
            alert('Аэропорт успешно удален');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Управление аэропортами</div>
                <button
                    className={styles.addButton}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Отмена' : '+ Добавить аэропорт'}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>IATA код *</label>
                            <input
                                type="text"
                                value={formData.iataCode}
                                onChange={(e) =>
                                    setFormData({ ...formData, iataCode: e.target.value })
                                }
                                className={styles.input}
                                required
                                maxLength={3}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>ICAO код *</label>
                            <input
                                type="text"
                                value={formData.icaoCode}
                                onChange={(e) =>
                                    setFormData({ ...formData, icaoCode: e.target.value })
                                }
                                className={styles.input}
                                required
                                maxLength={4}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Название *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Город *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Страна *</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) =>
                                    setFormData({ ...formData, country: e.target.value })
                                }
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Широта</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) =>
                                    setFormData({ ...formData, latitude: e.target.value })
                                }
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Долгота</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longtitude}
                                onChange={(e) =>
                                    setFormData({ ...formData, longtitude: e.target.value })
                                }
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>
                            Сохранить
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setShowForm(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>IATA</th>
                    <th className={styles.th}>ICAO</th>
                    <th className={styles.th}>Название</th>
                    <th className={styles.th}>Город</th>
                    <th className={styles.th}>Страна</th>
                    <th className={styles.th}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {airports.length === 0 ? (
                    <tr>
                        <td colSpan="7" className={`${styles.td} ${styles.tdCenter}`}>
                            Нет аэропортов
                        </td>
                    </tr>
                ) : (
                    airports.map((airport) => (
                        <tr key={airport.id}>
                            <td className={styles.td}>{airport.id || 'N/A'}</td>
                            <td className={styles.td}>{airport.iataCode || '(пусто)'}</td>
                            <td className={styles.td}>{airport.icaoCode || '(пусто)'}</td>
                            <td className={styles.td}>{airport.name || '(пусто)'}</td>
                            <td className={styles.td}>{airport.city || '(пусто)'}</td>
                            <td className={styles.td}>{airport.country || '(пусто)'}</td>
                            <td className={styles.td}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(airport.id)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {totalElements > 0 && (
                <div className={styles.pagination}>
                    <button
                        className={`${styles.pageButton} ${
                            currentPage === 0 ? styles.pageButtonDisabled : ''
                        }`}
                        onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        ← Назад
                    </button>

                    <div className={styles.pageInfo}>
                        Страница {currentPage + 1} из {totalPages || 1} ({totalElements} аэропортов)
                    </div>

                    <button
                        className={`${styles.pageButton} ${
                            totalPages === 0 || currentPage >= totalPages - 1
                                ? styles.pageButtonDisabled
                                : ''
                        }`}
                        onClick={() =>
                            totalPages > 0 &&
                            currentPage < totalPages - 1 &&
                            setCurrentPage(currentPage + 1)
                        }
                        disabled={totalPages === 0 || currentPage >= totalPages - 1}
                    >
                        Вперед →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AirportManagement;
