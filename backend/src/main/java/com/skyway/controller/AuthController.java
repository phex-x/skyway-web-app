package com.skyway.controller;

import com.skyway.dto.*;
import com.skyway.error.InvalidTokenException;
import com.skyway.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<JWTResponse> register(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        JWTResponse jwtResponse = authService.register(userCreateDTO);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<JWTResponse> login(@Valid @RequestBody UserLoginRequestDTO userLoginRequestDTO) {
        JWTResponse jwtResponse = authService.login(userLoginRequestDTO);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JWTResponse> refresh(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("invalid token");
        }
        JWTResponse jwtResponse = authService.refresh(authHeader);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("invalid token");
        }
        authService.logout(authHeader);
        return ResponseEntity.ok(new MessageResponse("logged out succesfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        UserResponseDTO user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }


}
