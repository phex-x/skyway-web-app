package com.skyway.service;

import com.skyway.dto.*;
import com.skyway.entity.Flight;
import com.skyway.entity.SeatClass;
import com.skyway.mapper.FlightMapper;
import com.skyway.repository.FlightRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Page<FlightResponse> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable).map(flight -> flightsMapper.toFlightResponse(flight));
    }

    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getBookings() != null && !flight.getBookings().isEmpty()) {
            throw new RuntimeException("Cannot delete flight: there are existing bookings for this flight");
        }

        flightRepository.delete(flight);
    }

    public Page<OneWayFLightResponse> getOneWayFlights(OneWayFlightRequest request, Pageable pageable) {
        Pageable sortedPageable = createSortedPageable(pageable, request);

        Page<Flight> flights = flightRepository.flightSearch(
                request.getDepartureAirportName(),
                request.getArrivalAirportName(),
                request.getDepartureDate(),
                request.getPassengerCount(),
                request.getSeatClass().name(),
                sortedPageable
        );

        return flights.map(flight ->
                flightsMapper.toOneWayResponse(flight, request.getSeatClass())
        );
    }

    private Pageable createSortedPageable(Pageable pageable, OneWayFlightRequest request) {
        Sort sort;

        switch (request.getSortBy()) {
            case PRICE_DESC:
                String priceFieldDesc = request.getSeatClass() == SeatClass.BUSINESS ?
                        "businessSeatPrice" : "economySeatPrice";
                sort = Sort.by(Sort.Direction.DESC, priceFieldDesc);
                break;

            case DEPARTURE_ASC:
                sort = Sort.by(Sort.Direction.ASC, "scheduledDeparture");
                break;

            case DEPARTURE_DESC:
                sort = Sort.by(Sort.Direction.DESC, "scheduledDeparture");
                break;

            case PRICE_ASC:
            default:
                String priceFieldAsc = request.getSeatClass() == SeatClass.BUSINESS ?
                        "businessSeatPrice" : "economySeatPrice";
                sort = Sort.by(Sort.Direction.ASC, priceFieldAsc);
                break;
        }

        return org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
    }

    public RoundTripFlightResponse getRoundTripFlights(RoundTripFlightRequest request, Pageable pageable) {
        Pageable pageableTo = createSortedPageable(pageable, request);

        Pageable pageableFrom = createSortedPageable(pageable, request);

        Page<Flight> flightsTo = flightRepository.flightSearch(
                request.getDepartureAirportName(),
                request.getArrivalAirportName(),
                request.getDepartureDate(),
                request.getPassengerCount(),
                request.getSeatClass().name(),
                pageableTo
        );

        // Поиск рейсов "обратно"
        Page<Flight> flightsFrom = flightRepository.flightSearch(
                request.getArrivalAirportName(),
                request.getDepartureAirportName(),
                request.getArrivalDate(),
                request.getPassengerCount(),
                request.getSeatClass().name(),
                pageableFrom
        );

        return flightsMapper.toRoundTripFlightResponse(flightsTo, flightsFrom, request.getSeatClass());
    }

    private Pageable createSortedPageable(Pageable pageable, RoundTripFlightRequest request) {
        Sort sort;

        switch (request.getSortBy()) {
            case PRICE_DESC:
                String priceFieldDesc = request.getSeatClass() == SeatClass.BUSINESS ?
                        "businessSeatPrice" : "economySeatPrice";
                sort = Sort.by(Sort.Direction.DESC, priceFieldDesc);
                break;

            case DEPARTURE_ASC:
                sort = Sort.by(Sort.Direction.ASC, "scheduledDeparture");
                break;

            case DEPARTURE_DESC:
                sort = Sort.by(Sort.Direction.DESC, "scheduledDeparture");
                break;

            case PRICE_ASC:
            default:
                String priceFieldAsc = request.getSeatClass() == SeatClass.BUSINESS ?
                        "businessSeatPrice" : "economySeatPrice";
                sort = Sort.by(Sort.Direction.ASC, priceFieldAsc);
                break;
        }

        return org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
    }
}
