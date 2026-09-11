package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class CodeCommitId implements Serializable {
    private Integer repository;
    private Integer commitNumber;

    public CodeCommitId() {}

    public CodeCommitId(Integer repository, Integer commitNumber) {
        this.repository = repository;
        this.commitNumber = commitNumber;
    }

    public Integer getRepository() { return repository; }
    public void setRepository(Integer repository) { this.repository = repository; }

    public Integer getCommitNumber() { return commitNumber; }
    public void setCommitNumber(Integer commitNumber) { this.commitNumber = commitNumber; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CodeCommitId that = (CodeCommitId) o;
        return Objects.equals(repository, that.repository) && Objects.equals(commitNumber, that.commitNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(repository, commitNumber);
    }
}
