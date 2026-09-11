package com.neuroforge.dto.response;

public class TestCaseResponse {

    private Integer taskId;
    private Integer testNumber;
    private String taskTitle;
    private String testName;
    private String description;
    private String expectedResult;
    private long bugsCount;

    public TestCaseResponse() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getExpectedResult() { return expectedResult; }
    public void setExpectedResult(String expectedResult) { this.expectedResult = expectedResult; }

    public long getBugsCount() { return bugsCount; }
    public void setBugsCount(long bugsCount) { this.bugsCount = bugsCount; }
}
