package com.skyway.service;

import com.skyway.entity.Booking;
import com.skyway.error.BookingDoesntExistsException;
import com.skyway.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    private String generateBookingReference() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1000000));

        return datePart + randomPart;
    }

    public void createBooking(Booking booking){
        booking.setBookingReference(generateBookingReference());
        bookingRepository.save(booking);
    }

    public Booking getBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingDoesntExistsException("booking with id " + id + " not found"));
        return booking;
    }

    public List<Booking> getAllBookingsByUserId(Long userId) {
        return bookingRepository.findBookingsByUserId(userId);
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingDoesntExistsException("booking with id " + id + " not found"));
        bookingRepository.delete(booking);
    }
}
