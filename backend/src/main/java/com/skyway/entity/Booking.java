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
}
