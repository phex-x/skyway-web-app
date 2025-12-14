package com.skyway.dto;

import com.skyway.entity.*;
import java.time.LocalDate;
import java.util.List;

public class BookingResponse {
    private Long id;
    private String bookingReference;
    private FlightResponse flight;
    private UserResponseDTO user;
    private List<PassengerResponseDTO> passengers;
    private LocalDate bookingDate;
    private Status status;
    private SeatClass seatClass;

    //setters
    public void setId(Long id) {this.id = id;}
    public void setBookingReference(String bookingReference) {this.bookingReference = bookingReference;}
    public void setFlight(FlightResponse flight) {this.flight = flight;}
    public void setUser(UserResponseDTO user) {this.user = user;}
    public void setPassengers(List<PassengerResponseDTO> passengers) {
        this.passengers = passengers;
    }
    public void setBookingDate(LocalDate bookingDate) {this.bookingDate = bookingDate;}
    public void setStatus(Status status) {this.status = status;}
    public void setSeatClass(SeatClass seatClass) {this.seatClass = seatClass;}

    //getters
    public Long getId() {return id;}
    public String getBookingReference() {return bookingReference;}
    public FlightResponse getFlight() {return flight;}
    public UserResponseDTO getUser() {return user;}
    public List<PassengerResponseDTO> getPassengers() {return passengers;}
    public LocalDate getBookingDate() {return bookingDate;}
    public Status getStatus() {return status;}
    public SeatClass getSeatClass() {return seatClass;}
}
