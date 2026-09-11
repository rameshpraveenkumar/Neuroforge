package com.neuroforge.controller;

import com.neuroforge.dto.request.DocumentationRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.DocumentationResponse;
import com.neuroforge.service.DocumentationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documentation")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Architecture & ADRs", description = "Endpoints for Architectural Decision Records (ADRs), system designs, and technical documentation")
public class DocumentationController {

    private final DocumentationService documentationService;

    public DocumentationController(DocumentationService documentationService) {
        this.documentationService = documentationService;
    }

    @GetMapping
    @Operation(summary = "List All Documentation", description = "Retrieves all documentation and ADRs across projects")
    public ResponseEntity<ApiResponse<List<DocumentationResponse>>> getAllDocumentation() {
        return ResponseEntity.ok(ApiResponse.ok("Documentation retrieved", documentationService.getAllDocumentation()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get Documentation by Project", description = "Retrieves architecture documents and ADRs for a specific project")
    public ResponseEntity<ApiResponse<List<DocumentationResponse>>> getDocumentationByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(ApiResponse.ok("Project documentation retrieved", documentationService.getDocumentationByProject(projectId)));
    }

    @GetMapping("/project/{projectId}/version/{version}")
    @Operation(summary = "Get Document by Version", description = "Retrieves a specific version of project documentation")
    public ResponseEntity<ApiResponse<DocumentationResponse>> getDocumentation(@PathVariable Integer projectId, @PathVariable Integer version) {
        return ResponseEntity.ok(ApiResponse.ok("Document retrieved", documentationService.getDocumentation(projectId, version)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SOFTWARE_ARCHITECT', 'PROJECT_MANAGER', 'PRODUCT_OWNER')")
    @Operation(summary = "Create Documentation / ADR", description = "Publishes a new ADR or technical architecture document")
    public ResponseEntity<ApiResponse<DocumentationResponse>> createDocumentation(@Valid @RequestBody DocumentationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Documentation published successfully", documentationService.createDocumentation(request)));
    }

    @PutMapping("/project/{projectId}/version/{version}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SOFTWARE_ARCHITECT', 'PROJECT_MANAGER')")
    @Operation(summary = "Update Documentation", description = "Updates an existing architecture document")
    public ResponseEntity<ApiResponse<DocumentationResponse>> updateDocumentation(@PathVariable Integer projectId,
                                                                                  @PathVariable Integer version,
                                                                                  @Valid @RequestBody DocumentationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Documentation updated successfully", documentationService.updateDocumentation(projectId, version, request)));
    }

    @DeleteMapping("/project/{projectId}/version/{version}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SOFTWARE_ARCHITECT')")
    @Operation(summary = "Delete Documentation", description = "Deletes an architecture document from the project")
    public ResponseEntity<ApiResponse<Void>> deleteDocumentation(@PathVariable Integer projectId, @PathVariable Integer version) {
        documentationService.deleteDocumentation(projectId, version);
        return ResponseEntity.ok(ApiResponse.ok("Documentation deleted successfully", null));
    }
}
