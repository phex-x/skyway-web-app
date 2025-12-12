package com.skyway.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "airports")
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "iata_code")
    private String iataCode;

    @Column(name = "icao_code")
    private String icaoCode;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "timezone")
    private OffsetDateTime timezone;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longtitude")
    private Double longtitude;

    //getters
    public Long getId() {return this.id;}
    public String getIataCode() {return this.iataCode;}
    public String getIcaoCode() {return this.icaoCode;}
    public String getName() {return this.name;}
    public String getCountry() {return this.country;}
    public String getCity() {return this.city;}
    public OffsetDateTime getTimezone() {return this.timezone;}
    public Double getLatitude() {return this.latitude;}
    public Double getLongtitude() {return this.longtitude;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setIataCode(String iataCode) {this.iataCode = iataCode;}
    public void setIcaoCode(String icaoCode) {this.icaoCode = icaoCode;}
    public void setName(String name) {this.name = name;}
    public void setCountry(String country) {this.country = country;}
    public void setCity(String city) {this.city = city;}
    public void setTimezone(OffsetDateTime timezone) {this.timezone = timezone;}
    public void setLatitude(Double latitude) {this.latitude = latitude;}
    public void setLongtitude(Double longitude) {this.longtitude = longitude;}
}
