package com.skyway.entity;

import jakarta.persistence.*;
import org.jspecify.annotations.Nullable;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
public class User implements UserDetails {
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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Passenger> passengers = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        switch (role) {
            case ADMIN:
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
                break;
            case STAFF:
                authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            case USER:
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return this.hashedPassword;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {return true;}

    @Override
    public boolean isAccountNonLocked() {return true;}

    @Override
    public boolean isCredentialsNonExpired() {return true;}

    @Override
    public boolean isEnabled() {return Boolean.TRUE.equals(isEnabled);}

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
    public String getHashedPassword(String password) {return this.hashedPassword;}
    public List<Passenger> getPassengers() {return this.passengers;}
    public List<Booking> getBookings() {return this.bookings;}

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
    public void setPassengers(List<Passenger> passengers) {this.passengers = passengers;}
    public void setBookings(List<Booking> bookings) {this.bookings = bookings;}
}
