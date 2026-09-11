package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documentation")
@IdClass(DocumentationId.class)
public class Documentation {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Id
    @Column(name = "document_version", nullable = false)
    private Integer documentVersion;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "document_type", length = 255)
    private String documentType = "ADR";

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    public Documentation() {}

    public Documentation(Project project, Integer documentVersion, String title, String documentType, LocalDateTime createdDate) {
        this.project = project;
        this.documentVersion = documentVersion;
        this.title = title;
        this.documentType = documentType;
        this.createdDate = createdDate != null ? createdDate : LocalDateTime.now();
    }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Integer getDocumentVersion() { return documentVersion; }
    public void setDocumentVersion(Integer documentVersion) { this.documentVersion = documentVersion; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
