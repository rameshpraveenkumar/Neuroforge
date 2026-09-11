package com.neuroforge.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class DeploymentResponse {

    private Integer deploymentId;
    private Integer projectId;
    private String projectName;
    private String version;
    private String environment;
    private LocalDateTime deploymentDate;
    private String status;
    private List<DeploymentLogDto> logs;

    public static class DeploymentLogDto {
        private Integer logNumber;
        private String logMessage;
        private LocalDateTime logTime;

        public DeploymentLogDto() {}

        public DeploymentLogDto(Integer logNumber, String logMessage, LocalDateTime logTime) {
            this.logNumber = logNumber;
            this.logMessage = logMessage;
            this.logTime = logTime;
        }

        public Integer getLogNumber() { return logNumber; }
        public void setLogNumber(Integer logNumber) { this.logNumber = logNumber; }

        public String getLogMessage() { return logMessage; }
        public void setLogMessage(String logMessage) { this.logMessage = logMessage; }

        public LocalDateTime getLogTime() { return logTime; }
        public void setLogTime(LocalDateTime logTime) { this.logTime = logTime; }
    }

    public DeploymentResponse() {}

    public Integer getDeploymentId() { return deploymentId; }
    public void setDeploymentId(Integer deploymentId) { this.deploymentId = deploymentId; }

    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public LocalDateTime getDeploymentDate() { return deploymentDate; }
    public void setDeploymentDate(LocalDateTime deploymentDate) { this.deploymentDate = deploymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DeploymentLogDto> getLogs() { return logs; }
    public void setLogs(List<DeploymentLogDto> logs) { this.logs = logs; }
}
