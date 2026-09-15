package com.neuroforge.service;

import com.neuroforge.config.JwtTokenProvider;
import com.neuroforge.dto.request.LoginRequest;
import com.neuroforge.dto.request.RegisterRequest;
import com.neuroforge.dto.response.DemoPersonaResponse;
import com.neuroforge.dto.response.JwtAuthResponse;
import com.neuroforge.dto.response.UserProfileResponse;
import com.neuroforge.entity.User;
import com.neuroforge.entity.UserPhone;
import com.neuroforge.enums.Role;
import com.neuroforge.exception.BadRequestException;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.exception.UnauthorizedException;
import com.neuroforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    @Value("${neuroforge.demo-mode.enabled:true}")
    private boolean demoModeEnabled;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public JwtAuthResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByName(request.getUsernameOrEmail())
                    .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                    .orElseThrow(() -> new UnauthorizedException("Invalid username or email"));

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getName(), request.getPassword())
            );

            String token = tokenProvider.generateToken(user);
            auditLogService.logEvent("AUTH_LOGIN_SUCCESS", "LOGIN", "USER", user.getUserId() != null ? user.getUserId().longValue() : null, user.getName(), user.getUserId() != null ? user.getUserId().longValue() : null, user.getRole(), "User logged in with credentials.", "SUCCESS", "/api/auth/login", null);
            return new JwtAuthResponse(
                    token,
                    tokenProvider.getExpirationMs(),
                    user.getUserId(),
                    user.getName(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole(),
                    null
            );
        } catch (Exception ex) {
            auditLogService.logEvent("AUTH_LOGIN_FAILURE", "LOGIN", "USER", null, request.getUsernameOrEmail(), null, null, "Failed login attempt for user/email: " + request.getUsernameOrEmail(), "FAILURE", "/api/auth/login", null);
            if (ex instanceof UnauthorizedException) {
                throw (UnauthorizedException) ex;
            }
            throw new UnauthorizedException("Invalid username or password");
        }
    }

    @Transactional(readOnly = true)
    public JwtAuthResponse demoSwitch(String targetRole) {
        if (!demoModeEnabled) {
            throw new UnauthorizedException("Persona switching is restricted to Demo Mode and is disabled in this environment.");
        }

        User demoUser = userRepository.findByRole(targetRole)
                .orElseThrow(() -> new ResourceNotFoundException("No demo user found for role: " + targetRole));

        String token = tokenProvider.generateToken(demoUser);
        auditLogService.logEvent("PERSONA_SWITCH_EXEC", "DEMO_SWITCH", "USER", demoUser.getUserId() != null ? demoUser.getUserId().longValue() : null, demoUser.getName(), demoUser.getUserId() != null ? demoUser.getUserId().longValue() : null, demoUser.getRole(), "Demo persona switch executed for role: " + targetRole, "SUCCESS", "/api/auth/demo-switch", null);

        return new JwtAuthResponse(
                token,
                tokenProvider.getExpirationMs(),
                demoUser.getUserId(),
                demoUser.getName(),
                demoUser.getEmail(),
                demoUser.getName(),
                demoUser.getRole(),
                null
        );
    }

    @Transactional(readOnly = true)
    public List<DemoPersonaResponse> getDemoPersonas() {
        if (!demoModeEnabled) {
            return new ArrayList<>();
        }

        List<DemoPersonaResponse> personas = new ArrayList<>();
        for (Role r : Role.values()) {
            userRepository.findByRole(r.name()).ifPresent(user -> {
                personas.add(new DemoPersonaResponse(
                        user.getRole(),
                        user.getName(),
                        user.getEmail(),
                        user.getName(),
                        null
                ));
            });
        }
        return personas;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String username) {
        User user = userRepository.findByName(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<String> phoneNumbers = user.getPhones() != null
                ? user.getPhones().stream().map(UserPhone::getPhoneNumber).collect(Collectors.toList())
                : new ArrayList<>();

        return new UserProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getPhone(),
                phoneNumbers
        );
    }

    @Transactional
    public JwtAuthResponse register(RegisterRequest request) {
        if (userRepository.existsByName(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole() != null ? request.getRole().name() : Role.DEVELOPER.name(),
                null
        );

        user = userRepository.save(user);
        auditLogService.logEvent("USER_CREATED", "REGISTER", "USER", user.getUserId() != null ? user.getUserId().longValue() : null, user.getName(), user.getUserId() != null ? user.getUserId().longValue() : null, user.getRole(), "User registered account: " + user.getEmail(), "SUCCESS", "/api/auth/register", null);
        String token = tokenProvider.generateToken(user);

        return new JwtAuthResponse(
                token,
                tokenProvider.getExpirationMs(),
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                null
        );
    }
}
