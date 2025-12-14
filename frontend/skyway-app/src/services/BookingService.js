// src/services/BookingService.js
import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class BookingService {
  async createBooking(flight, passengers) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated to create booking');
    }

    // Функция для глубокой очистки объекта от циклических ссылок и undefined значений
    const cleanObject = (obj, visited = new WeakSet()) => {
      if (obj === null || obj === undefined) return null;
      if (typeof obj !== 'object') return obj;
      if (visited.has(obj)) return null; // Обнаружена циклическая ссылка
      visited.add(obj);

      if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(item, visited));
      }

      const cleaned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          // Пропускаем функции и undefined
          if (typeof value === 'function' || value === undefined) continue;
          // Рекурсивно очищаем вложенные объекты
          const cleanedValue = cleanObject(value, visited);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
      }
      return cleaned;
    };

    // Очищаем объект flight - создаем новый объект только с нужными полями
    // Извлекаем значения напрямую, избегая любых циклических ссылок
    const cleanedFlight = {
      flightId: flight?.flightId ?? null,
      flightNumber: flight?.flightNumber ?? null,
      departureTime: flight?.departureTime ?? null,
      arrivalTime: flight?.arrivalTime ?? null,
      price: flight?.price ?? null,
      seatClass: flight?.seatClass ?? null
    };

    // Добавляем airplane только если он есть и извлекаем только нужные поля
    if (flight?.airplane) {
      cleanedFlight.airplane = {
        id: flight.airplane.id ?? null,
        model: flight.airplane.model ?? null,
        registrationNumber: flight.airplane.registrationNumber ?? null
      };
      // Удаляем null значения
      Object.keys(cleanedFlight.airplane).forEach(key => {
        if (cleanedFlight.airplane[key] === null) {
          delete cleanedFlight.airplane[key];
        }
      });
      if (Object.keys(cleanedFlight.airplane).length === 0) {
        delete cleanedFlight.airplane;
      }
    }

    // Добавляем departureAirport
    if (flight?.departureAirport) {
      cleanedFlight.departureAirport = {
        id: flight.departureAirport.id ?? null,
        iataCode: flight.departureAirport.iataCode ?? null,
        icaoCode: flight.departureAirport.icaoCode ?? null,
        name: flight.departureAirport.name ?? null,
        country: flight.departureAirport.country ?? null,
        city: flight.departureAirport.city ?? null
      };
      Object.keys(cleanedFlight.departureAirport).forEach(key => {
        if (cleanedFlight.departureAirport[key] === null) {
          delete cleanedFlight.departureAirport[key];
        }
      });
      if (Object.keys(cleanedFlight.departureAirport).length === 0) {
        delete cleanedFlight.departureAirport;
      }
    }

    // Добавляем arrivalAirport
    if (flight?.arrivalAirport) {
      cleanedFlight.arrivalAirport = {
        id: flight.arrivalAirport.id ?? null,
        iataCode: flight.arrivalAirport.iataCode ?? null,
        icaoCode: flight.arrivalAirport.icaoCode ?? null,
        name: flight.arrivalAirport.name ?? null,
        country: flight.arrivalAirport.country ?? null,
        city: flight.arrivalAirport.city ?? null
      };
      Object.keys(cleanedFlight.arrivalAirport).forEach(key => {
        if (cleanedFlight.arrivalAirport[key] === null) {
          delete cleanedFlight.arrivalAirport[key];
        }
      });
      if (Object.keys(cleanedFlight.arrivalAirport).length === 0) {
        delete cleanedFlight.arrivalAirport;
      }
    }

    // Удаляем null значения из основного объекта
    Object.keys(cleanedFlight).forEach(key => {
      if (cleanedFlight[key] === null || cleanedFlight[key] === undefined) {
        delete cleanedFlight[key];
      }
    });

    // Очищаем пассажиров - извлекаем только нужные поля, игнорируя все остальное
    const cleanedPassengers = passengers.map(passenger => {
      const cleaned = {
        id: passenger?.id || null,
        firstName: passenger?.firstName || null,
        lastName: passenger?.lastName || null,
        passportNumber: passenger?.passportNumber || null,
        citizenship: passenger?.citizenship || null,
        dateOfBirth: passenger?.dateOfBirth || null,
        gender: passenger?.gender || null
      };
      // Удаляем null значения для чистоты
      Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === null || cleaned[key] === undefined) {
          delete cleaned[key];
        }
      });
      return cleaned;
    });

    // Используем ManageBooking DTO
    const requestBody = {
      oneWayFLightResponse: cleanedFlight,
      passengers: cleanedPassengers
    };

    // Проверяем, что JSON можно сериализовать
    let requestBodyString;
    try {
      requestBodyString = JSON.stringify(requestBody, (key, value) => {
        // Игнорируем функции и undefined
        if (typeof value === 'function' || value === undefined) {
          return null;
        }
        // Преобразуем Date в строку
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      
      // Проверяем, что строка валидна
      JSON.parse(requestBodyString);
    } catch (error) {
      console.error('Error serializing request body:', error);
      console.error('Request body object:', requestBody);
      console.error('Original flight object:', flight);
      console.error('Original passengers:', passengers);
      throw new Error(`Failed to serialize booking data: ${error.message}`);
    }

    const response = await fetch(`${API_URL}/book/manage-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: requestBodyString,
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Booking creation failed';
      try {
        const text = await response.text();
        if (text && text.trim()) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // Если ответ не JSON, используем текст ответа
            errorMessage = text || errorMessage;
          }
        }
      } catch (e) {
        errorMessage = `Booking creation failed: ${response.status} ${response.statusText}`;
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

  async searchBooking(bookingReference, lastName) {
    const requestBody = {
      bookingReference: bookingReference,
      name: lastName
    };

    const response = await fetch(`${API_URL}/book/search-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Booking not found';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        if (response.status === 404) {
          errorMessage = 'Booking not found';
        } else {
          errorMessage = `Search failed: ${response.status} ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async getMyBookings(page = 0, size = 10) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const url = new URL(`${API_URL}/book/my-bookings`);
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
        console.error('BookingService: Error response:', errorData);
      } catch (e) {
        const errorText = await response.text();
        console.error('BookingService: Error response text:', errorText);
        errorMessage = `Failed to fetch bookings: ${response.status} ${response.statusText}`;
      }
      console.error('BookingService: Request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString()
      });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Возвращаем полный Page объект, ProfilePage сам извлечет content
    return data;
  }

  async cancelBooking(bookingId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    // ВАЖНО: В бэкенде есть опечатка: /cancel-booking{id} вместо /cancel-booking/{id}
    const response = await fetch(`${API_URL}/book/cancel-booking/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to cancel booking';
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
        errorMessage = `Failed to cancel booking: ${response.status} ${response.statusText}`;
      }
      console.error('BookingService: Cancel booking error:', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_URL}/book/cancel-booking/${bookingId}`
      });
      throw new Error(errorMessage);
    }

    // Бэкенд возвращает пустой ответ (ResponseEntity.ok().build())
    // Проверяем, есть ли контент перед парсингом JSON
    const text = await response.text();
    if (text && text.trim()) {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Если не JSON, возвращаем true (успешная отмена)
        return true;
      }
    }
    return true;
  }
}

export default new BookingService();
