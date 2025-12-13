package com.skyway.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "airplanes")
public class Airplane {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model")
    private String model;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    @Column(name = "economy_seats_amount")
    private int economySeatsAmount;

    @Column(name = "business_seats_amount")
    private int businessSeatsAmount;

    @OneToMany(mappedBy = "airplane", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Flight> flights;

    //getters
    public Long getId() {return this.id;}
    public String getModel() {return this.model;}
    public String getRegistrationNumber() {return this.registrationNumber;}
    public int getEconomySeatsAmount() { return this.economySeatsAmount; }
    public int getBusinessSeatsAmount() { return this.businessSeatsAmount; }

    //setters
    public void setId(Long id) { this.id = id; }
    public void setModel(String model) { this.model = model; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public void setEconomySeatsAmount(int economySeatsAmount) {
        this.economySeatsAmount = economySeatsAmount;
    }
    public void setBusinessSeatsAmount(int businessSeatsAmount) {this.businessSeatsAmount = businessSeatsAmount; }
}

