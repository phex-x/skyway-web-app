package com.skyway.dto;

import com.skyway.entity.SeatClass;

import java.time.LocalDate;

public class RoundTripFlightRequest {
    private String departureAirportName;
    private String arrivalAirportName;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private SeatClass seatClass;
    private int passengerCount;

    //getters
    public String getDepartureAirportName() {return departureAirportName;}
    public String getArrivalAirportName() {return arrivalAirportName;}
    public LocalDate getDepartureDate() {return departureDate;}
    public LocalDate getArrivalDate() {return arrivalDate;}
    public SeatClass getSeatClass() {return this.seatClass;}
    public int getPassengerCount() {return this.passengerCount;}

    //setters
    public void setDepartureAirportName(String departureAirportName) {
        this.departureAirportName = departureAirportName;
    }
    public void setArrivalAirportName(String arrivalAirportName) {
        this.arrivalAirportName = arrivalAirportName;
    }
    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }
    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }
    public void setSeatClass(SeatClass seatClass) {this.seatClass = seatClass;}
    public void setPassengerCount(int passengerCount) {this.passengerCount = passengerCount;}
}
