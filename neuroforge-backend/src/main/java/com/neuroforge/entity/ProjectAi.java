package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "project_ai")
@IdClass(ProjectAiId.class)
public class ProjectAi {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ai_id", nullable = false)
    private AiAssistant aiAssistant;

    public ProjectAi() {}

    public ProjectAi(Project project, AiAssistant aiAssistant) {
        this.project = project;
        this.aiAssistant = aiAssistant;
    }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public AiAssistant getAiAssistant() { return aiAssistant; }
    public void setAiAssistant(AiAssistant aiAssistant) { this.aiAssistant = aiAssistant; }
}
