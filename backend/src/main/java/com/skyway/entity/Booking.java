package com.skyway.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference")
    private String bookingReference;

    @OneToOne
    @JoinColumn(referencedColumnName = "flight_id")
    private Flight flight;

    @ManyToOne
    @JoinColumn(referencedColumnName = "user_id")
    private User user;

    @ManyToMany
    private List<Passenger> passengers;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "status")
    private Status status;

    @Column(name = "seat_class")
    private SeatClass seatClass;

    @Column(name = "number_of_passengers")
    private int numberOfPassengers;

    //getters
    public Long getId() {return this.id; }
    public String getBookingReference() {return this.bookingReference; }
    public Flight getFlight() {return this.flight; }
    public User getUser() {return this.user; }
    public List<Passenger> getPassengers() {return this.passengers; }
    public LocalDate getBookingDate() {return this.bookingDate; }
    public Status getStatus() {return this.status; }
    public SeatClass getSeatClass() {return this.seatClass; }
    public int getNumberOfPassengers() {return this.numberOfPassengers; }

    //setters
    public void setId(Long id) { this.id = id; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public void setFlight(Flight flight) { this.flight = flight; }
    public void setUser(User user) { this.user = user; }
    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public void setStatus(Status status) { this.status = status; }
    public void setSeatClass(SeatClass seatClass) { this.seatClass = seatClass; }
    public void setNumberOfPassengers(int numberOfPassengers) {
        this.numberOfPassengers = numberOfPassengers;
    }
}
