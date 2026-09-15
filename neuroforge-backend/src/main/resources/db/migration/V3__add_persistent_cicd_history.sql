-- ====================================================================
-- NeuroForge Flyway Migration V3: Add Persistent CI/CD History Schema
-- ====================================================================

CREATE TABLE IF NOT EXISTS ci_pipelines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pipeline_id VARCHAR(50) NOT NULL UNIQUE,
    repository_id INT NULL,
    project_id INT NULL,
    triggered_by INT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    branch_name VARCHAR(255) NULL,
    commit_hash VARCHAR(255) NULL,
    pipeline_name VARCHAR(255) NULL,
    duration_ms BIGINT NULL,
    started_at DATETIME(6) NULL,
    completed_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_ci_pipelines_repository FOREIGN KEY (repository_id) REFERENCES repositories(repository_id) ON DELETE SET NULL,
    CONSTRAINT fk_ci_pipelines_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL,
    CONSTRAINT fk_ci_pipelines_user FOREIGN KEY (triggered_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_ci_pipelines_repository_id (repository_id),
    INDEX idx_ci_pipelines_project_id (project_id),
    INDEX idx_ci_pipelines_triggered_by (triggered_by),
    INDEX idx_ci_pipelines_status (status),
    INDEX idx_ci_pipelines_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ci_pipeline_stages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pipeline_id BIGINT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    started_at DATETIME(6) NULL,
    completed_at DATETIME(6) NULL,
    duration_ms BIGINT NULL,
    logs LONGTEXT NULL,
    CONSTRAINT fk_ci_pipeline_stages_pipeline FOREIGN KEY (pipeline_id) REFERENCES ci_pipelines(id) ON DELETE CASCADE,
    INDEX idx_ci_pipeline_stages_pipeline_id (pipeline_id),
    INDEX idx_ci_pipeline_stages_stage_order (stage_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
