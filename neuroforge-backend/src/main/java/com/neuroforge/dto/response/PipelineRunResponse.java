package com.neuroforge.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class PipelineRunResponse {

    private String pipelineId;
    private Integer repositoryId;
    private String repositoryName;
    private String branch;
    private String commitHash;
    private String status; // SUCCESS, FAILED, RUNNING
    private Long durationMs;
    private LocalDateTime startedAt;
    private List<PipelineStageDto> stages;

    public static class PipelineStageDto {
        private String stageName;
        private String status; // SUCCESS, FAILED, RUNNING
        private Long durationMs;
        private List<String> logs;

        public PipelineStageDto() {}

        public PipelineStageDto(String stageName, String status, Long durationMs, List<String> logs) {
            this.stageName = stageName;
            this.status = status;
            this.durationMs = durationMs;
            this.logs = logs;
        }

        public String getStageName() { return stageName; }
        public void setStageName(String stageName) { this.stageName = stageName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getDurationMs() { return durationMs; }
        public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

        public List<String> getLogs() { return logs; }
        public void setLogs(List<String> logs) { this.logs = logs; }
    }

    public PipelineRunResponse() {}

    public String getPipelineId() { return pipelineId; }
    public void setPipelineId(String pipelineId) { this.pipelineId = pipelineId; }

    public Integer getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Integer repositoryId) { this.repositoryId = repositoryId; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public List<PipelineStageDto> getStages() { return stages; }
    public void setStages(List<PipelineStageDto> stages) { this.stages = stages; }
}
