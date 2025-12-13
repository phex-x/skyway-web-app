package com.skyway.service;

import com.skyway.dto.OneWayFLightResponse;
import com.skyway.dto.OneWayFlightRequest;
import com.skyway.dto.RoundTripFlightRequest;
import com.skyway.dto.RoundTripFlightResponse;
import com.skyway.entity.Flight;
import com.skyway.mapper.FlightsMapper;
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
    private FlightsMapper flightsMapper;

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

    public List<OneWayFLightResponse> getOneWayFlights(OneWayFlightRequest oneWayFlightRequest) {
        List<Flight> flights = flightRepository.flightSearch(
                oneWayFlightRequest.getDepartureAirportName(),
                oneWayFlightRequest.getArrivalAirportName(),
                oneWayFlightRequest.getDepartureDate(),
                oneWayFlightRequest.getPassengerCount(),
                oneWayFlightRequest.getSeatClass()
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
                roundTripFlightRequest.getSeatClass()
        );

        List<Flight> flightsFrom = flightRepository.flightSearch(
                roundTripFlightRequest.getArrivalAirportName(),
                roundTripFlightRequest.getDepartureAirportName(),
                roundTripFlightRequest.getArrivalDate(),
                roundTripFlightRequest.getPassengerCount(),
                roundTripFlightRequest.getSeatClass()
        );

        return flightsMapper.toRoundTripFlightResponse(flightsTo, flightsFrom, roundTripFlightRequest.getSeatClass());
    }
}
