package com.skyway.service;

import com.skyway.dto.BookingResponse;
import com.skyway.dto.OneWayFLightResponse;
import com.skyway.entity.*;
import com.skyway.error.BookingDoesntExistsException;
import com.skyway.error.InvalidCredentialException;
import com.skyway.mapper.BookingMapper;
import com.skyway.repository.BookingRepository;
import com.skyway.repository.FlightRepository;
import com.skyway.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private BookingMapper bookingMapper;

    @Autowired
    private PassengerRepository passengerRepository;

    private String generateBookingReference() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1000000));

        return datePart + randomPart;
    }

    public void createBooking(OneWayFLightResponse flight, User user, List<Passenger> passengers) {
        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setFlight(flightRepository.findById(flight.getFlightId()).get());
        booking.setUser(user);
        booking.setPassengers(passengers);
        booking.setBookingDate(LocalDate.now());
        booking.setStatus(Status.CONFIRMED);
        booking.setSeatClass(flight.getSeatClass());
        bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingDoesntExistsException("Booking not found"));
    }

    public BookingResponse getBookingByNumberAndName(String number, String name) throws InvalidCredentialException {
        Booking booking = bookingRepository.findBookingByBookingReference(number);
        if (booking == null) {
            throw new BookingDoesntExistsException("Booking not found");
        }
        if (!booking.getUser().getLastName().equals(name)) {
            throw new InvalidCredentialException("Invalid username or booking reference");
        }
        return bookingMapper.toBookingResponse(booking);
    }


    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingDoesntExistsException("booking with id " + id + " not found"));
        if (booking.getFlight().getScheduledDeparture().isAfter(LocalDateTime.now()) &&
        booking.getStatus() == Status.CONFIRMED) {
            booking.setStatus(Status.CANCELED);
            bookingRepository.save(booking);
            Flight flight = flightRepository.findById(booking.getFlight().getId()).get();
            if (booking.getSeatClass() == SeatClass.BUSINESS) {
                flight.setRemainingBusinessSeats(flight.getRemainingBusinessSeats() + booking.getPassengers().size());
                flight.setBookedBusinessSeats(flight.getBookedBusinessSeats() - booking.getPassengers().size());
            } else {
                flight.setRemainingEconomySeats(flight.getRemainingEconomySeats() + booking.getPassengers().size());
                flight.setBookedEconomySeats(flight.getBookedEconomySeats() - booking.getPassengers().size());
            }
            flightRepository.save(flight);
        } else {
            throw new BadCredentialsException("booking can be cancelled only before flight");
        }
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookingsByUserId(Long userId, Pageable pageable) {
        return bookingRepository.findBookingsByUserId(userId, pageable)
                .map(booking -> bookingMapper.toBookingResponse(booking));
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingDoesntExistsException("booking with id " + id + " not found"));
        bookingRepository.delete(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(booking -> bookingMapper.toBookingResponse(booking));
    }
}
