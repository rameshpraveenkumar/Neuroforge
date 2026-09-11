package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String projectName;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status = "ACTIVE";
    private Integer managerId;
    private List<String> technologies;
    private String repositoryName;

    public ProjectRequest() {}

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }
}
