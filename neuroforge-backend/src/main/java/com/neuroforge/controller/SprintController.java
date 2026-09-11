package com.neuroforge.controller;

import com.neuroforge.dto.request.SprintRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.SprintResponse;
import com.neuroforge.service.SprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Sprints & Backlog", description = "Endpoints for Agile sprint planning, lifecycle management, and sprint goal tracking")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @GetMapping
    @Operation(summary = "List All Sprints", description = "Retrieves all sprints across all projects")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> getAllSprints() {
        return ResponseEntity.ok(ApiResponse.ok("Sprints retrieved", sprintService.getAllSprints()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get Sprints by Project", description = "Retrieves sprints belonging to a specific project")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> getSprintsByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(ApiResponse.ok("Project sprints retrieved", sprintService.getSprintsByProject(projectId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Sprint by ID", description = "Retrieves a specific sprint with completion metrics and goals")
    public ResponseEntity<ApiResponse<SprintResponse>> getSprintById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Sprint retrieved", sprintService.getSprintById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER')")
    @Operation(summary = "Create Sprint", description = "Creates a new sprint with target dates and sprint goals")
    public ResponseEntity<ApiResponse<SprintResponse>> createSprint(@Valid @RequestBody SprintRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Sprint created successfully", sprintService.createSprint(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER')")
    @Operation(summary = "Update Sprint", description = "Updates sprint status, dates, or goals")
    public ResponseEntity<ApiResponse<SprintResponse>> updateSprint(@PathVariable Integer id, @Valid @RequestBody SprintRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Sprint updated successfully", sprintService.updateSprint(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Delete Sprint", description = "Removes a sprint from the project")
    public ResponseEntity<ApiResponse<Void>> deleteSprint(@PathVariable Integer id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.ok(ApiResponse.ok("Sprint deleted successfully", null));
    }
}
