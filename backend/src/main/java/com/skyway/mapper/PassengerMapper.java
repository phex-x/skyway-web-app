package com.skyway.mapper;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.Passenger;
import com.skyway.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class PassengerMapper {
    public Passenger toPassenger(PassengerCreateRequestDTO passengerCreateRequestDTO, User user) {
        Passenger passenger = new Passenger();
        passenger.setFirstName(passengerCreateRequestDTO.getFirstName());
        passenger.setLastName(passengerCreateRequestDTO.getLastName());
        passenger.setUser(user);
        passenger.setPassportNumber(passengerCreateRequestDTO.getPassportNumber());
        passenger.setCitizenship(passengerCreateRequestDTO.getCitizenship());
        passenger.setDateOfBirth(passengerCreateRequestDTO.getBirthday());
        passenger.setGender(passengerCreateRequestDTO.getGender());
        passenger.setBonusMiles(BigDecimal.ZERO);
        passenger.setCreatedAt(LocalDateTime.now());
        return passenger;
    }

    public PassengerResponseDTO toPassengerResponseDTO(Passenger passenger) {
        PassengerResponseDTO passengerResponseDTO = new PassengerResponseDTO();
        passengerResponseDTO.setId(passenger.getId());
        passengerResponseDTO.setFirstName(passenger.getFirstName());
        passengerResponseDTO.setLastName(passenger.getLastName());
        passengerResponseDTO.setUser(passenger.getUser());
        passengerResponseDTO.setPassportNumber(passenger.getPassportNumber());
        passengerResponseDTO.setCitizenship(passenger.getCitizenship());
        passengerResponseDTO.setDateOfBirth(passenger.getDateOfBirth());
        passengerResponseDTO.setGender(passenger.getGender());
        passengerResponseDTO.setBonusMiles(passenger.getBonusMiles());
        passengerResponseDTO.setCreatedAt(passenger.getCreatedAt());
        return passengerResponseDTO;
    }
}
