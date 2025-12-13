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

    //setters
    public void setIataCode(String iataCode) {this.iataCode = iataCode;}
    public void setIcaoCode(String icaoCode) {this.icaoCode = icaoCode;}
    public void setName(String name) {this.name = name;}
    public void setCountry(String country) {this.country = country;}
    public void setCity(String city) {this.city = city;}
    public void setTimezone(OffsetDateTime timezone) {this.timezone = timezone;}
    public void setLatitude(Double latitude) {this.latitude = latitude;}
    public void setLongtitude(Double longitude) {this.longtitude = longitude;}
}
