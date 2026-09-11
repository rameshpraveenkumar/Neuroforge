package com.neuroforge.dto.response;

import java.util.List;

public class RepositoryResponse {

    private Integer repositoryId;
    private Integer projectId;
    private String projectName;
    private String repositoryName;
    private String branch;
    private long totalCommits;
    private List<UserProfileResponse> collaborators;

    public RepositoryResponse() {}

    public Integer getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Integer repositoryId) { this.repositoryId = repositoryId; }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public long getTotalCommits() { return totalCommits; }
    public void setTotalCommits(long totalCommits) { this.totalCommits = totalCommits; }

    public List<UserProfileResponse> getCollaborators() { return collaborators; }
    public void setCollaborators(List<UserProfileResponse> collaborators) { this.collaborators = collaborators; }
}
