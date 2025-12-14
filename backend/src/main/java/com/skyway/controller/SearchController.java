package com.skyway.controller;

import com.skyway.dto.OneWayFLightResponse;
import com.skyway.dto.OneWayFlightRequest;
import com.skyway.dto.RoundTripFlightRequest;
import com.skyway.dto.RoundTripFlightResponse;
import com.skyway.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    private FlightService flightService;

    @PostMapping("/one-way")
    public ResponseEntity<Page<OneWayFLightResponse>> oneWaySearch(@RequestBody OneWayFlightRequest flightSearch,
                                                                   @PageableDefault(size = 10,
                                                                   sort = "id",
                                                                   direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OneWayFLightResponse> flights = flightService.getOneWayFlights(flightSearch, pageable);
        return ResponseEntity.ok(flights);
    }

    @PostMapping("/round-trip")
    public ResponseEntity<?> roundTripSearch(@RequestBody RoundTripFlightRequest flightSearch,
                                             @PageableDefault(size = 10,
                                             sort = "id",
                                             direction = Sort.Direction.DESC) Pageable pageable) {
        RoundTripFlightResponse response = flightService.getRoundTripFlights(flightSearch, pageable);
        return ResponseEntity.ok(response);
    }
}
