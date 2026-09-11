package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_suggestions")
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggestion_id")
    private Integer suggestionId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_id", nullable = false)
    private AiAssistant aiAssistant;

    @Column(name = "suggestion", nullable = false, columnDefinition = "TEXT")
    private String suggestion;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AiSuggestion() {}

    public AiSuggestion(AiAssistant aiAssistant, String suggestion) {
        this.aiAssistant = aiAssistant;
        this.suggestion = suggestion;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getSuggestionId() { return suggestionId; }
    public void setSuggestionId(Integer suggestionId) { this.suggestionId = suggestionId; }

    public AiAssistant getAiAssistant() { return aiAssistant; }
    public void setAiAssistant(AiAssistant aiAssistant) { this.aiAssistant = aiAssistant; }

    public String getSuggestion() { return suggestion; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
