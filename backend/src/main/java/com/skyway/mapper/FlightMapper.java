package com.skyway.mapper;

import com.skyway.dto.FlightCreate;
import com.skyway.dto.FlightResponse;
import com.skyway.dto.OneWayFLightResponse;
import com.skyway.dto.RoundTripFlightResponse;
import com.skyway.entity.Flight;
import com.skyway.entity.SeatClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FlightMapper {
    @Autowired
    AirportMapper airportMapper;

    @Autowired
    AirplaneMapper airplaneMapper;

    public OneWayFLightResponse toOneWayResponse(Flight flight, SeatClass seatClass) {
        OneWayFLightResponse response = new OneWayFLightResponse();
        response.setFlightId(flight.getId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setAirplane(airplaneMapper.toDto(flight.getAirplane()));
        response.setDepartureAirport(airportMapper.toDto(flight.getDepartureAirport()));
        response.setArrivalAirport(airportMapper.toDto(flight.getArrivalAirport()));
        response.setDepartureTime(flight.getScheduledDeparture());
        response.setArrivalTime(flight.getScheduledArrival());
        if (seatClass.equals(SeatClass.BUSINESS)) {
            response.setPrice(flight.getBusinessSeatPrice());
        } else {
            response.setPrice(flight.getEconomySeatPrice());
        }
        response.setSeatClass(seatClass);
        return response;
    }

    public RoundTripFlightResponse toRoundTripFlightResponse(List<Flight> flightTo, List<Flight> flightBack, SeatClass seatClass) {
        RoundTripFlightResponse response = new RoundTripFlightResponse();
        response.setFlightTo(
                flightTo.stream()
                        .map(flight -> toOneWayResponse(flight, seatClass))
                        .collect(Collectors.toList())
        );
        response.setFlightBack(
                flightBack.stream()
                        .map(flight -> toOneWayResponse(flight, seatClass))
                        .collect(Collectors.toList())
        );

        return response;
    }

    public Flight toFlight(FlightCreate flightCreate) {
        Flight flight = new Flight();
        flight.setFlightNumber(flightCreate.getFlightNumber());
        flight.setAirplane(flightCreate.getAirplane());
        flight.setDepartureAirport(flightCreate.getDepartureAirport());
        flight.setArrivalAirport(flightCreate.getArrivalAirport());
        flight.setScheduledDeparture(flightCreate.getScheduledDeparture());
        flight.setScheduledArrival(flightCreate.getScheduledArrival());
        flight.setBusinessSeatPrice(flightCreate.getBusinessSeatPrice());
        flight.setBookedEconomySeats(0);
        flight.setEconomySeatPrice(flightCreate.getEconomySeatPrice());
        flight.setBookedBusinessSeats(0);
        flight.setRemainingEconomySeats(flightCreate.getRemainingEconomySeats());
        flight.setRemainingBusinessSeats(flightCreate.getRemainingBusinessSeats());

        return flight;
    }

    public FlightResponse toFlightResponse(Flight flight) {
        FlightResponse response = new FlightResponse();
        response.setId(flight.getId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setAirplane(airplaneMapper.toDto(flight.getAirplane()));
        response.setDepartureAirport(airportMapper.toDto(flight.getDepartureAirport()));
        response.setArrivalAirport(airportMapper.toDto(flight.getArrivalAirport()));
        response.setScheduledDeparture(flight.getScheduledDeparture());
        response.setScheduledArrival(flight.getScheduledArrival());
        response.setBusinessSeatPrice(flight.getBusinessSeatPrice());
        response.setBookedEconomySeats(0);
        response.setEconomySeatPrice(flight.getEconomySeatPrice());
        response.setBookedBusinessSeats(flight.getBookedBusinessSeats());
        response.setRemainingEconomySeats(flight.getRemainingBusinessSeats());
        response.setRemainingBusinessSeats(flight.getRemainingBusinessSeats());

        return response;
    }
}
