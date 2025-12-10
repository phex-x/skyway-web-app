package com.skyway.service;

import com.skyway.dto.UserCreateDTO;
import com.skyway.dto.UserLoginRequestDTO;
import com.skyway.dto.UserResponseDTO;
import com.skyway.entity.User;
import com.skyway.error.UserAlreadyExistsError;
import com.skyway.error.UserNotFoundError;
import com.skyway.mapper.UserMapper;
import com.skyway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public UserLoginRequestDTO createUser(UserCreateDTO userCreateDTO) {
        if (userRepository.findByEmail(userCreateDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsError("user with email " + userCreateDTO.getEmail() + " already exists");
        }
        User user = userMapper.toUser(userCreateDTO);
        user = userRepository.save(user);
        UserLoginRequestDTO userLoginRequestDTO = new UserLoginRequestDTO();
        userLoginRequestDTO.setEmail(user.getEmail());
        userLoginRequestDTO.setPassword(userCreateDTO.getPassword());
        return userLoginRequestDTO;
    }

    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundError("user with email " + email + " not found"));
        return userMapper.toUserResponseDTO(user);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundError("user with id: " + id + " not found"));
        return userMapper.toUserResponseDTO(user);
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundError("user with id: " + id + " not found"));
        userRepository.delete(user);
    }

    public void enableUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundError("user with id: " + id + " not found"));
        user.setIsEnabled(true);
        userRepository.save(user);
    }

    public void disableUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundError("user with id: " + id + " not found"));
        user.setIsEnabled(false);
    }
}