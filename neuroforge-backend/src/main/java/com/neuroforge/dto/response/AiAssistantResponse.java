package com.neuroforge.dto.response;

public class AiAssistantResponse {

    private Integer aiId;
    private String modelName;
    private String version;
    private String recommendationType;

    public AiAssistantResponse() {}

    public AiAssistantResponse(Integer aiId, String modelName, String version, String recommendationType) {
        this.aiId = aiId;
        this.modelName = modelName;
        this.version = version;
        this.recommendationType = recommendationType;
    }

    public Integer getAiId() { return aiId; }
    public void setAiId(Integer aiId) { this.aiId = aiId; }

    public Integer getId() { return aiId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getName() { return modelName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public String getSpecialty() { return recommendationType; }
}