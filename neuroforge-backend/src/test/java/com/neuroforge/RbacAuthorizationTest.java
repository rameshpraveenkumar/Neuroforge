package com.neuroforge;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuroforge.dto.request.LoginRequest;
import com.neuroforge.enums.Role;
import com.neuroforge.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RbacAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. Verify DatabaseDataSeeder seeded all 9 enterprise roles")
    void testDemoUsersSeeded() {
        assertEquals(9, userRepository.count(), "All 9 role accounts must be pre-seeded");
        for (Role role : Role.values()) {
            userRepository.findByRole(role.name())
                    .orElseThrow(() -> new AssertionError("Missing seeded user for role: " + role.name()));
        }
    }

    @Test
    @DisplayName("2. Verify Login returns valid signed JWT token and role payload")
    void testLoginReturnsValidJwt() throws Exception {
        LoginRequest loginRequest = new LoginRequest("dev@neuroforge.io", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("DEVELOPER")))
                .andExpect(jsonPath("$.data.username", is("Liam Zhao")));
    }

    @Test
    @DisplayName("3. Verify /api/auth/me works with Bearer JWT token")
    void testGetMeWithJwt() throws Exception {
        // Step 1: Login
        LoginRequest loginRequest = new LoginRequest("dev@neuroforge.io", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).path("data").path("accessToken").asText();

        // Step 2: Call /api/auth/me with Bearer token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("Liam Zhao")))
                .andExpect(jsonPath("$.data.role", is("DEVELOPER")));
    }

    @Test
    @DisplayName("4. Verify /api/auth/demo-switch issues authentic JWT for target role")
    void testDemoSwitchIssuesGenuineJwt() throws Exception {
        mockMvc.perform(post("/api/auth/demo-switch")
                        .param("role", "QA_ENGINEER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("QA_ENGINEER")))
                .andExpect(jsonPath("$.data.email", is("qa@neuroforge.io")));
    }

    @Test
    @DisplayName("5. Verify Invalid credentials return HTTP 401 Unauthorized")
    void testInvalidCredentials() throws Exception {
        LoginRequest invalidRequest = new LoginRequest("dev@neuroforge.io", "wrong_password");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
