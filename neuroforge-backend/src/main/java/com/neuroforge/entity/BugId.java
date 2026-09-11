package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class BugId implements Serializable {
    private TestCaseId testCase;
    private Integer bugNumber;

    public BugId() {}

    public BugId(TestCaseId testCase, Integer bugNumber) {
        this.testCase = testCase;
        this.bugNumber = bugNumber;
    }

    public TestCaseId getTestCase() { return testCase; }
    public void setTestCase(TestCaseId testCase) { this.testCase = testCase; }

    public Integer getBugNumber() { return bugNumber; }
    public void setBugNumber(Integer bugNumber) { this.bugNumber = bugNumber; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BugId bugId = (BugId) o;
        return Objects.equals(testCase, bugId.testCase) && Objects.equals(bugNumber, bugId.bugNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(testCase, bugNumber);
    }
}
