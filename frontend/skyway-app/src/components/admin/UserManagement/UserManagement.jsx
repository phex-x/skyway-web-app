import React, { useState, useEffect } from 'react';
import adminService from '../../../services/AdminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('USER');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadUsers(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      console.log('UserManagement: Loading users, token exists:', !!token);
      const pageData = await adminService.getAllUsers(page, size);

      setUsers(pageData.content || []);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? (pageData.content ? pageData.content.length : 0));
      if (typeof pageData.number === 'number') {
        setCurrentPage(pageData.number);
      }
    } catch (err) {
      console.error('UserManagement: Error loading users:', err);
      if (err.message.includes('401')) {
        setError('Ошибка авторизации. Пожалуйста, войдите снова.');
      } else {
        setError(err.message || 'Ошибка при загрузке пользователей');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
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
      loadUsers();
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
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
      }
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
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

  const styles = {
    container: {
      width: '100%'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#000'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      fontSize: '14px'
    },
    th: {
      backgroundColor: '#004758',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px'
    },
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    statusEnabled: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusDisabled: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    roleBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    roleAdmin: {
      backgroundColor: '#d32f2f',
      color: '#fff'
    },
    roleStaff: {
      backgroundColor: '#ff9800',
      color: '#fff'
    },
    roleUser: {
      backgroundColor: '#1976d2',
      color: '#fff'
    },
    buttonGroup: {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    changeRoleButton: {
      backgroundColor: '#004758',
      color: '#fff'
    },
    enableButton: {
      backgroundColor: '#4caf50',
      color: '#fff'
    },
    disableButton: {
      backgroundColor: '#ff9800',
      color: '#fff'
    },
    deleteButton: {
      backgroundColor: '#d32f2f',
      color: '#fff'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#666'
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#000'
    },
    modalFormGroup: {
      marginBottom: '20px'
    },
    modalLabel: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    modalSelect: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box'
    },
    modalButtonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    },
    modalButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    modalSubmitButton: {
      backgroundColor: '#004758',
      color: '#fff'
    },
    modalCancelButton: {
      backgroundColor: '#666',
      color: '#fff'
    },
    paginationContainer: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      fontSize: '14px'
    },
    paginationButtons: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    paginationButton: {
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#004758',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 'bold',
      minWidth: '90px'
    },
    paginationButtonDisabled: {
      opacity: 0.5,
      cursor: 'default'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Управление пользователями</div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Имя</th>
              <th style={styles.th}>Фамилия</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Телефон</th>
              <th style={styles.th}>Страна</th>
              <th style={styles.th}>Дата рождения</th>
              <th style={styles.th}>Роль</th>
              <th style={styles.th}>Статус</th>
              <th style={styles.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ ...styles.td, textAlign: 'center', color: '#666' }}>
                  Нет пользователей
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.firstName}</td>
                  <td style={styles.td}>{user.lastName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone || 'N/A'}</td>
                  <td style={styles.td}>{user.country || 'N/A'}</td>
                  <td style={styles.td}>{formatDate(user.dateOfBirth)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roleBadge,
                      ...(user.role === 'ADMIN' ? styles.roleAdmin :
                          user.role === 'STAFF' ? styles.roleStaff : styles.roleUser)
                    }}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.status,
                      ...(user.isEnabled ? styles.statusEnabled : styles.statusDisabled)
                    }}>
                      {user.isEnabled ? 'Активен' : 'Отключен'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.buttonGroup}>
                      <button
                        style={{ ...styles.button, ...styles.changeRoleButton }}
                        onClick={() => openRoleModal(user)}
                      >
                        Изменить роль
                      </button>
                      {user.isEnabled ? (
                        <button
                          style={{ ...styles.button, ...styles.disableButton }}
                          onClick={() => handleDisable(user.id)}
                        >
                          Отключить
                        </button>
                      ) : (
                        <button
                          style={{ ...styles.button, ...styles.enableButton }}
                          onClick={() => handleEnable(user.id)}
                        >
                          Включить
                        </button>
                      )}
                      <button
                        style={{ ...styles.button, ...styles.deleteButton }}
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

      <div style={styles.paginationContainer}>
        <div>
          Страница {totalPages > 0 ? currentPage + 1 : 0} из {totalPages}{' '}
          {totalElements !== undefined && (
            <span style={{ color: '#555' }}> (всего пользователей: {totalElements})</span>
          )}
        </div>
        <div style={styles.paginationButtons}>
          <button
            style={{
              ...styles.paginationButton,
              ...(currentPage === 0 || loading ? styles.paginationButtonDisabled : {})
            }}
            disabled={currentPage === 0 || loading}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          >
            Предыдущая
          </button>
          <button
            style={{
              ...styles.paginationButton,
              ...(currentPage >= totalPages - 1 || loading || totalPages === 0
                ? styles.paginationButtonDisabled
                : {})
            }}
            disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) =>
                totalPages > 0 ? Math.min(prev + 1, totalPages - 1) : prev
              )
            }
          >
            Следующая
          </button>
        </div>
      </div>

      {showRoleModal && selectedUser && (
        <div style={styles.modal} onClick={() => setShowRoleModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              Изменить роль пользователя: {selectedUser.firstName} {selectedUser.lastName}
            </div>
            <div style={styles.modalFormGroup}>
              <label style={styles.modalLabel}>Новая роль:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={styles.modalSelect}
              >
                <option value="USER">Пользователь</option>
                <option value="STAFF">Персонал</option>
                <option value="ADMIN">Администратор</option>
              </select>
            </div>
            <div style={styles.modalButtonGroup}>
              <button
                style={{ ...styles.modalButton, ...styles.modalSubmitButton }}
                onClick={handleChangeRole}
              >
                Сохранить
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.modalCancelButton }}
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

