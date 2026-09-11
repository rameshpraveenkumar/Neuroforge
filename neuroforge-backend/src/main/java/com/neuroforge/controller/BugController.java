package com.neuroforge.controller;

import com.neuroforge.dto.request.BugRequest;
import com.neuroforge.dto.request.BugStatusUpdateRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.BugResponse;
import com.neuroforge.service.BugService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Bug & Defect Tracker", description = "Endpoints for bug reporting, severity triage, developer assignment, and defect verification")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

    @GetMapping
    @Operation(summary = "List All Bugs", description = "Retrieves all reported defects across projects")
    public ResponseEntity<ApiResponse<List<BugResponse>>> getAllBugs() {
        return ResponseEntity.ok(ApiResponse.ok("Bugs retrieved", bugService.getAllBugs()));
    }

    @GetMapping("/test-case/task/{taskId}/test/{testNumber}")
    @Operation(summary = "Get Bugs by Test Case", description = "Retrieves bugs linked to a specific test case failure")
    public ResponseEntity<ApiResponse<List<BugResponse>>> getBugsByTestCase(@PathVariable Integer taskId, @PathVariable Integer testNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Test case bugs retrieved", bugService.getBugsByTestCase(taskId, testNumber)));
    }

    @GetMapping("/developer/{developerId}")
    @Operation(summary = "Get Bugs by Assigned Developer", description = "Retrieves bugs assigned to a specific engineer for fixing")
    public ResponseEntity<ApiResponse<List<BugResponse>>> getBugsByAssignee(@PathVariable Integer developerId) {
        return ResponseEntity.ok(ApiResponse.ok("Developer bugs retrieved", bugService.getBugsByAssignee(developerId)));
    }

    @GetMapping("/task/{taskId}/test/{testNumber}/bug/{bugNumber}")
    @Operation(summary = "Get Bug Details", description = "Retrieves full bug details by composite key")
    public ResponseEntity<ApiResponse<BugResponse>> getBug(@PathVariable Integer taskId,
                                                           @PathVariable Integer testNumber,
                                                           @PathVariable Integer bugNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Bug retrieved", bugService.getBug(taskId, testNumber, bugNumber)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER', 'CLIENT')")
    @Operation(summary = "Report Bug", description = "Reports a new defect against a test case")
    public ResponseEntity<ApiResponse<BugResponse>> createBug(@Valid @RequestBody BugRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Bug reported successfully", bugService.createBug(request)));
    }

    @PatchMapping("/task/{taskId}/test/{testNumber}/bug/{bugNumber}/status")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER')")
    @Operation(summary = "Update Bug Status & Assignee", description = "Transitions bug status (NEW -> IN_FIX -> VERIFIED -> CLOSED)")
    public ResponseEntity<ApiResponse<BugResponse>> updateBugStatus(@PathVariable Integer taskId,
                                                                    @PathVariable Integer testNumber,
                                                                    @PathVariable Integer bugNumber,
                                                                    @Valid @RequestBody BugStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Bug status updated", bugService.updateBugStatus(taskId, testNumber, bugNumber, request)));
    }

    @DeleteMapping("/task/{taskId}/test/{testNumber}/bug/{bugNumber}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER')")
    @Operation(summary = "Delete Bug", description = "Removes a defect record from the system")
    public ResponseEntity<ApiResponse<Void>> deleteBug(@PathVariable Integer taskId,
                                                       @PathVariable Integer testNumber,
                                                       @PathVariable Integer bugNumber) {
        bugService.deleteBug(taskId, testNumber, bugNumber);
        return ResponseEntity.ok(ApiResponse.ok("Bug deleted successfully", null));
    }
}
