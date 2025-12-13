package com.skyway.controller;

import com.skyway.dto.OneWayFLightResponse;
import com.skyway.dto.OneWayFlightRequest;
import com.skyway.dto.RoundTripFlightRequest;
import com.skyway.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    private FlightService flightService;

    @PostMapping("/one-way")
    public ResponseEntity<?> oneWaySearch(@RequestBody OneWayFlightRequest flightSearch) {
        List<OneWayFLightResponse> flights = flightService.getOneWayFlights(flightSearch);
        if (flights.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flightService.getOneWayFlights(flightSearch));
    }

    @PostMapping("/round-trip")
    public ResponseEntity<?> roundTripSearch(@RequestBody RoundTripFlightRequest flightSearch) {
        if (flightService.getRoundTripFlights(flightSearch) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flightService.getRoundTripFlights(flightSearch));
    }
}
