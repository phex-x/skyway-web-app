package com.skyway.controller;

import com.skyway.dto.BookingResponse;
import com.skyway.dto.BookingSearch;
import com.skyway.dto.ManageBooking;
import com.skyway.entity.Booking;
import com.skyway.entity.User;
import com.skyway.error.InvalidCredentialException;
import com.skyway.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController()
@RequestMapping("/book")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("manage-booking")
    public ResponseEntity<?> confirmBooking(@RequestBody ManageBooking manageBooking) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        assert user != null;
        bookingService.createBooking(manageBooking.getOneWayFLightResponse(), user, manageBooking.getPassengers());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @PageableDefault(size = 10,
            sort = "id",
            direction = Sort.Direction.DESC) Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        assert user != null;
        return ResponseEntity.ok().body(bookingService.getAllBookingsByUserId(user.getId(), pageable));
    }

    @GetMapping("/my-booking/{id}")
    public ResponseEntity<Booking> getMyBooking(@PathVariable Long id) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();

        assert user != null;
        if (bookingService.getBookingById(id).getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok().body(bookingService.getBookingById(id));
        } else {
            throw new AccessDeniedException("you don't have rights to manage this booking");
        }
    }

    @PostMapping("/search-booking")
    public ResponseEntity<BookingResponse> searchBooking(@RequestBody BookingSearch search) throws InvalidCredentialException {
        BookingResponse booking = bookingService.getBookingByNumberAndName(search.getBookingReference(),
                search.getName());

        return ResponseEntity.ok().body(booking);
    }

    @PatchMapping("/cancel-booking/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        User user = (User) auth.getPrincipal();
        assert user != null;
        if (bookingService.getBookingById(id).getUser().getId().equals(user.getId())) {
            bookingService.cancelBooking(id);
        } else {
            throw new AccessDeniedException("you don't have rights to manage this booking");
        }
        return ResponseEntity.ok().build();
    }
}
