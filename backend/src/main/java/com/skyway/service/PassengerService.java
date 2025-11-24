package com.skyway.service;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.Passenger;
import com.skyway.error.PassengerAlreadyExistsException;
import com.skyway.error.PassengerNotFoundException;
import com.skyway.mapper.PassengerMapper;
import com.skyway.repository.PassengerRepository;
import org.springframework.stereotype.Service;

@Service
public class PassengerService {
    private final PassengerRepository passengerRepository;
    private final PassengerMapper passengerMapper;

    public PassengerService(PassengerRepository passengerRepository, PassengerMapper passengerMapper) {
        this.passengerRepository = passengerRepository;
        this.passengerMapper = passengerMapper;
    }

    public PassengerResponseDTO createPassenger(PassengerCreateRequestDTO passengerCreateRequestDTO) {
        if (passengerRepository.findByUser(passengerCreateRequestDTO.getUser()).isPresent()) {
            throw new PassengerAlreadyExistsException("passenger already exists");
        }
        Passenger passenger = passengerMapper.toPassenger(passengerCreateRequestDTO);
        return passengerMapper.toPassengerResponseDTO(passengerRepository.save(passenger));
    }

    public PassengerResponseDTO getPassengerByPassengerId(Long passengerId) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new PassengerNotFoundException("Passenger not found Exception"));
        return passengerMapper.toPassengerResponseDTO(passenger);
    }

    public void deletePassengerById(Long passengerId) {
        passengerRepository.deleteById(passengerId);
    }
}
