package com.skyway.mapper;

import com.skyway.dto.BookingResponse;
import com.skyway.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BookingMapper {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FlightMapper flightMapper;

    @Autowired
    private PassengerMapper passengerMapper;

    public BookingResponse toBookingResponse(Booking booking) {
        BookingResponse bookingResponse = new BookingResponse();
        bookingResponse.setId(booking.getId());
        bookingResponse.setBookingDate(booking.getBookingDate());
        bookingResponse.setBookingReference(booking.getBookingReference());
        bookingResponse.setFlight(flightMapper.toFlightResponse(booking.getFlight()));
        bookingResponse.setStatus(booking.getStatus());
        bookingResponse.setSeatClass(booking.getSeatClass());
        bookingResponse.setUser(userMapper.toUserResponseDTO(booking.getUser()));
        bookingResponse.setPassengers(booking.getPassengers().stream()
                .map(passenger -> passengerMapper.toPassengerResponseDTO(passenger))
                .collect(Collectors.toList()));

        return bookingResponse;
    }
}
