package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repositories")
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repository_id")
    private Integer repositoryId;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", unique = true, nullable = false)
    private Project project;

    @Column(name = "repository_name", nullable = false, length = 255)
    private String repositoryName;

    @Column(name = "branch", length = 255)
    private String branch = "main";

    @OneToMany(mappedBy = "repository", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepositoryCollaborator> collaborators = new ArrayList<>();

    public Repository() {}

    public Repository(Project project, String repositoryName, String branch) {
        this.project = project;
        this.repositoryName = repositoryName;
        this.branch = branch != null ? branch : "main";
    }

    public Integer getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Integer repositoryId) { this.repositoryId = repositoryId; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public List<RepositoryCollaborator> getCollaborators() { return collaborators; }
    public void setCollaborators(List<RepositoryCollaborator> collaborators) { this.collaborators = collaborators; }
}
