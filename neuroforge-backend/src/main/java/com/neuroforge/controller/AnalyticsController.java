package com.neuroforge.controller;

import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.DoraMetricsResponse;
import com.neuroforge.dto.response.SystemOverviewResponse;
import com.neuroforge.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Analytics & DORA Metrics", description = "Endpoints for SDLC executive overview, DORA DevOps benchmarks, and health metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    @Operation(summary = "System Overview KPI Aggregates", description = "Retrieves real-time counts and distributions across all SDLC entities")
    public ResponseEntity<ApiResponse<SystemOverviewResponse>> getSystemOverview() {
        return ResponseEntity.ok(ApiResponse.ok("System overview retrieved", analyticsService.getSystemOverview()));
    }

    @GetMapping("/dora")
    @Operation(summary = "DORA DevOps Performance Metrics", description = "Calculates Deployment Frequency, Lead Time for Changes, MTTR, and Change Failure Rate")
    public ResponseEntity<ApiResponse<DoraMetricsResponse>> getDoraMetrics() {
        return ResponseEntity.ok(ApiResponse.ok("DORA metrics retrieved", analyticsService.getDoraMetrics()));
    }
}
