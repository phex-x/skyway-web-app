package com.skyway.service;

import com.skyway.entity.Airport;
import com.skyway.error.AirportAlreadyExists;
import com.skyway.error.AirportDoesntExists;
import com.skyway.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AirportService {
    @Autowired
    private AirportRepository airportRepository;

    public void createAirport(Airport airport) {
        if (airportRepository.existsByIcaoCode(airport.getIcaoCode())) {
            throw new AirportAlreadyExists("airport already exists");
        }
        airportRepository.save(airport);
    }

    public Airport getAirportByIcaoCode(String icaoCode) {
        if (!airportRepository.existsByIcaoCode(icaoCode)) {
            throw new AirportDoesntExists("airport doesn't exists");
        }
        return airportRepository.findByIcaoCode(icaoCode);
    }

    public void deleteAirport(Long id) {
        if (!airportRepository.existsById(id)) {
            throw new AirportDoesntExists("airport doesn't exists");
        }
        airportRepository.deleteById(id);
    }
}
