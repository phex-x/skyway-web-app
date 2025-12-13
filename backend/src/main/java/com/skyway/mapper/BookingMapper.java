package com.skyway.mapper;

import com.skyway.dto.BookingResponse;
import com.skyway.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public BookingResponse toBookingResponse(Booking booking) {
        BookingResponse bookingResponse = new BookingResponse();
        bookingResponse.setId(booking.getId());
        bookingResponse.setBookingDate(booking.getBookingDate());
        bookingResponse.setBookingReference(booking.getBookingReference());
        bookingResponse.setFlight(booking.getFlight());
        bookingResponse.setStatus(booking.getStatus());
        bookingResponse.setSeatClass(booking.getSeatClass());
        bookingResponse.setUser(booking.getUser());
        bookingResponse.setPassengers(booking.getPassengers());

        return bookingResponse;
    }
}
