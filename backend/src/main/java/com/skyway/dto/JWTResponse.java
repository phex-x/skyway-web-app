package com.skyway.dto;

import com.skyway.entity.Role;

public class JWTResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;

    //getters
    public String getToken() {return this.token;}
    public String getType() {return this.type;}
    public Long getId() {return this.id;}
    public String getEmail() {return this.email;}
    public Role getRole() {return this.role;}
    public String getFirstName() {return this.firstName;}
    public String getLastName() {return this.lastName;}

    //setters
    public JWTResponse(String token, String type, Long id, String email, Role role, String firstName, String lastName) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
