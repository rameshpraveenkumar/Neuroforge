package com.neuroforge.dto.response;

import java.util.List;

public class UserProfileResponse {

    private Integer id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String roleDisplayName;
    private String phone;
    private List<String> phoneNumbers;

    public UserProfileResponse() {}

    public UserProfileResponse(Integer id, String username, String email, String fullName, String role,
                               String phone, List<String> phoneNumbers) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.roleDisplayName = role != null ? role.replace("_", " ") : "";
        this.phone = phone;
        this.phoneNumbers = phoneNumbers;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<String> getPhoneNumbers() { return phoneNumbers; }
    public void setPhoneNumbers(List<String> phoneNumbers) { this.phoneNumbers = phoneNumbers; }
}
