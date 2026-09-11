package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class ProjectAiId implements Serializable {
    private Integer project;
    private Integer aiAssistant;

    public ProjectAiId() {}

    public ProjectAiId(Integer project, Integer aiAssistant) {
        this.project = project;
        this.aiAssistant = aiAssistant;
    }

    public Integer getProject() { return project; }
    public void setProject(Integer project) { this.project = project; }

    public Integer getAiAssistant() { return aiAssistant; }
    public void setAiAssistant(Integer aiAssistant) { this.aiAssistant = aiAssistant; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectAiId that = (ProjectAiId) o;
        return Objects.equals(project, that.project) && Objects.equals(aiAssistant, that.aiAssistant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(project, aiAssistant);
    }
}
