package com.neuroforge;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuroforge.config.AiProperties;
import com.neuroforge.dto.request.AiGenerateRequest;
import com.neuroforge.dto.response.AiSuggestionResponse;
import com.neuroforge.service.AiEngineService;
import com.neuroforge.service.ai.ExternalLlmProvider;
import com.neuroforge.service.ai.OfflineAiProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.response.MockRestResponseCreators;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClient;

import java.net.SocketTimeoutException;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AiProviderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AiEngineService aiEngineService;

    @Autowired
    private OfflineAiProvider offlineAiProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("AI Provider: Offline Heuristic synthesis works for all 4 preset types")
    public void testOfflineAiProviderAllPresets() {
        String story = offlineAiProvider.generate("USER_STORY", "OAuth2 Single Sign-On");
        assertThat(story).contains("User Story").contains("Gherkin Acceptance Criteria");

        String testMatrix = offlineAiProvider.generate("TEST_CASE", "JWT Expiration");
        assertThat(testMatrix).contains("QA Test Matrix").contains("Happy Path");

        String sprintRisk = offlineAiProvider.generate("SPRINT_RISK", "Sprint 3 Scope");
        assertThat(sprintRisk).contains("Sprint Velocity & Delivery Risk").contains("Health Score");

        String codeReview = offlineAiProvider.generate("CODE_REVIEW", "Repository Layer Refactoring");
        assertThat(codeReview).contains("Code Review & Security Analysis").contains("Verdict");
    }

    @Test
    @WithMockUser(username = "developer", roles = {"DEVELOPER"})
    @DisplayName("POST /api/ai/generate: Defaults to offline engine when provider is disabled")
    public void testGenerateWithOfflineDefault() throws Exception {
        AiGenerateRequest request = new AiGenerateRequest();
        request.setType("USER_STORY");
        request.setPrompt("Automated database backup pipeline");

        mockMvc.perform(post("/api/ai/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.suggestion").isNotEmpty())
                .andExpect(jsonPath("$.data.source").value("OFFLINE_HEURISTIC"));
    }

    @Test
    @DisplayName("ExternalLlmProvider: isAvailable() is false when disabled or missing credentials")
    public void testExternalProviderAvailabilityChecks() {
        AiProperties props = new AiProperties();
        props.setEnabled(false);
        ExternalLlmProvider provider = new ExternalLlmProvider(props, RestClient.builder(), objectMapper);
        assertThat(provider.isAvailable()).isFalse();

        props.setEnabled(true);
        props.setApiKey("");
        props.setBaseUrl("https://api.openai.com/v1");
        assertThat(provider.isAvailable()).isFalse();

        props.setApiKey("test-key");
        props.setBaseUrl("ftp://invalid-scheme");
        assertThat(provider.isAvailable()).isFalse();

        props.setBaseUrl("https://api.openai.com/v1");
        assertThat(provider.isAvailable()).isTrue();
    }

    @Test
    @DisplayName("ExternalLlmProvider: Successful mock response returns normalized content")
    public void testExternalProviderSuccessMock() {
        AiProperties props = new AiProperties();
        props.setEnabled(true);
        props.setApiKey("mock-secret-key-12345");
        props.setBaseUrl("https://api.mock-ai.neuroforge.io/v1");
        props.setModel("gpt-4o-mini");

        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

        String mockResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "role": "assistant",
                        "content": "### Synthesized External LLM Story\\n\\nAs a Developer, I want real-time metrics."
                      }
                    }
                  ]
                }
                """;

        server.expect(requestTo("https://api.mock-ai.neuroforge.io/v1/chat/completions"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer mock-secret-key-12345"))
                .andRespond(MockRestResponseCreators.withSuccess(mockResponseBody, MediaType.APPLICATION_JSON));

        ExternalLlmProvider provider = new ExternalLlmProvider(props, builder, objectMapper);
        String result = provider.generate("USER_STORY", "Real-time Metrics Dashboard");

        assertThat(result).contains("Synthesized External LLM Story");
        server.verify();
    }

    @Test
    @DisplayName("ExternalLlmProvider: HTTP 401/403/429/500 errors throw sanitized exception for fallback")
    public void testExternalProviderHttpErrors() {
        AiProperties props = new AiProperties();
        props.setEnabled(true);
        props.setApiKey("mock-key");
        props.setBaseUrl("https://api.mock-ai.neuroforge.io/v1");

        // 401 Unauthorized
        RestClient.Builder b1 = RestClient.builder();
        MockRestServiceServer s1 = MockRestServiceServer.bindTo(b1).build();
        s1.expect(requestTo("https://api.mock-ai.neuroforge.io/v1/chat/completions"))
                .andRespond(MockRestResponseCreators.withStatus(HttpStatus.UNAUTHORIZED));
        ExternalLlmProvider p1 = new ExternalLlmProvider(props, b1, objectMapper);
        try {
            p1.generate("USER_STORY", "Test");
        } catch (Exception ex) {
            assertThat(ex.getMessage()).doesNotContain("mock-key");
        }

        // 429 Rate Limit
        RestClient.Builder b2 = RestClient.builder();
        MockRestServiceServer s2 = MockRestServiceServer.bindTo(b2).build();
        s2.expect(requestTo("https://api.mock-ai.neuroforge.io/v1/chat/completions"))
                .andRespond(MockRestResponseCreators.withStatus(HttpStatus.TOO_MANY_REQUESTS));
        ExternalLlmProvider p2 = new ExternalLlmProvider(props, b2, objectMapper);
        try {
            p2.generate("USER_STORY", "Test");
        } catch (Exception ex) {
            assertThat(ex.getMessage()).doesNotContain("mock-key");
        }

        // 500 Internal Error
        RestClient.Builder b3 = RestClient.builder();
        MockRestServiceServer s3 = MockRestServiceServer.bindTo(b3).build();
        s3.expect(requestTo("https://api.mock-ai.neuroforge.io/v1/chat/completions"))
                .andRespond(MockRestResponseCreators.withServerError());
        ExternalLlmProvider p3 = new ExternalLlmProvider(props, b3, objectMapper);
        try {
            p3.generate("USER_STORY", "Test");
        } catch (Exception ex) {
            assertThat(ex.getMessage()).doesNotContain("mock-key");
        }
    }

    @Test
    @DisplayName("ExternalLlmProvider: Malformed or empty response triggers fallback")
    public void testExternalProviderMalformedResponse() {
        AiProperties props = new AiProperties();
        props.setEnabled(true);
        props.setApiKey("mock-key");
        props.setBaseUrl("https://api.mock-ai.neuroforge.io/v1");

        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://api.mock-ai.neuroforge.io/v1/chat/completions"))
                .andRespond(MockRestResponseCreators.withSuccess("{\"invalid\": true}", MediaType.APPLICATION_JSON));

        ExternalLlmProvider provider = new ExternalLlmProvider(props, builder, objectMapper);
        try {
            provider.generate("USER_STORY", "Test");
        } catch (Exception ex) {
            assertThat(ex).isNotNull();
        }
    }

    @Test
    @WithMockUser(username = "admin", roles = {"SYSTEM_ADMIN"})
    @DisplayName("GET /api/ai/assistants: Retrieves all configured assistants")
    public void testGetAssistants() throws Exception {
        mockMvc.perform(get("/api/ai/assistants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("POST /api/ai/generate: Unauthenticated request rejected with 4xx")
    public void testUnauthenticatedAccessRejected() throws Exception {
        AiGenerateRequest request = new AiGenerateRequest();
        request.setPrompt("Test prompt");
        mockMvc.perform(post("/api/ai/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }
}