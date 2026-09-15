package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ci_pipeline_stages")
public class CiPipelineStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id", nullable = false)
    private CiPipeline pipeline;

    @Column(name = "stage_name", nullable = false, length = 100)
    private String stageName;

    @Column(name = "stage_order", nullable = false)
    private Integer stageOrder;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "PENDING";

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "logs", columnDefinition = "LONGTEXT")
    private String logs;

    public CiPipelineStage() {}

    public CiPipelineStage(CiPipeline pipeline, String stageName, Integer stageOrder,
                           String status, LocalDateTime startedAt, LocalDateTime completedAt,
                           Long durationMs, String logs) {
        this.pipeline = pipeline;
        this.stageName = stageName;
        this.stageOrder = stageOrder;
        this.status = status != null ? status : "PENDING";
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.durationMs = durationMs;
        this.logs = logs;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CiPipeline getPipeline() { return pipeline; }
    public void setPipeline(CiPipeline pipeline) { this.pipeline = pipeline; }

    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }

    public Integer getStageOrder() { return stageOrder; }
    public void setStageOrder(Integer stageOrder) { this.stageOrder = stageOrder; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public String getLogs() { return logs; }
    public void setLogs(String logs) { this.logs = logs; }
}