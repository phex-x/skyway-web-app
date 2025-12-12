package com.skyway.controller;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.Passenger;
import com.skyway.entity.User;
import com.skyway.mapper.PassengerMapper;
import com.skyway.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private PassengerService passengerService;

    @Autowired
    private PassengerMapper passengerMapper;


    @PostMapping("/passenger/add")
    public ResponseEntity<?> createNewPassenger(PassengerCreateRequestDTO passengerCreateDTO) {
        Passenger passenger = passengerMapper.toPassenger(passengerCreateDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(passengerMapper.toPassengerResponseDTO(passenger));
    }

    @DeleteMapping("/passenger/delete/{id}")
    public ResponseEntity<?> deletePassenger(@PathVariable("id") Long id) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        assert user != null;
        passengerService.deletePassengerById(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllPassengers")
    public ResponseEntity<?> getAllPassengers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        List<PassengerResponseDTO> passengers = passengerService.getAllPassengers();

        return new ResponseEntity<>(passengers, HttpStatus.OK);
    }
}
