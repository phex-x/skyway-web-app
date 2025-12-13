package com.skyway.controller;

import com.skyway.dto.*;
import com.skyway.error.AirplaneAlreadyExistsException;
import com.skyway.service.AirplaneService;
import com.skyway.service.AirportService;
import com.skyway.service.BookingService;
import com.skyway.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
public class StaffController {
    @Autowired
    AirportService airportService;

    @Autowired
    AirplaneService airplaneService;

    @Autowired
    FlightService flightService;

    @Autowired
    BookingService bookingService;

    @PostMapping("/airplane/add")
    public ResponseEntity<?> addAirplane(@RequestBody AirplaneCreate airplaneCreate){
        if (airplaneService.existsByCode(airplaneCreate.getRegistrationNumber())) {
            throw new AirplaneAlreadyExistsException("Airplane already exists");
        }
        airplaneService.createAirplane(airplaneCreate);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/airplane/delete/{id}")
    public ResponseEntity<?> deleteAirplane(@PathVariable("id") Long id){
        airplaneService.deleteAirplane(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/airplane/{id}")
    public ResponseEntity<?> getAirplane(@PathVariable("id") Long id){
        AirplaneResponse airplane = airplaneService.getAirplaneById(id);
        return ResponseEntity.ok().body(airplane);
    }

    @GetMapping("/airplane/get-all")
    public ResponseEntity<List<AirplaneResponse>> getAllAirplane(){
        return ResponseEntity.ok().body(airplaneService.getAllAirplanes());
    }

    @PostMapping("/airport/create")
    public ResponseEntity<?> createAirport(@RequestBody AirportCreate airportCreate){
        return ResponseEntity.ok().body(airportService.createAirport(airportCreate));
    }

    @GetMapping("/airport/{id}")
    public ResponseEntity<?> getAirport(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(airportService.getAirportById(id));
    }

    @DeleteMapping("/airport/delete/{id}")
    public ResponseEntity<?> deleteAirport(@PathVariable("id") Long id){
        airportService.deleteAirport(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/airport/get-all")
    public ResponseEntity<List<AirportResponse>> getAllAirport(){
        return ResponseEntity.ok().body(airportService.getAllAirports());
    }

    @GetMapping("/booking/{id}")
    public ResponseEntity<?> getBooking(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(bookingService.getBookingById(id));
    }

    @GetMapping("/booking/get-all")
    public ResponseEntity<List<BookingResponse>> getAllBooking(){
        return ResponseEntity.ok().body(bookingService.getAllBookings());
    }

    @PostMapping("/booking/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable("id") Long id){
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/booking/delete/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable("id") Long id){
        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/flight/create")
    public ResponseEntity<?> createFlight(@RequestBody FlightCreate flightCreate){
        return ResponseEntity.ok().body(flightService.createFlight(flightCreate));
    }

    @GetMapping("/flight/{id}")
    public ResponseEntity<?> getFlight(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(flightService.getFlight(id));
    }

    @GetMapping("/flight/get-all")
    public ResponseEntity<List<FlightResponse>> getAllFlight(){
        return ResponseEntity.ok().body(flightService.getAllFlights());
    }

    @DeleteMapping("/flight/delete/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable("id") Long id){
        flightService.deleteFlight(id);
        return ResponseEntity.ok().build();
    }
}
