package com.neuroforge.controller;

import com.neuroforge.dto.request.CodeCommitRequest;
import com.neuroforge.dto.request.RepositoryRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.CodeCommitResponse;
import com.neuroforge.dto.response.RepositoryResponse;
import com.neuroforge.service.CodeCommitService;
import com.neuroforge.service.RepositoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Repositories & Code Commits", description = "Endpoints for Git repository settings, collaborator permissions, and commit history")
public class RepositoryController {

    private final RepositoryService repositoryService;
    private final CodeCommitService codeCommitService;

    public RepositoryController(RepositoryService repositoryService, CodeCommitService codeCommitService) {
        this.repositoryService = repositoryService;
        this.codeCommitService = codeCommitService;
    }

    @GetMapping("/repositories")
    @Operation(summary = "List All Repositories", description = "Retrieves all Git repositories linked to projects")
    public ResponseEntity<ApiResponse<List<RepositoryResponse>>> getAllRepositories() {
        return ResponseEntity.ok(ApiResponse.ok("Repositories retrieved", repositoryService.getAllRepositories()));
    }

    @GetMapping("/repositories/{id}")
    @Operation(summary = "Get Repository by ID", description = "Retrieves repository details with collaborators")
    public ResponseEntity<ApiResponse<RepositoryResponse>> getRepositoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Repository retrieved", repositoryService.getRepositoryById(id)));
    }

    @GetMapping("/repositories/project/{projectId}")
    @Operation(summary = "Get Repository by Project", description = "Retrieves repository configured for a project")
    public ResponseEntity<ApiResponse<RepositoryResponse>> getRepositoryByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(ApiResponse.ok("Repository retrieved", repositoryService.getRepositoryByProject(projectId)));
    }

    @PostMapping("/repositories")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVOPS_ENGINEER')")
    @Operation(summary = "Create Repository", description = "Registers a new Git repository and binds it to a project")
    public ResponseEntity<ApiResponse<RepositoryResponse>> createRepository(@Valid @RequestBody RepositoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Repository created successfully", repositoryService.createRepository(request)));
    }

    @PostMapping("/repositories/{id}/collaborators/{userId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT')")
    @Operation(summary = "Add Collaborator", description = "Grants user access permissions to a repository")
    public ResponseEntity<ApiResponse<Void>> addCollaborator(@PathVariable Integer id, @PathVariable Integer userId) {
        repositoryService.addCollaborator(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Collaborator added successfully", null));
    }

    @GetMapping("/commits/repository/{repositoryId}")
    @Operation(summary = "Get Commits by Repository", description = "Retrieves git commit history for a repository")
    public ResponseEntity<ApiResponse<List<CodeCommitResponse>>> getCommitsByRepository(@PathVariable Integer repositoryId) {
        return ResponseEntity.ok(ApiResponse.ok("Commits retrieved", codeCommitService.getCommitsByRepository(repositoryId)));
    }

    @PostMapping("/commits")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DEVELOPER', 'SOFTWARE_ARCHITECT', 'DEVOPS_ENGINEER')")
    @Operation(summary = "Record Code Commit", description = "Records a simulated git commit against a repository")
    public ResponseEntity<ApiResponse<CodeCommitResponse>> recordCommit(@Valid @RequestBody CodeCommitRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Commit recorded successfully", codeCommitService.recordCommit(request)));
    }
}
