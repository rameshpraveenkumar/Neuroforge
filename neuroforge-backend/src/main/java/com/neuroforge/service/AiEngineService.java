package com.neuroforge.service;

import com.neuroforge.dto.request.AiGenerateRequest;
import com.neuroforge.dto.response.AiAssistantResponse;
import com.neuroforge.dto.response.AiSuggestionResponse;
import com.neuroforge.entity.AiAssistant;
import com.neuroforge.entity.AiSuggestion;
import com.neuroforge.entity.ProjectAi;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.AiAssistantRepository;
import com.neuroforge.repository.AiSuggestionRepository;
import com.neuroforge.repository.ProjectAiRepository;
import com.neuroforge.repository.ProjectRepository;
import com.neuroforge.service.ai.ExternalLlmProvider;
import com.neuroforge.service.ai.OfflineAiProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiEngineService {

    private static final Logger logger = LoggerFactory.getLogger(AiEngineService.class);

    private final AiAssistantRepository aiAssistantRepository;
    private final ProjectAiRepository projectAiRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogService auditLogService;
    private final OfflineAiProvider offlineAiProvider;
    private final ExternalLlmProvider externalLlmProvider;

    public AiEngineService(AiAssistantRepository aiAssistantRepository,
                           ProjectAiRepository projectAiRepository,
                           AiSuggestionRepository aiSuggestionRepository,
                           ProjectRepository projectRepository,
                           AuditLogService auditLogService,
                           OfflineAiProvider offlineAiProvider,
                           ExternalLlmProvider externalLlmProvider) {
        this.aiAssistantRepository = aiAssistantRepository;
        this.projectAiRepository = projectAiRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.projectRepository = projectRepository;
        this.auditLogService = auditLogService;
        this.offlineAiProvider = offlineAiProvider;
        this.externalLlmProvider = externalLlmProvider;
    }

    @Transactional(readOnly = true)
    public List<AiAssistantResponse> getAllAiAssistants() {
        return aiAssistantRepository.findAll().stream()
                .map(a -> new AiAssistantResponse(
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
            case "CODE_REVIEW" -> "CODE_REVIEW_GEN";
            default -> "USER_STORY_GEN";
        };

        AiAssistant assistant = aiAssistantRepository.findByModelName(modelName)
                .orElseGet(() -> aiAssistantRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No AI Assistant configured in system.")));

        String generatedContent = null;
        String providerUsed = "OFFLINE_HEURISTIC";

        if (externalLlmProvider != null && externalLlmProvider.isAvailable()) {
            try {
                generatedContent = externalLlmProvider.generate(type, request.getPrompt());
                if (generatedContent != null && !generatedContent.isBlank()) {
                    providerUsed = "EXTERNAL_LLM";
                }
            } catch (Exception ex) {
                logger.warn("External LLM generation failed, falling back to offline heuristic provider.");
                generatedContent = null;
            }
        }

        if (generatedContent == null || generatedContent.isBlank()) {
            generatedContent = offlineAiProvider.generate(type, request.getPrompt());
            if ("EXTERNAL_LLM".equals(providerUsed) || (externalLlmProvider != null && externalLlmProvider.isAvailable())) {
                providerUsed = "OFFLINE_FALLBACK";
            }
        }

        AiSuggestion suggestion = new AiSuggestion(assistant, generatedContent);
        suggestion = aiSuggestionRepository.save(suggestion);

        if (request.getProjectId() != null) {
            projectRepository.findById(request.getProjectId()).ifPresent(p -> {
                projectAiRepository.save(new ProjectAi(p, assistant));
            });
        }

        String auditEvent = "EXTERNAL_LLM".equals(providerUsed) ? "AI_SYNTHESIS_EXTERNAL" : "AI_SYNTHESIS_OFFLINE";
        auditLogService.record(auditEvent, "GENERATE", "AI", Long.valueOf(suggestion.getSuggestionId()),
                "Synthesized " + type + " using " + providerUsed.toLowerCase().replace('_', ' ') + " provider.");

        AiSuggestionResponse response = mapToResponse(suggestion);
        response.setSource(providerUsed);
        return response;
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