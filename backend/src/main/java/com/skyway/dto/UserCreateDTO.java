package com.skyway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class UserCreateDTO {
    @NotBlank(message = "email can't be null")
    @Email(message = "email must be valid")
    private String email;

    @NotBlank(message = "passsword can't be null")
    @Size(min = 8, message = "password must be at least 8 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]*$",
            message = "Password can only contain letters, numbers and special characters: !@#$%^&*()_+-=[]{};':\"|,.<>/?"
    )
    private String password;

    @NotBlank(message = "password confiramtion can't be null")
    private String passwordConfirmation;

    @NotBlank(message = "first name can't be null")
    private String firstName;

    @NotBlank(message = "last name can't be null")
    private String lastName;

    @NotBlank(message = "phone number can't be null")
    private String phoneNumber;

    @NotBlank(message = "date of birth can't be null")
    private Date birthDate;

    @NotBlank(message = "country can't be null")
    private String country;

    //getters
    public String getEmail() {return this.email;}
    public String getPassword() {return this.password;}
    public String getPasswordConfirmation() {return this.passwordConfirmation;}
    public String getFirstName() {return this.firstName;}
    public String getLastName() {return this.lastName;}
    public String getPhoneNumber() {return this.phoneNumber;}
    public Date getBirthDate() {return this.birthDate;}
    public String getCountry() {return this.country;}

    //setters
    public void setEmail(String email) {this.email = email;}
    public void setPassword(String password) {this.password = password;}
    public void setPasswordConfirmation(String passwordConfirmation) {this.passwordConfirmation = passwordConfirmation;}
    public void setFirstName(String firstName) {this.firstName = firstName;}
    public void setLastName(String lastName) {this.lastName = lastName;}
    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber;}
    public void setBirthDate(Date birthDate) {this.birthDate = birthDate;}
    public void setCountry(String country) {this.country = country;}
}
