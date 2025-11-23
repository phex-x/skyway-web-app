package com.skyway.error;

public class UserAlreadyExistsError extends RuntimeException {
    public UserAlreadyExistsError(String message) {super(message);}
}
