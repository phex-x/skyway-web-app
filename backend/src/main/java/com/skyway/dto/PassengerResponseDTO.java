package com.skyway.dto;

import com.skyway.entity.Gender;
import com.skyway.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

public class PassengerResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private User user;
    private String passportNumber;
    private String citizenship;
    private Date dateOfBirth;
    private Gender gender;
    private BigDecimal bonusMiles;
    private LocalDateTime createdAt;

    //getters
    public Long getId() {return this.id;}
    public String getFirstName() {return this.firstName;}
    public String getLastName() {return this.lastName;}
    public User getUser() {return this.user;}
    public String getPassportNumber() {return this.passportNumber;}
    public String getCitizenship() {return this.citizenship;}
    public Date getDateOfBirth() {return this.dateOfBirth;}
    public Gender getGender() {return this.gender;}
    public BigDecimal getBonusMiles() {return this.bonusMiles;}
    public LocalDateTime getCreatedAt() {return this.createdAt;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setFirstName(String firstName) {this.firstName = firstName;}
    public void setLastName(String lastName) {this.lastName = lastName;}
    public void setUser(User user) {this.user = user;}
    public void setPassportNumber(String passportNumber) {this.passportNumber = passportNumber;}
    public void setCitizenship(String citizenship) {this.citizenship = citizenship;}
    public void setDateOfBirth(Date dateOfBirth) {this.dateOfBirth = dateOfBirth;}
    public void setGender(Gender gender) {this.gender = gender;}
    public void setBonusMiles(BigDecimal bonusMiles) {this.bonusMiles = bonusMiles;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
}
