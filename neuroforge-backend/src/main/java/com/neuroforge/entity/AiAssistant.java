package com.neuroforge.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ai_assistants")
public class AiAssistant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ai_id")
    private Integer aiId;

    @Column(name = "model_name", nullable = false, length = 255)
    private String modelName;

    @Column(name = "version", length = 255)
    private String version;

    @Column(name = "recommendation_type", length = 255)
    private String recommendationType;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "aiAssistant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AiSuggestion> suggestions = new ArrayList<>();

    public AiAssistant() {}

    public AiAssistant(String modelName, String version, String recommendationType) {
        this.modelName = modelName;
        this.version = version;
        this.recommendationType = recommendationType;
    }

    public Integer getAiId() { return aiId; }
    public void setAiId(Integer aiId) { this.aiId = aiId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public List<AiSuggestion> getSuggestions() { return suggestions; }
    public void setSuggestions(List<AiSuggestion> suggestions) { this.suggestions = suggestions; }
}
