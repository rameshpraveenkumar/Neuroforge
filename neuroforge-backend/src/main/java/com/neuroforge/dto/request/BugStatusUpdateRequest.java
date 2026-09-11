package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;

public class BugStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private Integer assignedDeveloperId;

    public BugStatusUpdateRequest() {}

    public BugStatusUpdateRequest(String status, Integer assignedDeveloperId) {
        this.status = status;
        this.assignedDeveloperId = assignedDeveloperId;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAssignedDeveloperId() { return assignedDeveloperId; }
    public void setAssignedDeveloperId(Integer assignedDeveloperId) { this.assignedDeveloperId = assignedDeveloperId; }
}
