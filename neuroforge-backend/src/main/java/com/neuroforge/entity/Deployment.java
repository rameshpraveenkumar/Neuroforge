package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deployments")
public class Deployment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deployment_id")
    private Integer deploymentId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "version", nullable = false, length = 255)
    private String version;

    @Column(name = "environment", length = 255)
    private String environment;

    @Column(name = "deployment_date")
    private LocalDateTime deploymentDate = LocalDateTime.now();

    @Column(name = "status", length = 255)
    private String status = "DEPLOYING";

    @OneToMany(mappedBy = "deployment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeploymentLog> logs = new ArrayList<>();

    public Deployment() {}

    public Deployment(Project project, String version, String environment, LocalDateTime deploymentDate, String status) {
        this.project = project;
        this.version = version;
        this.environment = environment;
        this.deploymentDate = deploymentDate != null ? deploymentDate : LocalDateTime.now();
        this.status = status;
    }

    public Integer getDeploymentId() { return deploymentId; }
    public void setDeploymentId(Integer deploymentId) { this.deploymentId = deploymentId; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public LocalDateTime getDeploymentDate() { return deploymentDate; }
    public void setDeploymentDate(LocalDateTime deploymentDate) { this.deploymentDate = deploymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DeploymentLog> getLogs() { return logs; }
    public void setLogs(List<DeploymentLog> logs) { this.logs = logs; }
}
