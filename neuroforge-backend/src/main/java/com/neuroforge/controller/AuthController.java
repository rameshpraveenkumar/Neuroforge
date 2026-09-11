package com.neuroforge.controller;

import com.neuroforge.dto.request.LoginRequest;
import com.neuroforge.dto.request.RegisterRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.DemoPersonaResponse;
import com.neuroforge.dto.response.JwtAuthResponse;
import com.neuroforge.dto.response.UserProfileResponse;
import com.neuroforge.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication & RBAC", description = "Endpoints for user authentication, registration, persona switching, and profile details")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates credentials and returns a signed JWT access token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "User Registration", description = "Registers a new user in the system")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        JwtAuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/demo-switch")
    @Operation(summary = "Demo Persona Switcher (Demo Mode Only)", description = "Issues a genuine signed JWT for the selected pre-seeded role persona.")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> demoSwitch(@RequestParam("role") String role) {
        JwtAuthResponse response = authService.demoSwitch(role);
        return ResponseEntity.ok(ApiResponse.ok("Switched to persona: " + role, response));
    }

    @GetMapping("/demo-personas")
    @Operation(summary = "Get Demo Personas", description = "Returns available pre-seeded role personas for fast switching in Demo Mode")
    public ResponseEntity<ApiResponse<List<DemoPersonaResponse>>> getDemoPersonas() {
        List<DemoPersonaResponse> personas = authService.getDemoPersonas();
        return ResponseEntity.ok(ApiResponse.ok("Demo personas retrieved", personas));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Current User Profile", description = "Fetches the profile and permissions of the currently authenticated user token")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        UserProfileResponse profile = authService.getCurrentUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", profile));
    }
}
