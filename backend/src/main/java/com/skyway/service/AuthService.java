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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;

    private final ArrayList<String> tokenBlacklist = new ArrayList<>();


    public AuthService(JwtService jwtService, PasswordEncoder passwordEncoder, UserService userService,
                       CustomUserDetailsService customUserDetailsService, UserRepository userRepository,
                       UserMapper userMapper, AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.customUserDetailsService = customUserDetailsService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
    }

    public JWTResponse register(UserCreateDTO userCreateDTO) {
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new UserAlreadyExistsError("user with email " + userCreateDTO.getEmail() + " already exists");
        }
        User user = userMapper.toUser(userCreateDTO);
        userRepository.save(user);
        UserLoginRequestDTO userLoginRequestDTO = new UserLoginRequestDTO();
        userLoginRequestDTO.setEmail(user.getEmail());
        userLoginRequestDTO.setPassword(user.getPassword());
        return login(userLoginRequestDTO);
    }

    public JWTResponse login(UserLoginRequestDTO userLoginRequestDTO) {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    userLoginRequestDTO.getEmail(), userLoginRequestDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            CustomUserDetailsService userDetailsService = (CustomUserDetailsService) auth.getPrincipal();

            User user = userRepository.findByEmail(userLoginRequestDTO.getEmail())
                    .orElseThrow(() -> new UserNotFoundError("user with email " + userLoginRequestDTO.getEmail() + " not found"));

            String token = jwtService.generateToken(user);

            return new JWTResponse(
                    token,
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getRole(),
                    user.getFirstName(),
                    user.getLastName()
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
                newToken,
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
        if (auth != null || !auth.isAuthenticated()) {
            throw new InvalidCredentialException("user not authenticated");
        }

        String email = auth.getName();

        return userService.getUserByEmail(email);
    }
}
