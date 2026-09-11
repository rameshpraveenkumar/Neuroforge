package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "bugs")
@IdClass(BugId.class)
public class Bug {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "task_id", referencedColumnName = "task_id", nullable = false),
            @JoinColumn(name = "test_number", referencedColumnName = "test_number", nullable = false)
    })
    private TestCase testCase;

    @Id
    @Column(name = "bug_number", nullable = false)
    private Integer bugNumber;

    @Column(name = "bug_title", nullable = false, length = 255)
    private String bugTitle;

    @Column(name = "severity", length = 255)
    private String severity = "MAJOR";

    @Column(name = "status", length = 255)
    private String status = "NEW";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_developer_id")
    private User assignedDeveloper;

    public Bug() {}

    public Bug(TestCase testCase, Integer bugNumber, String bugTitle, String severity, String status, User assignedDeveloper) {
        this.testCase = testCase;
        this.bugNumber = bugNumber;
        this.bugTitle = bugTitle;
        this.severity = severity;
        this.status = status;
        this.assignedDeveloper = assignedDeveloper;
    }

    public TestCase getTestCase() { return testCase; }
    public void setTestCase(TestCase testCase) { this.testCase = testCase; }

    public Integer getBugNumber() { return bugNumber; }
    public void setBugNumber(Integer bugNumber) { this.bugNumber = bugNumber; }

    public String getBugTitle() { return bugTitle; }
    public void setBugTitle(String bugTitle) { this.bugTitle = bugTitle; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getAssignedDeveloper() { return assignedDeveloper; }
    public void setAssignedDeveloper(User assignedDeveloper) { this.assignedDeveloper = assignedDeveloper; }
}
