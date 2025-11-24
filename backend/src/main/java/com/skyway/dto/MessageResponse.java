package com.skyway.dto;

public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    //getter
    public String getMessage() {return this.message;}

    //setter
    public void setMessage(String message) {this.message = message;}
}
