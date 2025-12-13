package com.skyway.dto;

import java.time.OffsetDateTime;

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
    public void setIcaoCode(String icaoCode) {this.icaoCode = icaoCode;}
    public void setName(String name) {this.name = name;}
    public void setCountry(String country) {this.country = country;}
    public void setCity(String city) {this.city = city;}
    public void setTimezone(OffsetDateTime timezone) {this.timezone = timezone;}
    public void setLatitude(Double latitude) {this.latitude = latitude;}
    public void setLongtitude(Double longitude) {this.longtitude = longitude;}

    //getters
    public Long getId() {return id;}
    public String getIataCode() {return iataCode;}
    public String getIcaoCode() {return icaoCode;}
    public String getName() {return name;}
    public String getCountry() {return country;}
    public String getCity() {return city;}
    public OffsetDateTime getTimezone() {return timezone;}
    public Double getLatitude() {return latitude;}
    public Double getLongtitude() {return longtitude;}
}
