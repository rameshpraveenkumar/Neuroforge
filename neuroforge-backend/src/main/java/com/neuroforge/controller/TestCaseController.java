package com.neuroforge.controller;

import com.neuroforge.dto.request.TestCaseRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.TestCaseResponse;
import com.neuroforge.service.TestCaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "QA & Test Center", description = "Endpoints for QA test specifications, validation steps, and expected outcomes")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @GetMapping
    @Operation(summary = "List All Test Cases", description = "Retrieves all test cases in the system")
    public ResponseEntity<ApiResponse<List<TestCaseResponse>>> getAllTestCases() {
        return ResponseEntity.ok(ApiResponse.ok("Test cases retrieved", testCaseService.getAllTestCases()));
    }

    @GetMapping("/task/{taskId}")
    @Operation(summary = "Get Test Cases by Task", description = "Retrieves test cases associated with a specific task")
    public ResponseEntity<ApiResponse<List<TestCaseResponse>>> getTestCasesByTask(@PathVariable Integer taskId) {
        return ResponseEntity.ok(ApiResponse.ok("Task test cases retrieved", testCaseService.getTestCasesByTask(taskId)));
    }

    @GetMapping("/task/{taskId}/test/{testNumber}")
    @Operation(summary = "Get Test Case by Task and Number", description = "Retrieves a specific test case entry")
    public ResponseEntity<ApiResponse<TestCaseResponse>> getTestCase(@PathVariable Integer taskId, @PathVariable Integer testNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Test case retrieved", testCaseService.getTestCase(taskId, testNumber)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER')")
    @Operation(summary = "Create Test Case", description = "Creates a new test case linked to a task")
    public ResponseEntity<ApiResponse<TestCaseResponse>> createTestCase(@Valid @RequestBody TestCaseRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Test case created successfully", testCaseService.createTestCase(request)));
    }

    @PutMapping("/task/{taskId}/test/{testNumber}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER')")
    @Operation(summary = "Update Test Case", description = "Updates test case assertions and expected results")
    public ResponseEntity<ApiResponse<TestCaseResponse>> updateTestCase(@PathVariable Integer taskId,
                                                                        @PathVariable Integer testNumber,
                                                                        @Valid @RequestBody TestCaseRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Test case updated successfully", testCaseService.updateTestCase(taskId, testNumber, request)));
    }

    @DeleteMapping("/task/{taskId}/test/{testNumber}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER')")
    @Operation(summary = "Delete Test Case", description = "Deletes a test case specification")
    public ResponseEntity<ApiResponse<Void>> deleteTestCase(@PathVariable Integer taskId, @PathVariable Integer testNumber) {
        testCaseService.deleteTestCase(taskId, testNumber);
        return ResponseEntity.ok(ApiResponse.ok("Test case deleted successfully", null));
    }
}
