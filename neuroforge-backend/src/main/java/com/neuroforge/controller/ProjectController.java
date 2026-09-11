package com.neuroforge.controller;

import com.neuroforge.dto.request.ProjectRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.ProjectResponse;
import com.neuroforge.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Project Management", description = "Endpoints for managing enterprise software projects, tech stacks, and team assignments")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "List All Projects", description = "Retrieves all registered projects with aggregated stats")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.ok("Projects retrieved successfully", projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Project by ID", description = "Retrieves detailed information for a specific project")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Integer id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.ok("Project details retrieved", project));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER')")
    @Operation(summary = "Create Project", description = "Creates a new project and optionally links technologies and a Git repo")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse created = projectService.createProject(request);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Update Project", description = "Updates an existing project's metadata and tech stack")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(@PathVariable Integer id, @Valid @RequestBody ProjectRequest request) {
        ProjectResponse updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @Operation(summary = "Delete Project", description = "Deletes a project from the system (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully", null));
    }
}
