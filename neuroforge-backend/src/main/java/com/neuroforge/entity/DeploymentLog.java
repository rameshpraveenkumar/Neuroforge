package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deployment_logs")
@IdClass(DeploymentLogId.class)
public class DeploymentLog {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deployment_id", nullable = false)
    private Deployment deployment;

    @Id
    @Column(name = "log_number", nullable = false)
    private Integer logNumber;

    @Column(name = "log_message", columnDefinition = "TEXT")
    private String logMessage;

    @Column(name = "log_time")
    private LocalDateTime logTime = LocalDateTime.now();

    public DeploymentLog() {}

    public DeploymentLog(Deployment deployment, Integer logNumber, String logMessage, LocalDateTime logTime) {
        this.deployment = deployment;
        this.logNumber = logNumber;
        this.logMessage = logMessage;
        this.logTime = logTime != null ? logTime : LocalDateTime.now();
    }

    public Deployment getDeployment() { return deployment; }
    public void setDeployment(Deployment deployment) { this.deployment = deployment; }

    public Integer getLogNumber() { return logNumber; }
    public void setLogNumber(Integer logNumber) { this.logNumber = logNumber; }

    public String getLogMessage() { return logMessage; }
    public void setLogMessage(String logMessage) { this.logMessage = logMessage; }

    public LocalDateTime getLogTime() { return logTime; }
    public void setLogTime(LocalDateTime logTime) { this.logTime = logTime; }
}
