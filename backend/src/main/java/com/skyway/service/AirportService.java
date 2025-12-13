package com.skyway.service;

import com.skyway.dto.AirportCreate;
import com.skyway.dto.AirportResponse;
import com.skyway.entity.Airport;
import com.skyway.error.AirportAlreadyExists;
import com.skyway.error.AirportDoesntExists;
import com.skyway.mapper.AirportMapper;
import com.skyway.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportService {
    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private AirportMapper airportMapper;

    public AirportResponse createAirport(AirportCreate airportCreate) {
        Airport airport = airportMapper.toAirport(airportCreate);
        if (airportRepository.existsByIcaoCode(airportCreate.getIcaoCode())) {
            throw new AirportAlreadyExists("airport already exists");
        }
        airportRepository.save(airport);

        return airportMapper.toDto(airport);
    }

    public AirportResponse getAirportById(Long id) {
        return airportMapper.toDto(airportRepository.findById(id)
        .orElseThrow(() -> new AirportDoesntExists("airport not found")));
    }

    public List<AirportResponse> getAllAirports() {
        return airportRepository.findAll().stream()
                .map(airport -> airportMapper.toDto(airport))
                .collect(Collectors.toList());
    }

    public void deleteAirport(Long id) {
        if (!airportRepository.existsById(id)) {
            throw new AirportDoesntExists("airport doesn't exists");
        }
        airportRepository.deleteById(id);
    }
}
