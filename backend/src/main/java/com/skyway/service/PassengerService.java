package com.skyway.service;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.Passenger;
import com.skyway.entity.User;
import com.skyway.error.PassengerAlreadyExistsException;
import com.skyway.error.PassengerNotFoundException;
import com.skyway.mapper.PassengerMapper;
import com.skyway.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PassengerService {
    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private PassengerMapper passengerMapper;

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

    public List<PassengerResponseDTO> getAllPassengers() {
        List<Passenger> passengers = passengerRepository.findAll();
        List<PassengerResponseDTO> passengerResponseDTOS = new ArrayList<>();

        for (Passenger passenger : passengers) {
            passengerResponseDTOS.add(passengerMapper.toPassengerResponseDTO(passenger));
        }
        return passengerResponseDTOS;
    }

    public void deletePassengerById(Long passengerId) {
        passengerRepository.deleteById(passengerId);
    }
}
