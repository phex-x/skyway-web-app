import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class AdminService {
  async getAllUsers(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const params = new URLSearchParams();
    if (page !== undefined && page !== null) params.append('page', page);
    if (size !== undefined && size !== null) params.append('size', size);

    const response = await fetch(`${API_URL}/admin/user/get-all?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch users';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        if (response.status === 401) {
          errorMessage = 'Ошибка авторизации (401). Проверьте, что вы вошли как администратор и токен действителен.';
        } else if (response.status === 403) {
          errorMessage = 'Доступ запрещен (403). У вас нет прав администратора.';
        } else {
          errorMessage = `Failed to fetch users: ${response.status} ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return {
        content: data,
        totalPages: 1,
        totalElements: data.length,
        number: 0,
        size: data.length,
      };
    }

    return data;
  }

  async getUserById(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/user/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch user: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async deleteUser(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/user/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to delete user: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  async disableUser(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/user/disable/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to disable user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to disable user: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  async enableUser(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/user/enable/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to enable user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to enable user: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  async changeUserRole(id, newRole) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/user/change-role`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        newRole: newRole
      }),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to change user role';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to change user role: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  async getStatistics() {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/admin/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch statistics';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        if (response.status === 401) {
          errorMessage = 'Ошибка авторизации (401) при загрузке статистики.';
        } else if (response.status === 403) {
          errorMessage = 'Доступ к статистике запрещен (403).';
        } else {
          errorMessage = `Failed to fetch statistics: ${response.status} ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }
}

export default new AdminService();

