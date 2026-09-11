package com.neuroforge.dto.response;

public class JwtAuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresInMs;
    private Integer userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String roleDisplayName;
    private String avatarUrl;

    public JwtAuthResponse() {}

    public JwtAuthResponse(String accessToken, Long expiresInMs, Integer userId, String username,
                           String email, String fullName, String role, String avatarUrl) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.expiresInMs = expiresInMs;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.roleDisplayName = role != null ? role.replace("_", " ") : "";
        this.avatarUrl = avatarUrl;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(Long expiresInMs) { this.expiresInMs = expiresInMs; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) {
        this.role = role;
        this.roleDisplayName = role != null ? role.replace("_", " ") : "";
    }

    public String getRoleDisplayName() { return roleDisplayName; }
    public void setRoleDisplayName(String roleDisplayName) { this.roleDisplayName = roleDisplayName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
