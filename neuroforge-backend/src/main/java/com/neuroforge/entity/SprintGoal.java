package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "sprint_goals")
@IdClass(SprintGoalId.class)
public class SprintGoal {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @Id
    @Column(name = "goal", nullable = false, length = 255)
    private String goal;

    public SprintGoal() {}

    public SprintGoal(Sprint sprint, String goal) {
        this.sprint = sprint;
        this.goal = goal;
    }

    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
}
