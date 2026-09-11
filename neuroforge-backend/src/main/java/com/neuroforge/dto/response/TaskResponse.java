package com.neuroforge.dto.response;

import java.time.LocalDate;
import java.util.List;

public class TaskResponse {

    private Integer taskId;
    private Integer sprintId;
    private String sprintName;
    private Integer assignedUserId;
    private String assignedUserName;
    private String assignedUserEmail;
    private String title;
    private String description;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private List<String> labels;
    private long testCasesCount;

    public TaskResponse() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getSprintId() { return sprintId; }
    public void setSprintId(Integer sprintId) { this.sprintId = sprintId; }

    public String getSprintName() { return sprintName; }
    public void setSprintName(String sprintName) { this.sprintName = sprintName; }

    public Integer getAssignedUserId() { return assignedUserId; }
    public void setAssignedUserId(Integer assignedUserId) { this.assignedUserId = assignedUserId; }

    public String getAssignedUserName() { return assignedUserName; }
    public void setAssignedUserName(String assignedUserName) { this.assignedUserName = assignedUserName; }

    public String getAssignedUserEmail() { return assignedUserEmail; }
    public void setAssignedUserEmail(String assignedUserEmail) { this.assignedUserEmail = assignedUserEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> labels) { this.labels = labels; }

    public long getTestCasesCount() { return testCasesCount; }
    public void setTestCasesCount(long testCasesCount) { this.testCasesCount = testCasesCount; }
}
