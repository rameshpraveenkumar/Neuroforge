package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "repository_collaborators")
@IdClass(RepositoryCollaboratorId.class)
public class RepositoryCollaborator {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public RepositoryCollaborator() {}

    public RepositoryCollaborator(Repository repository, User user) {
        this.repository = repository;
        this.user = user;
    }

    public Repository getRepository() { return repository; }
    public void setRepository(Repository repository) { this.repository = repository; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
