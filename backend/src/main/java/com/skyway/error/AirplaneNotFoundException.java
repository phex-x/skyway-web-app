package com.skyway.error;

public class AirplaneNotFoundException extends RuntimeException {
    public AirplaneNotFoundException(String message) {
        super(message);
    }
}
