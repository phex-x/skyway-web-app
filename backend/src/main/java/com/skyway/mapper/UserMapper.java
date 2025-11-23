package com.skyway.mapper;

import com.skyway.dto.UserCreateDTO;
import com.skyway.dto.UserResponseDTO;
import com.skyway.entity.Role;
import com.skyway.entity.User;
import com.skyway.error.PasswordsDontMatchError;

import java.time.LocalDateTime;

public class UserMapper {
    public User toUser(UserCreateDTO userCreateDTO) {
        User user = new User();
        user.setEmail(userCreateDTO.getEmail());
        if (isPasswordMatches(userCreateDTO.getPassword(), userCreateDTO.getPasswordConfirmation())) {
            user.setHashedPassword(userCreateDTO.getPassword());
        } else {throw new PasswordsDontMatchError("passwords don't match");}
        user.setFirstName(userCreateDTO.getFirstName());
        user.setLastName(userCreateDTO.getLastName());
        user.setCountry(userCreateDTO.getCountry());
        user.setPhoneNumber(userCreateDTO.getPhoneNumber());
        user.setDateOfBirth(userCreateDTO.getBirthDate());
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    public UserResponseDTO toUserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setFirstName(user.getFirstName());
        userResponseDTO.setLastName(user.getLastName());
        userResponseDTO.setDateOfBirth(user.getDateOfBirth());
        userResponseDTO.setCreatedAt(user.getCreatedAt());
        userResponseDTO.setUpdatedAt(user.getUpdatedAt());
        userResponseDTO.setPhone(user.getPhoneNumber());
        userResponseDTO.setCountry(user.getCountry());
        userResponseDTO.setRole(user.getRole());
        userResponseDTO.setEnabled(user.getIsEnabled());
        return userResponseDTO;
    }

    private boolean isPasswordMatches(String password, String confirmPassword) {
        return password.equals(confirmPassword);
    }
}
