package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class SprintGoalId implements Serializable {
    private Integer sprint;
    private String goal;

    public SprintGoalId() {}

    public SprintGoalId(Integer sprint, String goal) {
        this.sprint = sprint;
        this.goal = goal;
    }

    public Integer getSprint() { return sprint; }
    public void setSprint(Integer sprint) { this.sprint = sprint; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SprintGoalId that = (SprintGoalId) o;
        return Objects.equals(sprint, that.sprint) && Objects.equals(goal, that.goal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sprint, goal);
    }
}
