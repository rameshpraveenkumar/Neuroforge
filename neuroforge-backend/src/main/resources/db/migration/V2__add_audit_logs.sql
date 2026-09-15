-- ====================================================================
-- NeuroForge Flyway Migration V2: Add Audit Logs Schema
-- ====================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NULL,
    username VARCHAR(100) NULL,
    user_id BIGINT NULL,
    role VARCHAR(50) NULL,
    description TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    resource_path VARCHAR(255) NULL,
    ip_address VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_logs_created_at (created_at),
    INDEX idx_audit_logs_user_id (user_id),
    INDEX idx_audit_logs_event_type (event_type),
    INDEX idx_audit_logs_entity_type (entity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
