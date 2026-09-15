package com.neuroforge.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuroforge.config.AiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.*;

@Component
public class ExternalLlmProvider implements AiProvider {

    private static final Logger logger = LoggerFactory.getLogger(ExternalLlmProvider.class);
    private static final int MAX_PROMPT_LENGTH = 4000;

    private final AiProperties aiProperties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public ExternalLlmProvider(AiProperties aiProperties, RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
        this.aiProperties = aiProperties;
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder.build();
    }

    @Override
    public String generate(String type, String prompt) {
        if (!isAvailable()) {
            throw new IllegalStateException("External LLM Provider is not enabled or configured");
        }

        String endpoint = resolveEndpoint(aiProperties.getBaseUrl());
        String boundedPrompt = boundPrompt(prompt);
        Map<String, Object> payload = buildPayload(type, boundedPrompt);

        try {
            String rawResponse = restClient.post()
                    .uri(URI.create(endpoint))
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + aiProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            String content = parseContent(rawResponse);
            if (content == null || content.isBlank()) {
                throw new IllegalStateException("External LLM provider returned empty or unparseable content");
            }

            logger.info("External LLM successfully synthesized [{}] using model [{}]", type, aiProperties.getModel());
            return content.trim();

        } catch (Exception ex) {
            String sanitizedMsg = sanitizeLog(ex.getMessage());
            logger.warn("External LLM call failed [error: {}], proceeding with fallback", sanitizedMsg);
            throw new RuntimeException("External LLM invocation failed: " + sanitizedMsg, ex);
        }
    }

    @Override
    public String getProviderName() {
        return "EXTERNAL_LLM";
    }

    @Override
    public boolean isAvailable() {
        if (!aiProperties.isEnabled()) {
            return false;
        }
        if (aiProperties.getApiKey() == null || aiProperties.getApiKey().isBlank()) {
            return false;
        }
        return isValidUrl(aiProperties.getBaseUrl());
    }

    private boolean isValidUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        String lower = url.trim().toLowerCase();
        return lower.startsWith("http://") || lower.startsWith("https://");
    }

    private String resolveEndpoint(String baseUrl) {
        String trimmed = baseUrl.trim();
        if (trimmed.endsWith("/chat/completions")) {
            return trimmed;
        }
        if (trimmed.endsWith("/")) {
            return trimmed + "chat/completions";
        }
        return trimmed + "/chat/completions";
    }

    private String boundPrompt(String prompt) {
        if (prompt == null) return "";
        String trimmed = prompt.trim();
        if (trimmed.length() > MAX_PROMPT_LENGTH) {
            return trimmed.substring(0, MAX_PROMPT_LENGTH);
        }
        return trimmed;
    }

    private Map<String, Object> buildPayload(String type, String prompt) {
        String systemInstruction = switch (type != null ? type.toUpperCase() : "USER_STORY") {
            case "TEST_CASE" -> "You are a Senior QA Test Architect in the NeuroForge enterprise SDLC platform. Generate a multi-vector QA test matrix covering happy path, boundary edge cases, and authorization checks in clean Markdown.";
            case "SPRINT_RISK" -> "You are an Agile Delivery Manager in the NeuroForge platform. Analyze sprint velocity, risk factors, blocker analysis, and delivery recommendations in clean Markdown.";
            case "CODE_REVIEW" -> "You are a Principal Software Architect and Security Auditor in the NeuroForge platform. Perform architectural analysis, security assessment, and quality review in clean Markdown.";
            default -> "You are an expert enterprise Agile Business Analyst in the NeuroForge platform. Synthesize comprehensive user stories with Gherkin BDD acceptance criteria (Given/When/Then) in clean Markdown.";
        };

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemInstruction));
        messages.add(Map.of("role", "user", "content", prompt));

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", aiProperties.getModel());
        payload.put("messages", messages);
        payload.put("temperature", 0.3);
        payload.put("max_tokens", 1500);

        return payload;
    }

    private String parseContent(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) return null;
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                JsonNode message = choices.get(0).path("message");
                JsonNode content = message.path("content");
                if (!content.isMissingNode() && !content.isNull()) {
                    return content.asText();
                }
            }
        } catch (Exception ex) {
            logger.warn("Failed to parse LLM JSON response: {}", sanitizeLog(ex.getMessage()));
        }
        return null;
    }

    private String sanitizeLog(String input) {
        if (input == null) return "null";
        return input.replaceAll("(?i)(bearer\\s+|api[-_]?key[=:\\s]+|token[=:\\s]+)[a-zA-Z0-9_\\-\\.]+", "$1[REDACTED]");
    }
}