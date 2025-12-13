package com.skyway.mapper;

import com.skyway.dto.AirportCreate;
import com.skyway.dto.AirportResponse;
import com.skyway.entity.Airport;
import org.springframework.stereotype.Component;

@Component
public class AirportMapper {
    public Airport toAirport(AirportCreate airport) {
        Airport airportResult = new Airport();
        airportResult.setName(airport.getName());
        airportResult.setCountry(airport.getCountry());
        airportResult.setCity(airport.getCity());
        airportResult.setLatitude(airport.getLatitude());
        airportResult.setLongtitude(airport.getLongtitude());
        airportResult.setTimezone(airport.getTimezone());
        airportResult.setIataCode(airport.getIataCode());
        airportResult.setIcaoCode(airport.getIcaoCode());

        return airportResult;
    }

    public AirportResponse toDto(Airport airport) {
        AirportResponse airportResponse = new AirportResponse();
        airportResponse.setId(airport.getId());
        airportResponse.setName(airport.getName());
        airportResponse.setCountry(airport.getCountry());
        airportResponse.setCity(airport.getCity());
        airportResponse.setLatitude(airport.getLatitude());
        airportResponse.setLongtitude(airport.getLongtitude());
        airportResponse.setTimezone(airport.getTimezone());
        airportResponse.setIataCode(airport.getIataCode());
        airportResponse.setIcaoCode(airport.getIcaoCode());

        return airportResponse;

    }
}
