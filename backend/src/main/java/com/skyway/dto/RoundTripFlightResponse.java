package com.skyway.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public class RoundTripFlightResponse {
    private Page<OneWayFLightResponse> flightTo;
    private Page<OneWayFLightResponse> flightBack;

    //getters
    public Page<OneWayFLightResponse> getFlightTo() {return flightTo;}
    public Page<OneWayFLightResponse> getFlightBack() {return flightBack;}

    //setters
    public void setFlightTo(Page<OneWayFLightResponse> flightTo) {
        this.flightTo = flightTo;
    }
    public void setFlightBack(Page<OneWayFLightResponse> flightBack) {
        this.flightBack = flightBack;
    }
}
