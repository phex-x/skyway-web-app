import React, { useState, useEffect } from 'react';
import adminService from '../../../services/AdminService';
import styles from './UserManagment.module.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState('USER');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        loadUsers(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const loadUsers = async (page, size) => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Токен не найден. Пожалуйста, войдите снова.');
                return;
            }

            const pageData = await adminService.getAllUsers(page, size);

            setUsers(pageData.content || []);
            setTotalPages(pageData.totalPages ?? 0);
            setTotalElements(
                pageData.totalElements ??
                (pageData.content ? pageData.content.length : 0)
            );

            if (typeof pageData.number === 'number') {
                setCurrentPage(pageData.number);
            }
        } catch (err) {
            if (err.message?.includes('401')) {
                setError('Ошибка авторизации. Пожалуйста, войдите снова.');
            } else {
                setError(err.message || 'Ошибка при загрузке пользователей');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.'
            )
        ) {
            return;
        }

        try {
            await adminService.deleteUser(id);
            loadUsers(currentPage, pageSize);
            alert('Пользователь успешно удален');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleDisable = async (id) => {
        if (!window.confirm('Вы уверены, что хотите отключить этого пользователя?')) {
            return;
        }

        try {
            await adminService.disableUser(id);
            loadUsers(currentPage, pageSize);
            alert('Пользователь отключен');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleEnable = async (id) => {
        try {
            await adminService.enableUser(id);
            loadUsers(currentPage, pageSize);
            alert('Пользователь включен');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleChangeRole = async () => {
        if (!selectedUser) return;

        try {
            await adminService.changeUserRole(selectedUser.id, newRole);
            setShowRoleModal(false);
            setSelectedUser(null);
            loadUsers(currentPage, pageSize);
            alert('Роль пользователя успешно изменена');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role || 'USER');
        setShowRoleModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            if (
                typeof dateString === 'string' &&
                dateString.match(/^\d{4}-\d{2}-\d{2}$/)
            ) {
                const [year, month, day] = dateString.split('-');
                return `${day}.${month}.${year}`;
            }
            return new Date(dateString).toLocaleDateString('ru-RU');
        } catch {
            return dateString;
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'Администратор';
            case 'STAFF':
                return 'Персонал';
            case 'USER':
                return 'Пользователь';
            default:
                return role;
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Управление пользователями</div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Имя</th>
                        <th className={styles.th}>Фамилия</th>
                        <th className={styles.th}>Email</th>
                        <th className={styles.th}>Телефон</th>
                        <th className={styles.th}>Страна</th>
                        <th className={styles.th}>Дата рождения</th>
                        <th className={styles.th}>Роль</th>
                        <th className={styles.th}>Статус</th>
                        <th className={styles.th}>Действия</th>
                    </tr>
                    </thead>

                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="10" className={`${styles.td} ${styles.tdCenter}`}>
                                Нет пользователей
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td className={styles.td}>{user.id}</td>
                                <td className={styles.td}>{user.firstName}</td>
                                <td className={styles.td}>{user.lastName}</td>
                                <td className={styles.td}>{user.email}</td>
                                <td className={styles.td}>{user.phone || 'N/A'}</td>
                                <td className={styles.td}>{user.country || 'N/A'}</td>
                                <td className={styles.td}>
                                    {formatDate(user.dateOfBirth)}
                                </td>
                                <td className={styles.td}>
                    <span
                        className={`${styles.roleBadge} ${
                            user.role === 'ADMIN'
                                ? styles.roleAdmin
                                : user.role === 'STAFF'
                                    ? styles.roleStaff
                                    : styles.roleUser
                        }`}
                    >
                      {getRoleName(user.role)}
                    </span>
                                </td>
                                <td className={styles.td}>
                    <span
                        className={`${styles.status} ${
                            user.isEnabled
                                ? styles.statusEnabled
                                : styles.statusDisabled
                        }`}
                    >
                      {user.isEnabled ? 'Активен' : 'Отключен'}
                    </span>
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.buttonGroup}>
                                        <button
                                            className={`${styles.button} ${styles.changeRoleButton}`}
                                            onClick={() => openRoleModal(user)}
                                        >
                                            Изменить роль
                                        </button>

                                        {user.isEnabled ? (
                                            <button
                                                className={`${styles.button} ${styles.disableButton}`}
                                                onClick={() => handleDisable(user.id)}
                                            >
                                                Отключить
                                            </button>
                                        ) : (
                                            <button
                                                className={`${styles.button} ${styles.enableButton}`}
                                                onClick={() => handleEnable(user.id)}
                                            >
                                                Включить
                                            </button>
                                        )}

                                        <button
                                            className={`${styles.button} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className={styles.paginationContainer}>
                <div>
                    Страница {totalPages > 0 ? currentPage + 1 : 0} из {totalPages}
                    {totalElements !== undefined && (
                        <span className={styles.paginationInfo}>
              {' '}
                            (всего пользователей: {totalElements})
            </span>
                    )}
                </div>

                <div className={styles.paginationButtons}>
                    <button
                        className={`${styles.paginationButton} ${
                            currentPage === 0 || loading
                                ? styles.paginationButtonDisabled
                                : ''
                        }`}
                        disabled={currentPage === 0 || loading}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 0))
                        }
                    >
                        Предыдущая
                    </button>

                    <button
                        className={`${styles.paginationButton} ${
                            currentPage >= totalPages - 1 ||
                            loading ||
                            totalPages === 0
                                ? styles.paginationButtonDisabled
                                : ''
                        }`}
                        disabled={
                            currentPage >= totalPages - 1 ||
                            loading ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setCurrentPage((prev) =>
                                totalPages > 0
                                    ? Math.min(prev + 1, totalPages - 1)
                                    : prev
                            )
                        }
                    >
                        Следующая
                    </button>
                </div>
            </div>

            {showRoleModal && selectedUser && (
                <div
                    className={styles.modal}
                    onClick={() => setShowRoleModal(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalTitle}>
                            Изменить роль пользователя: {selectedUser.firstName}{' '}
                            {selectedUser.lastName}
                        </div>

                        <div className={styles.modalFormGroup}>
                            <label className={styles.modalLabel}>Новая роль:</label>
                            <select
                                className={styles.modalSelect}
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="USER">Пользователь</option>
                                <option value="STAFF">Персонал</option>
                                <option value="ADMIN">Администратор</option>
                            </select>
                        </div>

                        <div className={styles.modalButtonGroup}>
                            <button
                                className={`${styles.modalButton} ${styles.modalSubmitButton}`}
                                onClick={handleChangeRole}
                            >
                                Сохранить
                            </button>
                            <button
                                className={`${styles.modalButton} ${styles.modalCancelButton}`}
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setSelectedUser(null);
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
