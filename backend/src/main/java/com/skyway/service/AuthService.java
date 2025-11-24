package com.skyway.service;

import com.skyway.dto.JWTResponse;
import com.skyway.dto.UserCreateDTO;
import com.skyway.dto.UserLoginRequestDTO;
import com.skyway.dto.UserResponseDTO;
import com.skyway.entity.User;
import com.skyway.error.*;
import com.skyway.mapper.UserMapper;
import com.skyway.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    private final ArrayList<String> tokenBlacklist = new ArrayList<>();


    public AuthService(JwtService jwtService, UserService userService,
                       CustomUserDetailsService customUserDetailsService, UserRepository userRepository,
                       AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.customUserDetailsService = customUserDetailsService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    public JWTResponse register(UserCreateDTO userCreateDTO) {
        return login(userService.createUser(userCreateDTO));
    }

    public JWTResponse login(UserLoginRequestDTO userLoginRequestDTO) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    userLoginRequestDTO.getEmail(), userLoginRequestDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            User userDetails = (User) auth.getPrincipal();

            String token = jwtService.generateToken(userDetails);

            return new JWTResponse(
                    token,
                    "bearer",
                    userDetails.getId(),
                    userDetails.getEmail(),
                    userDetails.getRole(),
                    userDetails.getFirstName(),
                    userDetails.getLastName()
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public JWTResponse refresh(String oldToken) {
        if (tokenBlacklist.contains(oldToken)) {
            throw new TokenExpiredException("token is expired");
        }

        String email = jwtService.extractUserEmail(oldToken);

        if (email == null) {
            throw new InvalidTokenException("token is invalid");
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if(!jwtService.isTokenValid(oldToken, userDetails)) {
            throw new InvalidTokenException("token is invalid");
        }

        tokenBlacklist.add(oldToken);

        String newToken = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundError("user with email " + email + " not found"));

        return new JWTResponse(
                newToken,
                "bearer",
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName()
        );
    }

    public void logout(String token) {
        tokenBlacklist.add(token);
        SecurityContextHolder.clearContext();
    }

    public UserResponseDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new InvalidCredentialException("user not authenticated");
        }

        String email = auth.getName();

        return userService.getUserByEmail(email);
    }
}
