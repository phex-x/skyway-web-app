package com.skyway.dto;

import com.skyway.entity.Role;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class UserResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Date dateOfBirth;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String country;
    private Role role;
    private List<PassengerResponseDTO> passengers;
    private boolean isEnabled;

    //getters
    public Long getId() {return this.id;}
    public String getFirstName() {return this.firstName;}
    public String getLastName() {return this.lastName;}
    public String getEmail() {return this.email;}
    public String getPhone() {return this.phone;}
    public Date getDateOfBirth() {return this.dateOfBirth;}
    public LocalDateTime getCreatedAt() {return this.createdAt;}
    public LocalDateTime getUpdatedAt() {return this.updatedAt;}
    public String getCountry() {return this.country;}
    public Role getRole() {return this.role;}
    public List<PassengerResponseDTO> getPassengers() {return this.passengers;}
    public boolean isEnabled() {return this.isEnabled;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setFirstName(String firstName) {this.firstName = firstName;}
    public void setLastName(String lastName) {this.lastName = lastName;}
    public void setEmail(String email) {this.email = email;}
    public void setPhone(String phone) {this.phone = phone;}
    public void setDateOfBirth(Date dateOfBirth) {this.dateOfBirth = dateOfBirth;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}
    public void setCountry(String country) {this.country = country;}
    public void setRole(Role role) {this.role = role;}
    public void setPassengers(List<PassengerResponseDTO> passengers) {this.passengers = passengers;}
    public void setEnabled(boolean enabled) {this.isEnabled = enabled;}
}
