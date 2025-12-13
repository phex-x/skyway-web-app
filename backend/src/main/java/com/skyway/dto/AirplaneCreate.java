package com.skyway.dto;

import jakarta.persistence.Column;

public class AirplaneCreate {
    private String model;
    private String registrationNumber;
    private int economySeatsAmount;
    private int businessSeatsAmount;

    //getters
    public String getModel() {return this.model;}
    public String getRegistrationNumber() {return this.registrationNumber;}
    public int getEconomySeatsAmount() {return this.economySeatsAmount;}
    public int getBusinessSeatsAmount() {return this.businessSeatsAmount;}
}
