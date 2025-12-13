package com.skyway.dto;

import com.skyway.entity.Passenger;

import java.util.List;

public class ManageBooking {
    private OneWayFLightResponse oneWayFLightResponse;
    private List<Passenger> passengers;

    //getters
    public OneWayFLightResponse getOneWayFLightResponse() {return oneWayFLightResponse;}
    public List<Passenger> getPassengers() {return passengers;}
}
