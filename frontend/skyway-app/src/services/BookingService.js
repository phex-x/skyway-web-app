// src/services/BookingService.js
import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class BookingService {
  async createBooking(flight, passengers) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated to create booking');
    }

    // Используем ManageBooking DTO
    const requestBody = {
      oneWayFLightResponse: flight,
      passengers: passengers
    };

    const response = await fetch(`${API_URL}/book/manage-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Booking creation failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Booking creation failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
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

  async getMyBookings() {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/book/my-bookings`, {
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

    return await response.json();
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
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to cancel booking: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }
}

export default new BookingService();
