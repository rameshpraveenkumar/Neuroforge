package com.neuroforge.controller;

import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.PipelineRunResponse;
import com.neuroforge.service.CiCdSimulatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cicd")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "CI/CD Pipeline Simulator", description = "Safe, simulated continuous integration & continuous deployment pipeline runner")
public class CiCdController {

    private final CiCdSimulatorService ciCdSimulatorService;

    public CiCdController(CiCdSimulatorService ciCdSimulatorService) {
        this.ciCdSimulatorService = ciCdSimulatorService;
    }

    @GetMapping("/history")
    @Operation(summary = "Get Pipeline Run History", description = "Retrieves execution history of CI/CD pipeline runs")
    public ResponseEntity<ApiResponse<List<PipelineRunResponse>>> getPipelineHistory() {
        return ResponseEntity.ok(ApiResponse.ok("Pipeline history retrieved", ciCdSimulatorService.getPipelineHistory()));
    }

    @GetMapping("/{pipelineId}")
    @Operation(summary = "Get Pipeline Run Details", description = "Retrieves granular stage outputs and logs for a pipeline execution")
    public ResponseEntity<ApiResponse<PipelineRunResponse>> getPipelineById(@PathVariable String pipelineId) {
        return ResponseEntity.ok(ApiResponse.ok("Pipeline details retrieved", ciCdSimulatorService.getPipelineById(pipelineId)));
    }

    @PostMapping("/run/repository/{repositoryId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DEVOPS_ENGINEER', 'DEVELOPER', 'SOFTWARE_ARCHITECT', 'PROJECT_MANAGER')")
    @Operation(summary = "Trigger CI/CD Pipeline Run", description = "Safely executes simulated Lint, Compile, Test, Sonar, Docker, and Deploy stages")
    public ResponseEntity<ApiResponse<PipelineRunResponse>> triggerPipeline(@PathVariable Integer repositoryId,
                                                                            @RequestParam(value = "branch", required = false, defaultValue = "main") String branch) {
        PipelineRunResponse run = ciCdSimulatorService.triggerPipeline(repositoryId, branch);
        return ResponseEntity.ok(ApiResponse.ok("Pipeline execution completed successfully", run));
    }
}
