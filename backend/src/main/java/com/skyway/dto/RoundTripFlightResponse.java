package com.skyway.dto;

import java.util.List;

public class RoundTripFlightResponse {
    private List<OneWayFLightResponse> flightTo;
    private List<OneWayFLightResponse> flightBack;

    //getters
    public List<OneWayFLightResponse> getFlightTo() {return flightTo;}
    public List<OneWayFLightResponse> getFlightBack() {return flightBack;}

    //setters
    public void setFlightTo(List<OneWayFLightResponse> flightTo) {
        this.flightTo = flightTo;
    }
    public void setFlightBack(List<OneWayFLightResponse> flightBack) {
        this.flightBack = flightBack;
    }
}
