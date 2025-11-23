package com.skyway.dto;

public class UserLoginRequestDTO {
    private String email;
    private String password;

    //getters
    public String getEmail() {return this.email;}
    public String getPassword() {return this.password;}

    //setters
    public void setEmail(String email) {this.email = email;}
    public void setPassword(String password) {this.password = password;}
}
