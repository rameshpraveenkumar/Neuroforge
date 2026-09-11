package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "project_technologies")
@IdClass(ProjectTechnologyId.class)
public class ProjectTechnology {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Id
    @Column(name = "technology", nullable = false, length = 255)
    private String technology;

    public ProjectTechnology() {}

    public ProjectTechnology(Project project, String technology) {
        this.project = project;
        this.technology = technology;
    }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }
}
