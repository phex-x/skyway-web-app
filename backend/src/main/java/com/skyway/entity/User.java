package com.skyway.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "hashed_password", nullable = false)
    private String hashedPassword;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @Column(name = "country", nullable = false)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "is_enabled")
    private Boolean isEnabled;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //getters
    public Long getId() {return this.id;}
    public String getEmail() {return this.email;}
    public String getHashedPassword() {return this.hashedPassword;}
    public String getPhoneNumber() {return this.phoneNumber;}
    public String getFirstName() {return this.firstName;}
    public String getLastName() {return this.lastName;}
    public Date getDateOfBirth() {return this.dateOfBirth;}
    public String getCountry() {return this.country;}
    public LocalDateTime getCreatedAt() {return this.createdAt;}
    public LocalDateTime getUpdatedAt() {return this.updatedAt;}
    public Role getRole() {return this.role;}
    public Boolean getIsEnabled() {return this.isEnabled;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setEmail(String email) {this.email = email;}
    public void setHashedPassword(String hashedPassword) {this.hashedPassword = hashedPassword;}
    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber;}
    public void setFirstName(String firstName) {this.firstName = firstName;}
    public void setLastName(String lastName) {this.lastName = lastName;}
    public void setDateOfBirth(Date dateOfBirth) {this.dateOfBirth = dateOfBirth;}
    public void setCountry(String country) {this.country = country;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}
    public void setRole(Role role) {this.role = role;}
    public void setIsEnabled(Boolean isEnabled) {this.isEnabled = isEnabled;}
}
