package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class ProjectTechnologyId implements Serializable {
    private Integer project;
    private String technology;

    public ProjectTechnologyId() {}

    public ProjectTechnologyId(Integer project, String technology) {
        this.project = project;
        this.technology = technology;
    }

    public Integer getProject() { return project; }
    public void setProject(Integer project) { this.project = project; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectTechnologyId that = (ProjectTechnologyId) o;
        return Objects.equals(project, that.project) && Objects.equals(technology, that.technology);
    }

    @Override
    public int hashCode() {
        return Objects.hash(project, technology);
    }
}
