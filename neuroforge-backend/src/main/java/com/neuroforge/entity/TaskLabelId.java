package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class TaskLabelId implements Serializable {
    private Integer task;
    private String label;

    public TaskLabelId() {}

    public TaskLabelId(Integer task, String label) {
        this.task = task;
        this.label = label;
    }

    public Integer getTask() { return task; }
    public void setTask(Integer task) { this.task = task; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskLabelId that = (TaskLabelId) o;
        return Objects.equals(task, that.task) && Objects.equals(label, that.label);
    }

    @Override
    public int hashCode() {
        return Objects.hash(task, label);
    }
}
