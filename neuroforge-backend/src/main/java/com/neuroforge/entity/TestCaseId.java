package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class TestCaseId implements Serializable {
    private Integer task;
    private Integer testNumber;

    public TestCaseId() {}

    public TestCaseId(Integer task, Integer testNumber) {
        this.task = task;
        this.testNumber = testNumber;
    }

    public Integer getTask() { return task; }
    public void setTask(Integer task) { this.task = task; }

    public Integer getTestNumber() { return testNumber; }
    public void setTestNumber(Integer testNumber) { this.testNumber = testNumber; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TestCaseId that = (TestCaseId) o;
        return Objects.equals(task, that.task) && Objects.equals(testNumber, that.testNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(task, testNumber);
    }
}
