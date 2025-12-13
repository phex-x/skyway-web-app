package com.skyway.mapper;

import com.skyway.dto.OneWayFLightResponse;
import com.skyway.dto.OneWayFlightRequest;
import com.skyway.dto.RoundTripFlightResponse;
import com.skyway.entity.Flight;
import com.skyway.entity.SeatClass;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FlightsMapper {
    public OneWayFLightResponse toOneWayResponse(Flight flight, SeatClass seatClass) {
        OneWayFLightResponse response = new OneWayFLightResponse();
        response.setFlightId(flight.getId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setAirplane(flight.getAirplane());
        response.setDepartureAirport(flight.getDepartureAirport());
        response.setArrivalAirport(flight.getArrivalAirport());
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
}
