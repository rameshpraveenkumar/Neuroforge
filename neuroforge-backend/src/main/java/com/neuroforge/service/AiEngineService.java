package com.neuroforge.service;

import com.neuroforge.dto.request.AiGenerateRequest;
import com.neuroforge.dto.response.AiSuggestionResponse;
import com.neuroforge.entity.AiAssistant;
import com.neuroforge.entity.AiSuggestion;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.ProjectAi;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.AiAssistantRepository;
import com.neuroforge.repository.AiSuggestionRepository;
import com.neuroforge.repository.ProjectAiRepository;
import com.neuroforge.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiEngineService {

    private final AiAssistantRepository aiAssistantRepository;
    private final ProjectAiRepository projectAiRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogService auditLogService;

    public AiEngineService(AiAssistantRepository aiAssistantRepository,
                           ProjectAiRepository projectAiRepository,
                           AiSuggestionRepository aiSuggestionRepository,
                           ProjectRepository projectRepository,
                           AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
        this.aiAssistantRepository = aiAssistantRepository;
        this.projectAiRepository = projectAiRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<com.neuroforge.dto.response.AiAssistantResponse> getAllAiAssistants() {
        return aiAssistantRepository.findAll().stream()
                .map(a -> new com.neuroforge.dto.response.AiAssistantResponse(
                        a.getAiId(), a.getModelName(), a.getVersion(), a.getRecommendationType()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AiSuggestionResponse> getSuggestionsByAssistant(Integer aiId) {
        AiAssistant assistant = aiAssistantRepository.findById(aiId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Assistant not found with id: " + aiId));
        return aiSuggestionRepository.findByAiAssistant(assistant).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AiSuggestionResponse generateSuggestion(AiGenerateRequest request) {
        String type = request.getType() != null ? request.getType().toUpperCase() : "USER_STORY";
        String modelName = switch (type) {
            case "TEST_CASE" -> "TEST_CASE_GEN";
            case "SPRINT_RISK" -> "SPRINT_RISK";
            default -> "USER_STORY_GEN";
        };

        AiAssistant assistant = aiAssistantRepository.findByModelName(modelName)
                .orElseGet(() -> aiAssistantRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No AI Assistant configured in system.")));

        String generatedContent = synthesizeOfflineContent(type, request.getPrompt());

        AiSuggestion suggestion = new AiSuggestion(assistant, generatedContent);
        suggestion = aiSuggestionRepository.save(suggestion);

        if (request.getProjectId() != null) {
            projectRepository.findById(request.getProjectId()).ifPresent(p -> {
                projectAiRepository.save(new ProjectAi(p, assistant));
            });
        }

        auditLogService.record("AI_SYNTHESIS_OFFLINE", "GENERATE", "AI", Long.valueOf(suggestion.getSuggestionId()), "Synthesized " + type + " with offline heuristic inference provider.");
        return mapToResponse(suggestion);
    }

    private String synthesizeOfflineContent(String type, String inputPrompt) {
        String topic = inputPrompt != null && !inputPrompt.isBlank() ? inputPrompt.trim() : "System Feature";

        return switch (type) {
            case "TEST_CASE" -> """
                    ### 🧪 AI-Generated Multi-Vector QA Test Matrix for: %s
                    
                    **Test Scenario 1: Happy Path Execution**
                    - *Precondition*: Authenticated user with authorized permissions.
                    - *Action*: Submit valid request payload matching API specifications.
                    - *Expected Result*: HTTP 200 OK returned with structured ApiResponse and valid state update.
                    
                    **Test Scenario 2: Boundary & Edge Condition**
                    - *Precondition*: Concurrent write requests targeting identical resource.
                    - *Action*: Dispatch simultaneous update calls within 10ms window.
                    - *Expected Result*: Optimistic lock check prevents lost updates; returns HTTP 409 Conflict if conflict occurs.
                    
                    **Test Scenario 3: Negative / Authorization Check**
                    - *Precondition*: Unauthorized or expired Bearer JWT token.
                    - *Action*: Invoke protected endpoint with mutated signature.
                    - *Expected Result*: HTTP 401 Unauthorized / HTTP 403 Forbidden with security error envelope.
                    """.formatted(topic);

            case "SPRINT_RISK" -> """
                    ### 📊 AI Sprint Velocity & Delivery Risk Assessment: %s
                    
                    - **Overall Health Score**: 88/100 (LOW RISK - On Track)
                    - **Burnup / Velocity Indicator**: Estimated 92%% completion by sprint deadline.
                    - **Risk Factors Identified**:
                      1. 1 pending high-priority bug in verification queue.
                      2. 2 tasks currently in code review stage awaiting approval.
                    - **Recommendations**:
                      - Expedite QA verification for critical defect.
                      - Pair developers on final integration tests.
                    """.formatted(topic);

            case "CODE_REVIEW" -> """
                    ### 🔍 AI Automated Code Review & Security Analysis: %s
                    
                    - **Architecture & Maintainability**: Clean separation between DTOs, Services, and Repositories.
                    - **Security Evaluation**: Method-level @PreAuthorize correctly configured for RBAC.
                    - **Performance Optimization**: Lazy loading enabled on collections to prevent N+1 queries.
                    - **Verdict**: LGTM! Meets enterprise quality standards.
                    """.formatted(topic);

            default -> """
                    ### 📖 AI-Generated User Story & Acceptance Criteria: %s
                    
                    **User Story**:
                    *As an* Enterprise User,
                    *I want* to %s,
                    *So that* my team can maintain full SDLC traceability and operational efficiency.
                    
                    **Gherkin Acceptance Criteria (BDD)**:
                    - **Given** an authenticated user with appropriate role permissions
                    - **When** the user accesses the management portal and submits valid parameters
                    - **Then** the system should validate the input, persist the relational record, and return an audit confirmation.
                    """.formatted(topic, topic.toLowerCase());
        };
    }

    private AiSuggestionResponse mapToResponse(AiSuggestion s) {
        return new AiSuggestionResponse(
                s.getSuggestionId(),
                s.getAiAssistant().getAiId(),
                s.getAiAssistant().getModelName(),
                s.getAiAssistant().getRecommendationType(),
                s.getSuggestion(),
                s.getCreatedAt()
        );
    }
}
