package com.skyway.dto;

import com.skyway.entity.Airplane;
import com.skyway.entity.Airport;
import com.skyway.entity.SeatClass;

import java.time.LocalDateTime;

public class OneWayFLightResponse {
    private Long flightId;
    private String flightNumber;
    private Airplane airplane;
    private Airport departureAirport;
    private Airport arrivalAirport;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double price;
    private SeatClass seatClass;

    //getters
    public Long getFlightId() {return flightId;}
    public String getFlightNumber() {return flightNumber;}
    public Airplane getAirplane() {return airplane;}
    public Airport getDepartureAirport() {return departureAirport;}
    public Airport getArrivalAirport() {return arrivalAirport;}
    public LocalDateTime getDepartureTime() {return departureTime;}
    public LocalDateTime getArrivalTime() {return arrivalTime;}
    public double getPrice() {return price;}
    public SeatClass getSeatClass() {return seatClass;}

    //setters
    public void setFlightId(Long flightId) {this.flightId = flightId;}
    public void setFlightNumber(String flightNumber) {this.flightNumber = flightNumber;}
    public void setAirplane(Airplane airplane) {this.airplane = airplane;}
    public void setDepartureAirport(Airport departureAirport) {this.departureAirport = departureAirport;}
    public void setArrivalAirport(Airport arrivalAirport) {this.arrivalAirport = arrivalAirport;}
    public void setPrice(double price) {this.price = price;}
    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }
    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    public void setSeatClass(SeatClass seatClass) {this.seatClass = seatClass;}
}
