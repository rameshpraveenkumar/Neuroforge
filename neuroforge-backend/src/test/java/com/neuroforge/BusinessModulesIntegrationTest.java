package com.neuroforge;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuroforge.config.JwtTokenProvider;
import com.neuroforge.dto.request.AiGenerateRequest;
import com.neuroforge.dto.request.TaskStatusUpdateRequest;
import com.neuroforge.entity.User;
import com.neuroforge.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BusinessModulesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String devToken;
    private String clientToken;

    @BeforeEach
    void setUp() {
        User admin = userRepository.findByEmail("admin@neuroforge.io").orElseThrow();
        User dev = userRepository.findByEmail("dev@neuroforge.io").orElseThrow();
        User client = userRepository.findByEmail("client@neuroforge.io").orElseThrow();

        adminToken = jwtTokenProvider.generateToken(admin);
        devToken = jwtTokenProvider.generateToken(dev);
        clientToken = jwtTokenProvider.generateToken(client);
    }

    @Test
    @DisplayName("1. Verify Project Management APIs (/api/projects)")
    void testProjectModule() throws Exception {
        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data[0].projectName", notNullValue()));
    }

    @Test
    @DisplayName("2. Verify Requirements Matrix APIs (/api/requirements)")
    void testRequirementsModule() throws Exception {
        mockMvc.perform(get("/api/requirements")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("3. Verify Sprints & Goals APIs (/api/sprints)")
    void testSprintsModule() throws Exception {
        mockMvc.perform(get("/api/sprints")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    @DisplayName("4. Verify Tasks & Kanban Status Transition (/api/tasks)")
    void testTasksAndKanbanTransition() throws Exception {
        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        TaskStatusUpdateRequest update = new TaskStatusUpdateRequest("IN_PROGRESS");
        mockMvc.perform(patch("/api/tasks/1/status")
                        .header("Authorization", "Bearer " + devToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("IN_PROGRESS")));
    }

    @Test
    @DisplayName("5. Verify QA Test Center APIs (/api/test-cases)")
    void testTestCaseModule() throws Exception {
        mockMvc.perform(get("/api/test-cases")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("6. Verify Bug Tracker APIs (/api/bugs)")
    void testBugTrackerModule() throws Exception {
        mockMvc.perform(get("/api/bugs")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("7. Verify Repositories & Commits APIs (/api/repositories, /api/commits)")
    void testRepositoryAndCommitModule() throws Exception {
        mockMvc.perform(get("/api/repositories")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        mockMvc.perform(get("/api/commits/repository/1")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("8. Verify Architecture & ADR Documentation APIs (/api/documentation)")
    void testDocumentationModule() throws Exception {
        mockMvc.perform(get("/api/documentation")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("9. Verify Safe CI/CD Pipeline Simulator (/api/cicd)")
    void testCiCdSimulatorModule() throws Exception {
        mockMvc.perform(post("/api/cicd/run/repository/1")
                        .param("branch", "main")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("SUCCESS")))
                .andExpect(jsonPath("$.data.stages", hasSize(6)));
    }

    @Test
    @DisplayName("10. Verify Deployments & Environment Tracking (/api/deployments)")
    void testDeploymentModule() throws Exception {
        mockMvc.perform(get("/api/deployments")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("11. Verify AI Hub Offline Synthesis Engine (/api/ai)")
    void testAiHubModule() throws Exception {
        AiGenerateRequest request = new AiGenerateRequest();
        request.setPrompt("Automated Sprint Burndown Verification");
        request.setType("USER_STORY");
        request.setProjectId(1);

        mockMvc.perform(post("/api/ai/generate")
                        .header("Authorization", "Bearer " + devToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.suggestion", containsString("User Story")));
    }

    @Test
    @DisplayName("12. Verify Analytics & DORA Metrics (/api/analytics)")
    void testAnalyticsAndDoraMetrics() throws Exception {
        mockMvc.perform(get("/api/analytics/overview")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalProjects", greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.data.totalUsers", is(9)));

        mockMvc.perform(get("/api/analytics/dora")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.deploymentFrequency", notNullValue()));
    }

    @Test
    @DisplayName("13. Verify RBAC Security: CLIENT role denied mutation operations")
    void testRbacEnforcementForClientRole() throws Exception {
        AiGenerateRequest request = new AiGenerateRequest();
        request.setPrompt("Sensitive Action");

        // Client cannot create projects (needs PM/Admin)
        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"projectName\":\"Unauthorized Project\"}"))
                .andExpect(status().isForbidden());
    }
}
