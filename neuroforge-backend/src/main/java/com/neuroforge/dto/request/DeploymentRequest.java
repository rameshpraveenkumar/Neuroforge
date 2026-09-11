package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeploymentRequest {

    @NotNull(message = "Project ID is required")
    private Integer projectId;

    @NotBlank(message = "Version is required")
    private String version;

    @NotBlank(message = "Environment is required (DEV, QA, STAGING, PRODUCTION)")
    private String environment;

    private String status = "HEALTHY";

    public DeploymentRequest() {}

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
