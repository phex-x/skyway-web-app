const API_URL = 'http://localhost:8080/auth'; // URL твоего Spring Boot приложения

class AuthService {
  // Регистрация
  async register(userData) {
    // Преобразуем дату в формат ISO для Java
    const formattedData = {
      ...userData,
      birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString() : null
    };

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json(); // Вернет JWTResponse
  }

  // Логин
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Login failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json(); // Вернет JWTResponse
  }

  // Сохранение токена и данных пользователя
  saveAuthData(jwtResponse) {
    localStorage.setItem('token', jwtResponse.token);
    localStorage.setItem('user', JSON.stringify({
      id: jwtResponse.id,
      email: jwtResponse.email,
      role: jwtResponse.role,
      firstName: jwtResponse.firstName,
      lastName: jwtResponse.lastName
    }));
  }

  // Получение токена
  getToken() {
    return localStorage.getItem('token');
  }

  // Получение данных пользователя
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Выход
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Проверка авторизации
  isAuthenticated() {
    return !!this.getToken();
  }

  // Добавление токена к запросам
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default new AuthService();