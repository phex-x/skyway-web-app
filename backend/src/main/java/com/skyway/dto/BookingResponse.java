package com.skyway.dto;

import com.skyway.entity.*;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class BookingResponse {
    private Long id;
    private String bookingReference;
    private Flight flight;
    private User user;
    private List<Passenger> passengers;
    private LocalDate bookingDate;
    private Status status;
    private SeatClass seatClass;

    //setters
    public void setId(Long id) {this.id = id;}
    public void setBookingReference(String bookingReference) {this.bookingReference = bookingReference;}
    public void setFlight(Flight flight) {this.flight = flight;}
    public void setUser(User user) {this.user = user;}
    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }
    public void setBookingDate(LocalDate bookingDate) {this.bookingDate = bookingDate;}
    public void setStatus(Status status) {this.status = status;}
    public void setSeatClass(SeatClass seatClass) {this.seatClass = seatClass;}
}
