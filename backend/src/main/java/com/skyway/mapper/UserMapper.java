package com.skyway.mapper;

import com.skyway.dto.UserCreateDTO;
import com.skyway.dto.UserResponseDTO;
import com.skyway.entity.Role;
import com.skyway.entity.User;
import com.skyway.error.PasswordsDontMatchError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    private final PasswordEncoder passwordEncoder;
    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Lazy
    @Autowired
    private PassengerMapper passengerMapper;

    public User toUser(UserCreateDTO userCreateDTO) {
        User user = new User();
        user.setEmail(userCreateDTO.getEmail());
        if (isPasswordMatches(userCreateDTO.getPassword(), userCreateDTO.getPasswordConfirmation())) {
            user.setHashedPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        } else {throw new PasswordsDontMatchError("passwords don't match");}
        user.setFirstName(userCreateDTO.getFirstName());
        user.setLastName(userCreateDTO.getLastName());
        user.setCountry(userCreateDTO.getCountry());
        user.setPhoneNumber(userCreateDTO.getPhoneNumber());
        user.setDateOfBirth(userCreateDTO.getBirthDate());
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsEnabled(true);
        System.out.println(user);
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
        userResponseDTO.setPassengers(user.getPassengers().stream()
                .map(passenger -> passengerMapper.toPassengerResponseDTO(passenger))
                .collect(Collectors.toList()));
        return userResponseDTO;
    }

    private boolean isPasswordMatches(String password, String confirmPassword) {
        return password.equals(confirmPassword);
    }
}
