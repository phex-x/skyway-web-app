package com.skyway.dto;

import jakarta.persistence.Column;

import java.time.OffsetDateTime;

public class AirportCreate {
    private String iataCode;
    private String icaoCode;
    private String name;
    private String country;
    private String city;
    private OffsetDateTime timezone;
    private Double latitude;
    private Double longtitude;

    //getters
    public String getIataCode() {return this.iataCode;}
    public String getIcaoCode() {return this.icaoCode;}
    public String getName() {return this.name;}
    public String getCountry() {return this.country;}
    public String getCity() {return this.city;}
    public OffsetDateTime getTimezone() {return this.timezone;}
    public Double getLatitude() {return this.latitude;}
    public Double getLongtitude() {return this.longtitude;}
}
