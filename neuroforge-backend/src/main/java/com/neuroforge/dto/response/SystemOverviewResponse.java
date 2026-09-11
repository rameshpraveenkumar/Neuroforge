package com.neuroforge.dto.response;

import java.util.Map;

public class SystemOverviewResponse {

    private long totalUsers;
    private long totalProjects;
    private long totalRequirements;
    private long totalSprints;
    private long totalTasks;
    private long totalTestCases;
    private long totalBugs;
    private long openBugs;
    private long totalDeployments;
    private long healthyDeployments;
    private long totalDocumentation;
    private long totalAiSuggestions;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> bugsBySeverity;

    public SystemOverviewResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }

    public long getTotalRequirements() { return totalRequirements; }
    public void setTotalRequirements(long totalRequirements) { this.totalRequirements = totalRequirements; }

    public long getTotalSprints() { return totalSprints; }
    public void setTotalSprints(long totalSprints) { this.totalSprints = totalSprints; }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(long totalTestCases) { this.totalTestCases = totalTestCases; }

    public long getTotalBugs() { return totalBugs; }
    public void setTotalBugs(long totalBugs) { this.totalBugs = totalBugs; }

    public long getOpenBugs() { return openBugs; }
    public void setOpenBugs(long openBugs) { this.openBugs = openBugs; }

    public long getTotalDeployments() { return totalDeployments; }
    public void setTotalDeployments(long totalDeployments) { this.totalDeployments = totalDeployments; }

    public long getHealthyDeployments() { return healthyDeployments; }
    public void setHealthyDeployments(long healthyDeployments) { this.healthyDeployments = healthyDeployments; }

    public long getTotalDocumentation() { return totalDocumentation; }
    public void setTotalDocumentation(long totalDocumentation) { this.totalDocumentation = totalDocumentation; }

    public long getTotalAiSuggestions() { return totalAiSuggestions; }
    public void setTotalAiSuggestions(long totalAiSuggestions) { this.totalAiSuggestions = totalAiSuggestions; }

    public Map<String, Long> getTasksByStatus() { return tasksByStatus; }
    public void setTasksByStatus(Map<String, Long> tasksByStatus) { this.tasksByStatus = tasksByStatus; }

    public Map<String, Long> getBugsBySeverity() { return bugsBySeverity; }
    public void setBugsBySeverity(Map<String, Long> bugsBySeverity) { this.bugsBySeverity = bugsBySeverity; }
}
