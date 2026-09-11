package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class DocumentationId implements Serializable {
    private Integer project;
    private Integer documentVersion;

    public DocumentationId() {}

    public DocumentationId(Integer project, Integer documentVersion) {
        this.project = project;
        this.documentVersion = documentVersion;
    }

    public Integer getProject() { return project; }
    public void setProject(Integer project) { this.project = project; }

    public Integer getDocumentVersion() { return documentVersion; }
    public void setDocumentVersion(Integer documentVersion) { this.documentVersion = documentVersion; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentationId that = (DocumentationId) o;
        return Objects.equals(project, that.project) && Objects.equals(documentVersion, that.documentVersion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(project, documentVersion);
    }
}
