package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "task_labels")
@IdClass(TaskLabelId.class)
public class TaskLabel {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Id
    @Column(name = "label", nullable = false, length = 255)
    private String label;

    public TaskLabel() {}

    public TaskLabel(Task task, String label) {
        this.task = task;
        this.label = label;
    }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}
