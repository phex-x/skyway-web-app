package com.skyway.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "flights")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number")
    private String flightNumber;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id", name = "airplane_id")
    private Airplane airplane;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id", name = "departure_airport_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id", name = "arrival_airport_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Airport arrivalAirport;

    @Column(name = "scheduled_departure")
    private LocalDateTime scheduledDeparture;

    @Column(name = "scheduled_arrival")
    private LocalDateTime scheduledArrival;

    @Column(name = "economy_seat_price")
    private double economySeatPrice;

    @Column(name = "business_seat_price")
    private double businessSeatPrice;

    @Column(name = "remaining_economy_seats")
    private int remainingEconomySeats;

    @Column(name = "booked_economy_seats")
    private int bookedEconomySeats;

    @Column(name = "remaining_business_seats")
    private int remainingBusinessSeats;

    @Column(name = "booked_business_seats")
    private int bookedBusinessSeats;

    @OneToMany(mappedBy = "flight", fetch = FetchType.LAZY)
    private List<Booking> bookings;

    //getters
    public Long getId() {return this.id; }
    public String getFlightNumber() {return this.flightNumber;}
    public Airplane getAirplane() {return this.airplane;}
    public Airport getDepartureAirport() {return this.departureAirport;}
    public Airport getArrivalAirport() {return this.arrivalAirport;}
    public LocalDateTime getScheduledDeparture() {return this.scheduledDeparture;}
    public LocalDateTime getScheduledArrival() {return this.scheduledArrival;}
    public double getEconomySeatPrice() {return this.economySeatPrice;}
    public double getBusinessSeatPrice() {return this.businessSeatPrice;}
    public int getRemainingEconomySeats() {return this.remainingEconomySeats;}
    public int getBookedEconomySeats() {return this.bookedEconomySeats;}
    public int getRemainingBusinessSeats() {return this.remainingBusinessSeats;}
    public int getBookedBusinessSeats() {return this.bookedBusinessSeats;}
    public List<Booking> getBookings() {return this.bookings;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setFlightNumber(String flightNumber) {this.flightNumber = flightNumber;}
    public void setAirplane(Airplane airplane) {this.airplane = airplane;}
    public void setDepartureAirport(Airport departureAirport) {this.departureAirport = departureAirport;}
    public void setArrivalAirport(Airport arrivalAirport) {this.arrivalAirport = arrivalAirport;}
    public void setScheduledDeparture(LocalDateTime scheduledDeparture) {
        this.scheduledDeparture = scheduledDeparture;
    }
    public void setScheduledArrival(LocalDateTime scheduledArrival) {
        this.scheduledArrival = scheduledArrival;
    }
    public void setEconomySeatPrice(double economySeatPrice) {this.economySeatPrice = economySeatPrice;}
    public void setBusinessSeatPrice(double businessSeatPrice) {
        this.businessSeatPrice = businessSeatPrice;
    }
    public void setRemainingEconomySeats(int remainingEconomySeats) {
        this.remainingEconomySeats = remainingEconomySeats;
    }
    public void setBookedEconomySeats(int bookedEconomySeats) {
        this.bookedEconomySeats = bookedEconomySeats;
    }
    public void setRemainingBusinessSeats(int remainingBusinessSeats) {
        this.remainingBusinessSeats = remainingBusinessSeats;
    }
    public void setBookedBusinessSeats(int bookedBusinessSeats) {
        this.bookedBusinessSeats = bookedBusinessSeats;
    }
    public void setBookings(List<Booking> bookings) {}
}
