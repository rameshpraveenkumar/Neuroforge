package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "test_cases")
@IdClass(TestCaseId.class)
public class TestCase {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Id
    @Column(name = "test_number", nullable = false)
    private Integer testNumber;

    @Column(name = "test_name", nullable = false, length = 255)
    private String testName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;

    @OneToMany(mappedBy = "testCase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bug> bugs = new ArrayList<>();

    public TestCase() {}

    public TestCase(Task task, Integer testNumber, String testName, String description, String expectedResult) {
        this.task = task;
        this.testNumber = testNumber;
        this.testName = testName;
        this.description = description;
        this.expectedResult = expectedResult;
    }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getExpectedResult() { return expectedResult; }
    public void setExpectedResult(String expectedResult) { this.expectedResult = expectedResult; }

    public List<Bug> getBugs() { return bugs; }
    public void setBugs(List<Bug> bugs) { this.bugs = bugs; }
}
