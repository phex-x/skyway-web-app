package com.skyway.dto;

import java.time.LocalDateTime;

public class FlightResponse {
    private Long id;
    private String flightNumber;
    private AirplaneResponse airplane;
    private AirportResponse departureAirport;
    private AirportResponse arrivalAirport;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime scheduledArrival;
    private double economySeatPrice;
    private double businessSeatPrice;
    private int remainingEconomySeats;
    private int bookedEconomySeats;
    private int remainingBusinessSeats;
    private int bookedBusinessSeats;

    //setters
    public void setId(Long id) {this.id = id;}
    public void setFlightNumber(String flightNumber) {this.flightNumber = flightNumber;}
    public void setAirplane(AirplaneResponse airplane) {this.airplane = airplane;}
    public void setDepartureAirport(AirportResponse departureAirport) {
        this.departureAirport = departureAirport;
    }
    public void setArrivalAirport(AirportResponse arrivalAirport) { this.arrivalAirport = arrivalAirport; }
    public void setScheduledDeparture(LocalDateTime scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }
    public void setScheduledArrival(LocalDateTime scheduledArrival) { this.scheduledArrival = scheduledArrival; }
    public void setEconomySeatPrice(double economySeatPrice) { this.economySeatPrice = economySeatPrice; }
    public void setBusinessSeatPrice(double businessSeatPrice) { this.businessSeatPrice = businessSeatPrice; }
    public void setRemainingEconomySeats(int remainingEconomySeats) { this.remainingEconomySeats = remainingEconomySeats; }
    public void setBookedEconomySeats(int bookedEconomySeats) {
        this.bookedEconomySeats = bookedEconomySeats;
    }
    public void setRemainingBusinessSeats(int remainingBusinessSeats) {
        this.remainingBusinessSeats = remainingBusinessSeats;
    }
    public void setBookedBusinessSeats(int bookedBusinessSeats) {
        this.bookedBusinessSeats = bookedBusinessSeats;
    }

    //getters
    public Long getId() { return id; }
    public String getFlightNumber() { return flightNumber; }
    public AirplaneResponse getAirplane() { return airplane; }
    public AirportResponse getDepartureAirport() { return departureAirport; }
    public AirportResponse getArrivalAirport() { return arrivalAirport; }
    public LocalDateTime getScheduledDeparture() { return scheduledDeparture; }
    public LocalDateTime getScheduledArrival() { return scheduledArrival; }
    public double getEconomySeatPrice() { return economySeatPrice; }
    public double getBusinessSeatPrice() { return businessSeatPrice; }
    public int getRemainingEconomySeats() { return remainingEconomySeats; }

}
