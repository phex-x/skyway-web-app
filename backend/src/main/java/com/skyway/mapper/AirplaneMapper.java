package com.skyway.mapper;

import com.skyway.dto.AirplaneCreate;
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
}
