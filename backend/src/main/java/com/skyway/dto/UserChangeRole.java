package com.skyway.dto;

import com.skyway.entity.Role;

public class UserChangeRole {
    private Long id;
    private Role newRole;

    //getters
    public Long getId() {return id;}
    public Role getNewRole() {return newRole;}
}
