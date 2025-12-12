package com.skyway.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number")
    private String flightNumber;

    @ManyToOne
    @JoinColumn(referencedColumnName = "airplane_id")
    private Airplane airplane;

    @ManyToOne
    @JoinColumn(referencedColumnName = "airport_id", name = "departure_airport")
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(referencedColumnName = "airport_name", name = "arrival_airport")
    private Airport arrivalAirport;

    @Column(name = "scheduled_departure")
    private LocalDateTime scheduledDeparture;

    @Column(name = "scheduled_arrival")
    private LocalDateTime scheduledArrival;

    @Column(name = "economy_seat_price")
    private double economySeatPrice;

    @Column(name = "business_seat_price")
    private double businessSeatPrice;

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
}
