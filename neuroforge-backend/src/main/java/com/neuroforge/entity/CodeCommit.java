package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_commits")
@IdClass(CodeCommitId.class)
public class CodeCommit {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @Id
    @Column(name = "commit_number", nullable = false)
    private Integer commitNumber;

    @Column(name = "commit_message", columnDefinition = "TEXT")
    private String commitMessage;

    @Column(name = "commit_date")
    private LocalDateTime commitDate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "developer_id")
    private User developer;

    public CodeCommit() {}

    public CodeCommit(Repository repository, Integer commitNumber, String commitMessage, LocalDateTime commitDate, User developer) {
        this.repository = repository;
        this.commitNumber = commitNumber;
        this.commitMessage = commitMessage;
        this.commitDate = commitDate != null ? commitDate : LocalDateTime.now();
        this.developer = developer;
    }

    public Repository getRepository() { return repository; }
    public void setRepository(Repository repository) { this.repository = repository; }

    public Integer getCommitNumber() { return commitNumber; }
    public void setCommitNumber(Integer commitNumber) { this.commitNumber = commitNumber; }

    public String getCommitMessage() { return commitMessage; }
    public void setCommitMessage(String commitMessage) { this.commitMessage = commitMessage; }

    public LocalDateTime getCommitDate() { return commitDate; }
    public void setCommitDate(LocalDateTime commitDate) { this.commitDate = commitDate; }

    public User getDeveloper() { return developer; }
    public void setDeveloper(User developer) { this.developer = developer; }
}
