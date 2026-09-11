package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "requirement_tags")
@IdClass(RequirementTagId.class)
public class RequirementTag {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @Id
    @Column(name = "tag", nullable = false, length = 255)
    private String tag;

    public RequirementTag() {}

    public RequirementTag(Requirement requirement, String tag) {
        this.requirement = requirement;
        this.tag = tag;
    }

    public Requirement getRequirement() { return requirement; }
    public void setRequirement(Requirement requirement) { this.requirement = requirement; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
}
