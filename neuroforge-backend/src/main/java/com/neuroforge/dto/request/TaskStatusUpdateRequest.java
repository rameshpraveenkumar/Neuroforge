package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;

public class TaskStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public TaskStatusUpdateRequest() {}

    public TaskStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
