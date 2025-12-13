// src/services/PassengerService.js
import authService from './AuthService';

const API_URL = 'http://localhost:8080';

class PassengerService {
  async createPassenger(passengerData) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated to create passenger');
    }

    const response = await fetch(`${API_URL}/user/passenger/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passengerData),
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create passenger';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to create passenger: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async getAllPassengers() {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/user/getAllPassengers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch passengers';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to fetch passengers: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async deletePassenger(passengerId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('User must be authenticated');
    }

    const response = await fetch(`${API_URL}/user/passenger/delete/${passengerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete passenger';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Failed to delete passenger: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  }
}

export default new PassengerService();

