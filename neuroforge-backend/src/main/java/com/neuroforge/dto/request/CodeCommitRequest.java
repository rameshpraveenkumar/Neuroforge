package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CodeCommitRequest {

    @NotNull(message = "Repository ID is required")
    private Integer repositoryId;

    private Integer commitNumber;

    @NotBlank(message = "Commit message is required")
    private String commitMessage;

    private Integer developerId;

    public CodeCommitRequest() {}

    public Integer getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Integer repositoryId) { this.repositoryId = repositoryId; }

    public Integer getCommitNumber() { return commitNumber; }
    public void setCommitNumber(Integer commitNumber) { this.commitNumber = commitNumber; }

    public String getCommitMessage() { return commitMessage; }
    public void setCommitMessage(String commitMessage) { this.commitMessage = commitMessage; }

    public Integer getDeveloperId() { return developerId; }
    public void setDeveloperId(Integer developerId) { this.developerId = developerId; }
}
