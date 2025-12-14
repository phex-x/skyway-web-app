package com.skyway.controller;

import com.skyway.dto.PassengerCreateRequestDTO;
import com.skyway.dto.PassengerResponseDTO;
import com.skyway.entity.User;
import com.skyway.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    @PostMapping("/passenger/add")
    public ResponseEntity<?> createNewPassenger(@RequestBody PassengerCreateRequestDTO passengerCreateDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();
        assert user != null;
        PassengerResponseDTO passenger = passengerService.createPassenger(passengerCreateDTO, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(passenger);
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
    public ResponseEntity<Page<PassengerResponseDTO>> getAllPassengers(@PageableDefault(
            size = 10, sort = "id", direction = Sort.Direction.DESC
    ) Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        Page<PassengerResponseDTO> passengers = passengerService.getAllPassengers(pageable);

        return new ResponseEntity<>(passengers, HttpStatus.OK);
    }
}
