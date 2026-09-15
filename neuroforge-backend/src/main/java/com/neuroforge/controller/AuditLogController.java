package com.neuroforge.controller;

import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.AuditLogResponse;
import com.neuroforge.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Security Audit Logs & Governance", description = "Immutable audit trail capturing authentication events, promotions, and privileged domain operations")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @Operation(summary = "Get Audit Logs", description = "Retrieves immutable security audit logs with optional event/entity filtering")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogs(
            @RequestParam(value = "eventType", required = false) String eventType,
            @RequestParam(value = "entityType", required = false) String entityType,
            @RequestParam(value = "username", required = false) String username) {
        List<AuditLogResponse> logs = auditLogService.getAuditLogs(eventType, entityType, username);
        return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved successfully", logs));
    }
}
