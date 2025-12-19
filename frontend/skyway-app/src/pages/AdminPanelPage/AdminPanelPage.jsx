// src/pages/AdminPanelPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import UserManagement from '../../components/admin/UserManagement/UserManagement';
import AdminStatistics from '../../components/admin/Statistics/Statistics';
import adminService from '../../services/AdminService';

import styles from './AdminPanelPage.module.css';

const AdminPanelPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [statistics, setStatistics] = useState(null);
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [statisticsError, setStatisticsError] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (activeTab === 'stats' && statistics === null && !statisticsLoading) {
            loadStatistics();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const loadStatistics = async () => {
        try {
            setStatisticsLoading(true);
            setStatisticsError('');
            const data = await adminService.getStatistics();
            setStatistics(data);
        } catch (err) {
            console.error('AdminPanelPage: error loading statistics', err);
            setStatisticsError(err.message || 'Ошибка при загрузке статистики');
        } finally {
            setStatisticsLoading(false);
        }
    };



    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <div className={styles.title}>
                            Панель управления администратора
                        </div>
                        <div className={styles.userInfo}>
                            {user?.firstName} {user?.lastName} ({user?.email})
                        </div>
                    </div>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate('/')}
                    >
                        На главную
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabsContainer}>
                        <button
                            className={`${styles.tabButton} ${
                                activeTab === 'users' ? styles.tabButtonActive : ''
                            }`}
                            onClick={() => setActiveTab('users')}
                        >
                            Пользователи
                        </button>
                        <button
                            className={`${styles.tabButton} ${
                                activeTab === 'stats' ? styles.tabButtonActive : ''
                            }`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Статистика
                        </button>
                    </div>

                    {activeTab === 'users' && <UserManagement />}

                    {activeTab === 'stats' && (
                        <>
                            {statisticsError && (
                                <div className={styles.statsError}>
                                    {statisticsError}
                                </div>
                            )}

                            {statisticsLoading && !statistics && (
                                <div className={styles.statsLoading}>
                                    Загрузка статистики...
                                </div>
                            )}

                            {!statisticsLoading && statistics && (
                                <AdminStatistics statistics={statistics} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanelPage;
