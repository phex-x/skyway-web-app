package com.skyway.mapper;

import com.skyway.dto.AirplaneCreate;
import com.skyway.dto.AirplaneResponse;
import com.skyway.entity.Airplane;
import org.springframework.stereotype.Component;

@Component
public class AirplaneMapper {
    public Airplane toAirplane(AirplaneCreate airplaneCreate) {
        Airplane airplane = new Airplane();
        airplane.setModel(airplaneCreate.getModel());
        airplane.setRegistrationNumber(airplaneCreate.getRegistrationNumber());
        airplane.setEconomySeatsAmount(airplaneCreate.getEconomySeatsAmount());
        airplane.setBusinessSeatsAmount(airplaneCreate.getBusinessSeatsAmount());

        return airplane;
    }

    public AirplaneResponse toDto(Airplane airplane) {
        AirplaneResponse airplaneResponse = new AirplaneResponse();
        airplaneResponse.setId(airplane.getId());
        airplaneResponse.setModel(airplane.getModel());
        airplaneResponse.setRegistrationNumber(airplane.getRegistrationNumber());
        airplaneResponse.setBusinessSeatsAmount(airplane.getBusinessSeatsAmount());
        airplaneResponse.setEconomySeatsAmount(airplane.getEconomySeatsAmount());
        airplaneResponse.setFlights(airplane.getFlights());

        return airplaneResponse;
    }
}
