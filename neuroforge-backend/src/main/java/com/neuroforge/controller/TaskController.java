package com.neuroforge.controller;

import com.neuroforge.dto.request.TaskRequest;
import com.neuroforge.dto.request.TaskStatusUpdateRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.TaskResponse;
import com.neuroforge.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Tasks & Kanban Board", description = "Endpoints for Kanban drag-and-drop status transitions, task assignments, and time management")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @Operation(summary = "List All Tasks", description = "Retrieves all tasks across sprints")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        return ResponseEntity.ok(ApiResponse.ok("Tasks retrieved", taskService.getAllTasks()));
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Get Tasks by Sprint", description = "Retrieves tasks in a sprint for the Kanban board view")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksBySprint(@PathVariable Integer sprintId) {
        return ResponseEntity.ok(ApiResponse.ok("Sprint tasks retrieved", taskService.getTasksBySprint(sprintId)));
    }

    @GetMapping("/assignee/{userId}")
    @Operation(summary = "Get Tasks by Assignee", description = "Retrieves tasks assigned to a specific engineer")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByAssignee(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.ok("Assigned tasks retrieved", taskService.getTasksByAssignee(userId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Task by ID", description = "Retrieves task details and linked test cases")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Task retrieved", taskService.getTaskById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'DEVELOPER', 'DEVOPS_ENGINEER', 'SOFTWARE_ARCHITECT')")
    @Operation(summary = "Create Task", description = "Creates a new task item in a sprint")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", taskService.createTask(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'SOFTWARE_ARCHITECT')")
    @Operation(summary = "Update Task", description = "Updates task metadata, description, priority, or assignee")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Integer id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", taskService.updateTask(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'SOFTWARE_ARCHITECT')")
    @Operation(summary = "Update Task Status (Kanban Transition)", description = "Fast status transition endpoint for drag-and-drop Kanban operations")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(@PathVariable Integer id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", taskService.updateTaskStatus(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Delete Task", description = "Removes a task from the sprint")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }
}
