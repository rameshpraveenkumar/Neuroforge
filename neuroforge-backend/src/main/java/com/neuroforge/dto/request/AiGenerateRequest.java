package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AiGenerateRequest {

    @NotBlank(message = "Prompt or requirement text is required")
    private String prompt;

    private String type = "USER_STORY"; // USER_STORY | TEST_CASE | SPRINT_RISK | CODE_REVIEW
    private Integer projectId;
    private Integer requirementId;
    private Integer taskId;
    private Integer sprintId;

    public AiGenerateRequest() {}

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public Integer getRequirementId() { return requirementId; }
    public void setRequirementId(Integer requirementId) { this.requirementId = requirementId; }

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getSprintId() { return sprintId; }
    public void setSprintId(Integer sprintId) { this.sprintId = sprintId; }
}
