package com.neuroforge.service;

import com.neuroforge.dto.response.AuditLogResponse;
import com.neuroforge.entity.AuditLog;
import com.neuroforge.entity.User;
import com.neuroforge.repository.AuditLogRepository;
import com.neuroforge.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logEvent(String eventType, String action, String entityType, Long entityId,
                         String username, Long userId, String role, String description,
                         String status, String resourcePath, String ipAddress) {
        try {
            if (username == null || username.isBlank()) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                    username = auth.getName();
                }
            }

            final String uName = username;
            if ((userId == null || role == null) && uName != null && !uName.isBlank()) {
                User user = userRepository.findByName(uName).or(() -> userRepository.findByEmail(uName)).orElse(null);
                if (user != null) {
                    if (userId == null) userId = user.getUserId() != null ? user.getUserId().longValue() : null;
                    if (role == null) role = user.getRole();
                }
            }

            if (ipAddress == null || resourcePath == null) {
                ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attrs != null) {
                    HttpServletRequest request = attrs.getRequest();
                    if (ipAddress == null) {
                        String xForwarded = request.getHeader("X-Forwarded-For");
                        if (xForwarded != null && !xForwarded.isBlank()) {
                            ipAddress = xForwarded.split(",")[0].trim();
                        } else {
                            ipAddress = request.getRemoteAddr();
                            if ("0:0:0:0:0:0:0:1".equals(ipAddress)) ipAddress = "127.0.0.1 (Localhost)";
                        }
                    }
                    if (resourcePath == null) {
                        resourcePath = request.getRequestURI();
                        if (request.getQueryString() != null) resourcePath += "?" + request.getQueryString();
                    }
                }
            }

            if (ipAddress == null) ipAddress = "127.0.0.1 (Localhost)";
            if (resourcePath == null) resourcePath = "/api/" + entityType.toLowerCase();

            description = sanitize(description);
            resourcePath = sanitize(resourcePath);

            AuditLog log = new AuditLog(
                    eventType, action, entityType, entityId,
                    username, userId, role, description,
                    status != null ? status : "SUCCESS",
                    resourcePath, ipAddress
            );

            auditLogRepository.save(log);
            logger.debug("Recorded audit log: [{}] {} by user {}", eventType, action, username);

        } catch (Exception ex) {
            logger.error("Failed to record audit event [{}]: {}", eventType, ex.getMessage(), ex);
        }
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)(password|token|secret|access_token|refresh_token|bearer)=[^\s&]+", "$1=[REDACTED]");
    }

    public void record(String eventType, String action, String entityType, Long entityId, String description) {
        logEvent(eventType, action, entityType, entityId, null, null, null, description, "SUCCESS", null, null);
    }

    public void recordFailure(String eventType, String action, String entityType, Long entityId, String username, String description) {
        logEvent(eventType, action, entityType, entityId, username, null, null, description, "FAILED", null, null);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(String eventType, String entityType, String username) {
        List<AuditLog> logs;

        if (eventType != null && !eventType.isBlank()) {
            logs = auditLogRepository.findByEventTypeOrderByCreatedAtDesc(eventType);
        } else if (entityType != null && !entityType.isBlank()) {
            logs = auditLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType);
        } else if (username != null && !username.isBlank()) {
            logs = auditLogRepository.findByUsernameOrderByCreatedAtDesc(username);
        } else {
            logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        }

        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getEventType(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getUsername(),
                log.getUserId(),
                log.getRole(),
                log.getResourcePath(),
                log.getStatus(),
                log.getIpAddress(),
                log.getCreatedAt(),
                log.getDescription()
        );
    }
}
