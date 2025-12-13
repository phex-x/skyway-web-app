package com.skyway.service;

import com.skyway.entity.Flight;
import com.skyway.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    public void createFlight(Flight flight) {
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }
        flightRepository.save(flight);
    }

    public Flight getFlight(Long id) {
        Flight flight = flightRepository.findById(id)

                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return flight;
    }

    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        flightRepository.delete(flight);
    }
}
