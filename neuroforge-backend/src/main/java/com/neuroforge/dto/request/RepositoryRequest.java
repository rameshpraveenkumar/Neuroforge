package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class RepositoryRequest {

    @NotNull(message = "Project ID is required")
    private Integer projectId;

    @NotBlank(message = "Repository name is required")
    private String repositoryName;

    private String branch = "main";
    private List<Integer> collaboratorUserIds;

    public RepositoryRequest() {}

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public List<Integer> getCollaboratorUserIds() { return collaboratorUserIds; }
    public void setCollaboratorUserIds(List<Integer> collaboratorUserIds) { this.collaboratorUserIds = collaboratorUserIds; }
}
