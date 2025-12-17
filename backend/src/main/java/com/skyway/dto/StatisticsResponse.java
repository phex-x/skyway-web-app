package com.skyway.dto;

public class StatisticsResponse {
    private int TotalUsers;
    private int TotalAirports;
    private int TotalFlights;
    private int TotalAirplanes;
    private double AverageFlightDurationMinutes;

    //setters
    public void setTotalUsers(int totalUsers) {
        TotalUsers = totalUsers;
    }
    public void setTotalAirports(int totalAirports) {
        TotalAirports = totalAirports;
    }
    public void setTotalFlights(int totalFlights) {
        TotalFlights = totalFlights;
    }
    public void setTotalAirplanes(int totalAirplanes) {
        TotalAirplanes = totalAirplanes;
    }
    public void setAverageFlightDurationMinutes(double averageFlightDurationMinutes) {
        AverageFlightDurationMinutes = averageFlightDurationMinutes;
    }

    //getters
    public int getTotalUsers() {
        return TotalUsers;
    }
    public int getTotalAirports() {
        return TotalAirports;
    }
    public int getTotalFlights() {
        return TotalFlights;
    }
    public int getTotalAirplanes() {
        return TotalAirplanes;
    }
    public double getAverageFlightDurationMinutes() {
        return AverageFlightDurationMinutes;
    }
}
