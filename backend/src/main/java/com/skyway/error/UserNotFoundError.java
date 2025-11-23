package com.skyway.error;

public class UserNotFoundError extends RuntimeException {
    public UserNotFoundError(String message) {
        super(message);
    }
}
