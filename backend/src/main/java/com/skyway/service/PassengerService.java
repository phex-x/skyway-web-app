package com.skyway.service;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.Passenger;
import com.skyway.entity.User;
import com.skyway.error.PassengerAlreadyExistsException;
import com.skyway.error.PassengerNotFoundException;
import com.skyway.mapper.PassengerMapper;
import com.skyway.repository.PassengerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PassengerService {
    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private PassengerMapper passengerMapper;

    @Transactional
    public PassengerResponseDTO createPassenger(PassengerCreateRequestDTO passengerCreateRequestDTO, User user) {
        if (user.getPassengers().contains(passengerCreateRequestDTO)) {
            throw new PassengerAlreadyExistsException("passenger already exists");
        }
        Passenger passenger = passengerMapper.toPassenger(passengerCreateRequestDTO, user);
        return passengerMapper.toPassengerResponseDTO(passengerRepository.save(passenger));
    }

    public PassengerResponseDTO getPassengerById(Long id) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new PassengerNotFoundException("Passenger not found Exception"));
        return passengerMapper.toPassengerResponseDTO(passenger);
    }

    public Page<PassengerResponseDTO> getAllPassengers(Pageable pageable) {
        Page<Passenger> passengers = passengerRepository.findAll(pageable);
        return passengers.map(passengerMapper::toPassengerResponseDTO);
    }

    public void deletePassengerById(Long passengerId) {
        passengerRepository.deleteById(passengerId);
    }
}
