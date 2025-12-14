package com.skyway.dto;

import com.skyway.entity.SeatClass;
import com.skyway.entity.SortBy;

import java.time.LocalDate;

public class RoundTripFlightRequest {
    private String departureAirportName;
    private String arrivalAirportName;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private SeatClass seatClass;
    private int passengerCount;
    private SortBy sortBy = SortBy.PRICE_ASC;

    //getters
    public String getDepartureAirportName() {return departureAirportName;}
    public String getArrivalAirportName() {return arrivalAirportName;}
    public LocalDate getDepartureDate() {return departureDate;}
    public LocalDate getArrivalDate() {return arrivalDate;}
    public SeatClass getSeatClass() {return this.seatClass;}
    public int getPassengerCount() {return this.passengerCount;}
    public SortBy getSortBy() {return this.sortBy;}

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
    public void setSortBy(SortBy sortBy) {this.sortBy = sortBy;}
}
