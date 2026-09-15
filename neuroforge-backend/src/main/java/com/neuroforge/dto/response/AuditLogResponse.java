package com.neuroforge.dto.response;

import java.time.LocalDateTime;

public class AuditLogResponse {

    private String id;
    private Long rawId;
    private String event;
    private String action;
    private String entityType;
    private Long entityId;
    private String actor;
    private String username;
    private Long userId;
    private String role;
    private String resource;
    private String status;
    private String ip;
    private LocalDateTime timestamp;
    private String details;

    public AuditLogResponse() {
    }

    public AuditLogResponse(Long rawId, String event, String action, String entityType, Long entityId,
                            String username, Long userId, String role, String resource,
                            String status, String ip, LocalDateTime timestamp, String details) {
        this.rawId = rawId;
        this.id = rawId != null ? "AUD-" + rawId : "AUD-0";
        this.event = event;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.username = username;
        this.userId = userId;
        this.role = role;
        this.actor = username != null ? (role != null ? username + " (" + formatRoleName(role) + ")" : username) : "System";
        this.resource = resource;
        this.status = status != null ? status : "SUCCESS";
        this.ip = ip != null ? ip : "127.0.0.1 (Localhost)";
        this.timestamp = timestamp;
        this.details = details;
    }

    private String formatRoleName(String role) {
        if (role == null) return "";
        return switch (role) {
            case "SYSTEM_ADMIN" -> "System Administrator";
            case "PROJECT_MANAGER" -> "Project Manager";
            case "PRODUCT_OWNER" -> "Product Owner";
            case "BUSINESS_ANALYST" -> "Business Analyst";
            case "SOFTWARE_ARCHITECT" -> "Software Architect";
            case "DEVELOPER" -> "Developer";
            case "QA_ENGINEER" -> "QA Engineer";
            case "DEVOPS_ENGINEER" -> "DevOps Engineer";
            case "CLIENT" -> "Client";
            default -> role;
        };
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
