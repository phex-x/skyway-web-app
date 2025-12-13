package com.skyway.dto;

import com.skyway.entity.Airplane;
import com.skyway.entity.Airport;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

public class FlightCreate {
    private String flightNumber;
    private Airplane airplane;
    private Airport departureAirport;
    private Airport arrivalAirport;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime scheduledArrival;
    private double economySeatPrice;
    private double businessSeatPrice;
    private int remainingEconomySeats;
    private int remainingBusinessSeats;

    //getters
    public String getFlightNumber() {return flightNumber;}
    public Airplane getAirplane() {return airplane;}
    public Airport getDepartureAirport() {return departureAirport;}
    public Airport getArrivalAirport() {return arrivalAirport;}
    public LocalDateTime getScheduledDeparture() {return scheduledDeparture;}
    public LocalDateTime getScheduledArrival() {return scheduledArrival;}
    public double getEconomySeatPrice() {return economySeatPrice;}
    public double getBusinessSeatPrice() {return businessSeatPrice;}
    public int getRemainingEconomySeats() {return remainingEconomySeats;}
    public int getRemainingBusinessSeats() {return remainingBusinessSeats;}
}
