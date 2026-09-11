package com.neuroforge.controller;

import com.neuroforge.dto.request.RequirementRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.RequirementResponse;
import com.neuroforge.service.RequirementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Requirements Matrix", description = "Endpoints for managing software specifications, functional/non-functional requirements, and traceability tags")
public class RequirementController {

    private final RequirementService requirementService;

    public RequirementController(RequirementService requirementService) {
        this.requirementService = requirementService;
    }

    @GetMapping
    @Operation(summary = "List All Requirements", description = "Retrieves all requirements in the system")
    public ResponseEntity<ApiResponse<List<RequirementResponse>>> getAllRequirements() {
        return ResponseEntity.ok(ApiResponse.ok("Requirements retrieved", requirementService.getAllRequirements()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get Requirements by Project", description = "Retrieves all requirements for a specific project")
    public ResponseEntity<ApiResponse<List<RequirementResponse>>> getRequirementsByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(ApiResponse.ok("Project requirements retrieved", requirementService.getRequirementsByProject(projectId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Requirement by ID", description = "Retrieves detailed requirement specifications")
    public ResponseEntity<ApiResponse<RequirementResponse>> getRequirementById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Requirement retrieved", requirementService.getRequirementById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST')")
    @Operation(summary = "Create Requirement", description = "Creates a new requirement entry with tags")
    public ResponseEntity<ApiResponse<RequirementResponse>> createRequirement(@Valid @RequestBody RequirementRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Requirement created successfully", requirementService.createRequirement(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST')")
    @Operation(summary = "Update Requirement", description = "Updates requirement parameters, priority, or tags")
    public ResponseEntity<ApiResponse<RequirementResponse>> updateRequirement(@PathVariable Integer id, @Valid @RequestBody RequirementRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Requirement updated successfully", requirementService.updateRequirement(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER')")
    @Operation(summary = "Delete Requirement", description = "Removes a requirement from the project catalog")
    public ResponseEntity<ApiResponse<Void>> deleteRequirement(@PathVariable Integer id) {
        requirementService.deleteRequirement(id);
        return ResponseEntity.ok(ApiResponse.ok("Requirement deleted successfully", null));
    }
}
