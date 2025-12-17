package com.skyway.service;

import com.skyway.dto.StatisticsResponse;
import com.skyway.repository.AirplaneRepository;
import com.skyway.repository.AirportRepository;
import com.skyway.repository.FlightRepository;
import com.skyway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirportRepository airportRepository;

    public StatisticsResponse getStatistics() {
        StatisticsResponse statisticsResponse = new StatisticsResponse();
        statisticsResponse.setTotalUsers(userRepository.findAll().size());
        statisticsResponse.setTotalFlights(flightRepository.findAll().size());
        statisticsResponse.setTotalAirports(airportRepository.findAll().size());
        statisticsResponse.setTotalAirplanes(airplaneRepository.findAll().size());
        statisticsResponse.setAverageFlightDurationMinutes(flightRepository.findAverageFlightTime());

        return statisticsResponse;
    }
}
