package com.skyway.error;

public class BookingDoesntExistsException extends RuntimeException {
    public BookingDoesntExistsException(String message) {
        super(message);
    }
}
