package com.skyway.dto;

import com.skyway.entity.Flight;
import jakarta.persistence.Column;

import java.time.OffsetDateTime;
import java.util.List;

public class AirportResponse {
    private Long id;
    private String iataCode;
    private String icaoCode;
    private String name;
    private String country;
    private String city;
    private OffsetDateTime timezone;
    private Double latitude;
    private Double longtitude;

    //setters
    public void setId(Long id) {this.id = id;}
    public void setIataCode(String iataCode) {this.iataCode = iataCode;}
    public void setIaoCode(String icaoCode) {this.icaoCode = icaoCode;}
    public void setName(String name) {this.name = name;}
    public void setCountry(String country) {this.country = country;}
    public void setCity(String city) {this.city = city;}
    public void setTimezone(OffsetDateTime timezone) {this.timezone = timezone;}
    public void setLatitude(Double latitude) {this.latitude = latitude;}
    public void setLongtitude(Double longitude) {this.longtitude = longitude;}
}
