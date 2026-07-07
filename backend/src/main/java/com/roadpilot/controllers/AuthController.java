package com.roadpilot.controllers;

import com.roadpilot.dto.*;
import com.roadpilot.entity.Role;
import com.roadpilot.entity.User;
import com.roadpilot.repository.RoleRepository;
import com.roadpilot.repository.UserRepository;
import com.roadpilot.security.JwtTokenProvider;
import com.roadpilot.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationInMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long jwtRefreshExpirationInMs;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Email Address already in use!"));
        }

        // Creating user's account
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .active(true)
                .build();

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: User Role not set. Please initialize database roles."));

        user.setRoles(Collections.singleton(userRole));

        userRepository.save(user);

        log.info("User registered successfully: {}", user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        log.info("User logged in successfully: {}", userPrincipal.getUsername());
        return ResponseEntity.ok(JwtAuthenticationResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .userId(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (tokenProvider.validateToken(requestRefreshToken)) {
            Long userId = tokenProvider.getUserIdFromJWT(requestRefreshToken);
            
            // Generate fresh token set
            String accessToken = tokenProvider.generateTokenFromUserId(userId, jwtExpirationInMs);
            String newRefreshToken = tokenProvider.generateTokenFromUserId(userId, jwtRefreshExpirationInMs);

            log.info("JWT access token refreshed successfully for user ID: {}", userId);
            return ResponseEntity.ok(TokenRefreshResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(newRefreshToken)
                    .build());
        }

        log.warn("Invalid refresh token validation attempt");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh token is invalid or expired"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        log.info("User logged out");
        return ResponseEntity.ok(Map.of("message", "Log out successful"));
    }
}
