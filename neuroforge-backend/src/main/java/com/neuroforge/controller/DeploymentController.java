package com.neuroforge.controller;

import com.neuroforge.dto.request.DeploymentRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.DeploymentResponse;
import com.neuroforge.service.DeploymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployments")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Deployments & Environments", description = "Endpoints for multi-environment deployments (DEV, QA, STAGING, PROD) and release logs")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @GetMapping
    @Operation(summary = "List All Deployments", description = "Retrieves all deployment records across environments")
    public ResponseEntity<ApiResponse<List<DeploymentResponse>>> getAllDeployments() {
        return ResponseEntity.ok(ApiResponse.ok("Deployments retrieved", deploymentService.getAllDeployments()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get Deployments by Project", description = "Retrieves deployment history for a specific project")
    public ResponseEntity<ApiResponse<List<DeploymentResponse>>> getDeploymentsByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(ApiResponse.ok("Project deployments retrieved", deploymentService.getDeploymentsByProject(projectId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Deployment Details", description = "Retrieves deployment metadata and execution logs")
    public ResponseEntity<ApiResponse<DeploymentResponse>> getDeploymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Deployment retrieved", deploymentService.getDeploymentById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DEVOPS_ENGINEER', 'PROJECT_MANAGER')")
    @Operation(summary = "Trigger Environment Deployment", description = "Deploys a release version to DEV, QA, STAGING, or PRODUCTION")
    public ResponseEntity<ApiResponse<DeploymentResponse>> triggerDeployment(@Valid @RequestBody DeploymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Deployment triggered successfully", deploymentService.triggerDeployment(request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DEVOPS_ENGINEER')")
    @Operation(summary = "Update Deployment Status", description = "Updates status (HEALTHY, DEGRADED, ROLLED_BACK)")
    public ResponseEntity<ApiResponse<DeploymentResponse>> updateDeploymentStatus(@PathVariable Integer id, @RequestParam("status") String status) {
        return ResponseEntity.ok(ApiResponse.ok("Deployment status updated", deploymentService.updateDeploymentStatus(id, status)));
    }
}
