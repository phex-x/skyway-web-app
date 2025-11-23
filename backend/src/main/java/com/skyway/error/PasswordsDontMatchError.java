package com.skyway.error;

public class PasswordsDontMatchError extends RuntimeException {
    public PasswordsDontMatchError(String message) {
        super(message);
    }
}
