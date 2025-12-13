package com.skyway.error;

public class AirportAlreadyExists extends RuntimeException {
    public AirportAlreadyExists(String message) {
        super(message);
    }
}
