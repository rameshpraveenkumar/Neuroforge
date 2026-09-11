package com.neuroforge.enums;

public enum Role {
    SYSTEM_ADMIN("System Admin", "System administration, user access, and compliance auditing"),
    PROJECT_MANAGER("Project Manager", "Sprint planning, resource management, and team velocity"),
    PRODUCT_OWNER("Product Owner", "Product vision, backlog prioritization, and release sign-off"),
    BUSINESS_ANALYST("Business Analyst", "Requirements engineering, user stories, and acceptance criteria"),
    SOFTWARE_ARCHITECT("Software Architect", "System architecture, ADRs, and technical standards"),
    DEVELOPER("Developer", "Feature implementation, code delivery, and task tracking"),
    QA_ENGINEER("QA/Test Engineer", "Test authoring, test execution runs, and defect management"),
    DEVOPS_ENGINEER("DevOps Engineer", "CI/CD pipelines, build automation, and environment deployments"),
    CLIENT("Client", "Milestone visibility, progress review, and UAT sign-off");

    private final String displayName;
    private final String description;

    Role(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
