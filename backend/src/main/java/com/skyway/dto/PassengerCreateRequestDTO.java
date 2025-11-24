package com.skyway.dto;

import com.skyway.entity.Gender;
import com.skyway.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.util.Date;

public class PassengerCreateRequestDTO {
    @NotBlank(message = "passenger must have user")
    private User user;

    @NotBlank(message = "passport number can't be null")
    private String passportNumber;

    @NotBlank(message = "citizenship is required")
    private String citizenship;

    @Past(message = "birth date must be day before now")
    private Date birthday;

    @NotBlank(message = "gender is required")
    private Gender gender;

    //getters
    public User getUser() {return this.user;}
    public String getPassportNumber() {return this.passportNumber;}
    public String getCitizenship() {return this.citizenship;}
    public Date getBirthday() {return this.birthday;}
    public Gender getGender() {return this.gender;}

    //setters
    public void setUser(User user) {this.user = user;}
    public void setPassportNumber(String passportNumber) {this.passportNumber = passportNumber;}
    public void setCitizenship( String citizenship) {this.citizenship = citizenship;}
    public void setBirthday( Date birthday) {this.birthday = birthday;}
    public void setGender(Gender gender) {this.gender = gender;}
}
