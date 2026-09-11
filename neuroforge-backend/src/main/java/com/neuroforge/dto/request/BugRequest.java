package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BugRequest {

    @NotNull(message = "Task ID is required")
    private Integer taskId;

    @NotNull(message = "Test number is required")
    private Integer testNumber;

    private Integer bugNumber;

    @NotBlank(message = "Bug title is required")
    private String bugTitle;

    private String severity = "MAJOR";
    private String status = "NEW";
    private Integer assignedDeveloperId;

    public BugRequest() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    public Integer getBugNumber() { return bugNumber; }
    public void setBugNumber(Integer bugNumber) { this.bugNumber = bugNumber; }

    public String getBugTitle() { return bugTitle; }
    public void setBugTitle(String bugTitle) { this.bugTitle = bugTitle; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAssignedDeveloperId() { return assignedDeveloperId; }
    public void setAssignedDeveloperId(Integer assignedDeveloperId) { this.assignedDeveloperId = assignedDeveloperId; }
}
