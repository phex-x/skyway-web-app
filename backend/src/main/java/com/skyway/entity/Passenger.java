package com.skyway.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "passengers")
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "citizenship")
    private String citizenship;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "bonus_miles")
    private BigDecimal bonusMiles;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = true)
    private User user;

    //getters
    public Long getId() {return this.id;}
    public String getPassportNumber() {return this.passportNumber;}
    public String getCitizenship() {return this.citizenship;}
    public Date getDateOfBirth() {return this.dateOfBirth;}
    public Gender getGender() {return this.gender;}
    public BigDecimal getBonusMiles() {return this.bonusMiles;}
    public LocalDateTime getCreatedAt() {return this.createdAt;}
    public User getUser() {return this.user;}

    //setters
    public void setId(Long id) {this.id = id;}
    public void setPassportNumber(String passportNumber) {this.passportNumber = passportNumber;}
    public void setCitizenship(String citizenship) {this.citizenship = citizenship;}
    public void setDateOfBirth(Date dateOfBirth) {this.dateOfBirth = dateOfBirth;}
    public void setGender(Gender gender) {this.gender = gender;}
    public void setBonusMiles(BigDecimal bonusMiles) {this.bonusMiles = bonusMiles;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public void setUser(User user) {this.user = user;}
}
