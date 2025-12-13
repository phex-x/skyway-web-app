package com.skyway.error;

public class AirportDoesntExists extends RuntimeException {
  public AirportDoesntExists(String message) {
    super(message);
  }
}
