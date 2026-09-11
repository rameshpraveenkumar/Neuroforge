package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "requirements")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requirement_id")
    private Integer requirementId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "requirement_name", nullable = false, length = 255)
    private String requirementName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", length = 255)
    private String priority = "MUST_HAVE";

    @Column(name = "status", length = 255)
    private String status = "DRAFT";

    @OneToMany(mappedBy = "requirement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequirementTag> tags = new ArrayList<>();

    public Requirement() {}

    public Requirement(Project project, String requirementName, String description, String priority, String status) {
        this.project = project;
        this.requirementName = requirementName;
        this.description = description;
        this.priority = priority;
        this.status = status;
    }

    public Integer getRequirementId() { return requirementId; }
    public void setRequirementId(Integer requirementId) { this.requirementId = requirementId; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getRequirementName() { return requirementName; }
    public void setRequirementName(String requirementName) { this.requirementName = requirementName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<RequirementTag> getTags() { return tags; }
    public void setTags(List<RequirementTag> tags) { this.tags = tags; }
}
