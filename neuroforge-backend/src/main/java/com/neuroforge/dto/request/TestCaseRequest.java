package com.neuroforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TestCaseRequest {

    @NotNull(message = "Task ID is required")
    private Integer taskId;

    private Integer testNumber;

    @NotBlank(message = "Test name is required")
    private String testName;

    private String description;
    private String expectedResult;

    public TestCaseRequest() {}

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getExpectedResult() { return expectedResult; }
    public void setExpectedResult(String expectedResult) { this.expectedResult = expectedResult; }
}
