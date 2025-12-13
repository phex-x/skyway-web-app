// src/services/FlightService.js
import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class FlightService {
  async searchOneWayFlights(searchParams) {
    // Форматируем дату в формат YYYY-MM-DD для Java LocalDate
    const formatDate = (dateString) => {
      if (!dateString) return null;
      // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // Иначе конвертируем
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const requestBody = {
      departureAirportName: searchParams.departure,
      arrivalAirportName: searchParams.arrival,
      departureDate: formatDate(searchParams.departureDate),
      seatClass: searchParams.seatClass || 'ECONOMY',
      passengerCount: searchParams.passengerCount || 1
    };

    const response = await fetch(`${API_URL}/search/one-way`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Flight search failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Flight search failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async searchRoundTripFlights(searchParams) {
    // Форматируем дату в формат YYYY-MM-DD для Java LocalDate
    const formatDate = (dateString) => {
      if (!dateString) return null;
      // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // Иначе конвертируем
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const requestBody = {
      departureAirportName: searchParams.departure,
      arrivalAirportName: searchParams.arrival,
      departureDate: formatDate(searchParams.departureDate),
      arrivalDate: formatDate(searchParams.returnDate),
      seatClass: searchParams.seatClass || 'ECONOMY',
      passengerCount: searchParams.passengerCount || 1
    };

    const response = await fetch(`${API_URL}/search/round-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Flight search failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Flight search failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }
}

export default new FlightService();

