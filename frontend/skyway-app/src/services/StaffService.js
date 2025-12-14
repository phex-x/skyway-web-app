// src/services/StaffService.js
import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class StaffService {
  // Airplane methods
  async getAllAirplanes(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const url = new URL(`${API_URL}/staff/airplane/get-all`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch airplanes';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch airplanes: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('StaffService: getAllAirplanes response:', data);
    // Возвращаем полный Page объект
    return data;
  }

  async getAirplane(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/airplane/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch airplane';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch airplane: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async createAirplane(airplaneData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    console.log('StaffService: Creating airplane with data:', airplaneData);
    console.log('StaffService: JSON stringified:', JSON.stringify(airplaneData));

    const response = await fetch(`${API_URL}/staff/airplane/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airplaneData),
      credentials: 'omit',
    });

    console.log('StaffService: Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to create airplane';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to create airplane: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Бэкенд возвращает пустой ответ (ResponseEntity.ok().build())
    // Проверяем, есть ли контент перед парсингом JSON
    const text = await response.text();
    if (text && text.trim()) {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Если не JSON, возвращаем null
        return null;
      }
    }
    return null;
  }

  async deleteAirplane(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/airplane/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete airplane';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to delete airplane: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  // Airport methods
  async getAllAirports(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const url = new URL(`${API_URL}/staff/airport/get-all`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch airports';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch airports: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('StaffService: getAllAirports response:', data);
    // Возвращаем полный Page объект
    return data;
  }

  async getAirport(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/airport/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch airport';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch airport: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async createAirport(airportData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    console.log('StaffService: Creating airport with data:', airportData);
    console.log('StaffService: JSON stringified:', JSON.stringify(airportData));

    const response = await fetch(`${API_URL}/staff/airport/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airportData),
      credentials: 'omit',
    });

    console.log('StaffService: Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to create airport';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to create airport: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async deleteAirport(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/airport/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete airport';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to delete airport: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  // Flight methods
  async getAllFlights(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const url = new URL(`${API_URL}/staff/flight/get-all`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch flights';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch flights: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('StaffService: getAllFlights response:', data);
    // Возвращаем полный Page объект
    return data;
  }

  async getFlight(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/flight/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch flight';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch flight: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async createFlight(flightData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/flight/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flightData),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create flight';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to create flight: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Безопасно парсим ответ, так как могут быть циклические ссылки
    const text = await response.text();
    if (text && text.trim()) {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Если парсинг не удался, но запрос успешен, рейс все равно создан
        console.warn('Failed to parse flight response JSON:', e);
        return null;
      }
    }
    return null;
  }

  async deleteFlight(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    // В бэкенде опечатка: /flught/delete вместо /flight/delete
    const response = await fetch(`${API_URL}/staff/flight/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete flight';
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (e) {
        errorMessage = `Failed to delete flight: ${response.status} ${response.statusText}`;
      }
      console.error('StaffService: Delete flight error:', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_URL}/staff/flight/delete/${id}`
      });
      throw new Error(errorMessage);
    }

    // Бэкенд возвращает пустой ответ (ResponseEntity.ok().build())
    // Проверяем статус ответа
    if (response.status === 200 || response.status === 204) {
      return true;
    }
    
    return true;
  }

  // Booking methods
  async getAllBookings(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const url = new URL(`${API_URL}/staff/booking/get-all`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch bookings';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch bookings: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('StaffService: getAllBookings response:', data);
    // Возвращаем полный Page объект
    return data;
  }

  async getBooking(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/booking/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch booking';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch booking: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async cancelBooking(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/booking/cancel/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to cancel booking';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to cancel booking: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }

  async deleteBooking(id) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/staff/booking/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete booking';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to delete booking: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }
}

export default new StaffService();

