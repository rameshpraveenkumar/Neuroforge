package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class RepositoryCollaboratorId implements Serializable {
    private Integer repository;
    private Integer user;

    public RepositoryCollaboratorId() {}

    public RepositoryCollaboratorId(Integer repository, Integer user) {
        this.repository = repository;
        this.user = user;
    }

    public Integer getRepository() { return repository; }
    public void setRepository(Integer repository) { this.repository = repository; }

    public Integer getUser() { return user; }
    public void setUser(Integer user) { this.user = user; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RepositoryCollaboratorId that = (RepositoryCollaboratorId) o;
        return Objects.equals(repository, that.repository) && Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(repository, user);
    }
}
