package com.neuroforge.dto.response;

import java.time.LocalDateTime;

public class AiSuggestionResponse {

    private Integer suggestionId;
    private Integer aiId;
    private String modelName;
    private String recommendationType;
    private String suggestion;
    private LocalDateTime createdAt;
    private String source = "OFFLINE_HEURISTIC";

    public AiSuggestionResponse() {}

    public AiSuggestionResponse(Integer suggestionId, Integer aiId, String modelName, String recommendationType, String suggestion, LocalDateTime createdAt) {
        this.suggestionId = suggestionId;
        this.aiId = aiId;
        this.modelName = modelName;
        this.recommendationType = recommendationType;
        this.suggestion = suggestion;
        this.createdAt = createdAt;
    }

    public Integer getSuggestionId() { return suggestionId; }
    public void setSuggestionId(Integer suggestionId) { this.suggestionId = suggestionId; }

    public Integer getId() { return suggestionId; }

    public Integer getAiId() { return aiId; }
    public void setAiId(Integer aiId) { this.aiId = aiId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public String getSuggestionType() { return recommendationType; }

    public String getSuggestion() { return suggestion; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }

    public String getSuggestionText() { return suggestion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}