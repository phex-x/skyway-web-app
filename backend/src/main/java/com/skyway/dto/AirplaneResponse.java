package com.skyway.dto;

import com.skyway.entity.Flight;

import java.util.List;

public class AirplaneResponse {
    private Long id;
    private String model;
    private String registrationNumber;
    private int economySeatsAmount;
    private int businessSeatsAmount;
    private List<Flight> flights;

    //setters
    public void setId(Long id) {this.id = id;}
    public void setModel(String model) {this.model = model;}
    public void setRegistrationNumber(String registrationNumber) {this.registrationNumber = registrationNumber;}
    public void setEconomySeatsAmount(int economySeatsAmount) {
        this.economySeatsAmount = economySeatsAmount;
    }
    public void setBusinessSeatsAmount(int businessSeatsAmount) {
        this.businessSeatsAmount = businessSeatsAmount;
    }
    public void setFlights(List<Flight> flights) {this.flights = flights;}
}
