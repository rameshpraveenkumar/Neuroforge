package com.neuroforge.dto.response;

import java.time.LocalDate;
import java.util.List;

public class ProjectResponse {

    private Integer projectId;
    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer managerId;
    private String managerName;
    private String repositoryName;
    private List<String> technologies;
    private long requirementsCount;
    private long sprintsCount;
    private long tasksCount;

    public ProjectResponse() {}

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

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

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public long getRequirementsCount() { return requirementsCount; }
    public void setRequirementsCount(long requirementsCount) { this.requirementsCount = requirementsCount; }

    public long getSprintsCount() { return sprintsCount; }
    public void setSprintsCount(long sprintsCount) { this.sprintsCount = sprintsCount; }

    public long getTasksCount() { return tasksCount; }
    public void setTasksCount(long tasksCount) { this.tasksCount = tasksCount; }
}
