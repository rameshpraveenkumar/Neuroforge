package com.neuroforge.dto.response;

public class DemoPersonaResponse {

    private String role;
    private String roleDisplayName;
    private String description;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;

    public DemoPersonaResponse() {}

    public DemoPersonaResponse(String role, String username, String email, String fullName, String avatarUrl) {
        this.role = role;
        this.roleDisplayName = role != null ? role.replace("_", " ") : "";
        this.description = role;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
    }

    public String getRole() { return role; }
    public void setRole(String role) {
        this.role = role;
        this.roleDisplayName = role != null ? role.replace("_", " ") : "";
    }

    public String getRoleDisplayName() { return roleDisplayName; }
    public void setRoleDisplayName(String roleDisplayName) { this.roleDisplayName = roleDisplayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
