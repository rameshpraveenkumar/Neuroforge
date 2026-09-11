package com.neuroforge.dto.response;

import java.time.LocalDateTime;

public class CodeCommitResponse {

    private Integer repositoryId;
    private Integer commitNumber;
    private String commitMessage;
    private LocalDateTime commitDate;
    private Integer developerId;
    private String developerName;
    private String developerEmail;

    public CodeCommitResponse() {}

    public Integer getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Integer repositoryId) { this.repositoryId = repositoryId; }

    public Integer getCommitNumber() { return commitNumber; }
    public void setCommitNumber(Integer commitNumber) { this.commitNumber = commitNumber; }

    public String getCommitMessage() { return commitMessage; }
    public void setCommitMessage(String commitMessage) { this.commitMessage = commitMessage; }

    public LocalDateTime getCommitDate() { return commitDate; }
    public void setCommitDate(LocalDateTime commitDate) { this.commitDate = commitDate; }

    public Integer getDeveloperId() { return developerId; }
    public void setDeveloperId(Integer developerId) { this.developerId = developerId; }

    public String getDeveloperName() { return developerName; }
    public void setDeveloperName(String developerName) { this.developerName = developerName; }

    public String getDeveloperEmail() { return developerEmail; }
    public void setDeveloperEmail(String developerEmail) { this.developerEmail = developerEmail; }
}
