package com.neuroforge.controller;

import com.neuroforge.dto.request.UserUpdateRequest;
import com.neuroforge.dto.response.ApiResponse;
import com.neuroforge.dto.response.UserProfileResponse;
import com.neuroforge.service.UserAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "User Administration", description = "Endpoints for user management, role assignments, and enterprise team directory")
public class UserController {

    private final UserAdminService userAdminService;

    public UserController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    @Operation(summary = "List All Users", description = "Retrieves all user profiles and roles in the organization")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", userAdminService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get User by ID", description = "Retrieves profile details for a specific user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("User retrieved", userAdminService.getUserById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @Operation(summary = "Update User Profile & Role", description = "Admin endpoint to modify user roles and contact information")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUser(@PathVariable Integer id, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", userAdminService.updateUser(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    @Operation(summary = "Delete User", description = "Deletes a user account from the system")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        userAdminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}
