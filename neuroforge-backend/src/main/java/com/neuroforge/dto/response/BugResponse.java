package com.neuroforge.dto.response;

public class BugResponse {

    private Integer taskId;
    private Integer testNumber;
    private Integer bugNumber;
    private String taskTitle;
    private String testName;
    private String bugTitle;
    private String severity;
    private String status;
    private Integer assignedDeveloperId;
    private String assignedDeveloperName;

    public BugResponse() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    public Integer getBugNumber() { return bugNumber; }
    public void setBugNumber(Integer bugNumber) { this.bugNumber = bugNumber; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getBugTitle() { return bugTitle; }
    public void setBugTitle(String bugTitle) { this.bugTitle = bugTitle; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAssignedDeveloperId() { return assignedDeveloperId; }
    public void setAssignedDeveloperId(Integer assignedDeveloperId) { this.assignedDeveloperId = assignedDeveloperId; }

    public String getAssignedDeveloperName() { return assignedDeveloperName; }
    public void setAssignedDeveloperName(String assignedDeveloperName) { this.assignedDeveloperName = assignedDeveloperName; }
}
