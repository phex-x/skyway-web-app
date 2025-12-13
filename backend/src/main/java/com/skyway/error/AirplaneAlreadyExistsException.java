package com.skyway.error;

public class AirplaneAlreadyExistsException extends RuntimeException {
    public AirplaneAlreadyExistsException(String message) {
        super(message);
    }
}
