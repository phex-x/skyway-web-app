package com.skyway.service;

import com.skyway.dto.*;
import com.skyway.entity.Flight;
import com.skyway.mapper.FlightMapper;
import com.skyway.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightMapper flightsMapper;

    public FlightResponse createFlight(FlightCreate flight) {
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }
        return flightsMapper.toFlightResponse(flightRepository.save(flightsMapper.toFlight(flight)));
    }

    public FlightResponse getFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return flightsMapper.toFlightResponse(flight);
    }

    public List<FlightResponse> getAllFlights() {
        return flightRepository.findAll().stream()
                .map(flight -> flightsMapper.toFlightResponse(flight))
                .collect(Collectors.toList());
    }

    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        flightRepository.delete(flight);
    }

    public List<OneWayFLightResponse> getOneWayFlights(OneWayFlightRequest oneWayFlightRequest) {
        List<Flight> flights = flightRepository.flightSearch(
                oneWayFlightRequest.getDepartureAirportName(),
                oneWayFlightRequest.getArrivalAirportName(),
                oneWayFlightRequest.getDepartureDate(),
                oneWayFlightRequest.getPassengerCount(),
                oneWayFlightRequest.getSeatClass().name()
        );

        return flights.stream()
                .map(flight -> flightsMapper.toOneWayResponse(flight, oneWayFlightRequest.getSeatClass()))
                .collect(Collectors.toList());
    }

    public RoundTripFlightResponse getRoundTripFlights(RoundTripFlightRequest roundTripFlightRequest) {
        List<Flight> flightsTo = flightRepository.flightSearch(
                roundTripFlightRequest.getDepartureAirportName(),
                roundTripFlightRequest.getArrivalAirportName(),
                roundTripFlightRequest.getDepartureDate(),
                roundTripFlightRequest.getPassengerCount(),
                roundTripFlightRequest.getSeatClass().name()
        );

        List<Flight> flightsFrom = flightRepository.flightSearch(
                roundTripFlightRequest.getArrivalAirportName(),
                roundTripFlightRequest.getDepartureAirportName(),
                roundTripFlightRequest.getArrivalDate(),
                roundTripFlightRequest.getPassengerCount(),
                roundTripFlightRequest.getSeatClass().name()
        );

        return flightsMapper.toRoundTripFlightResponse(flightsTo, flightsFrom, roundTripFlightRequest.getSeatClass());
    }
}
