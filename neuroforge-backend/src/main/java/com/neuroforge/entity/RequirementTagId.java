package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class RequirementTagId implements Serializable {
    private Integer requirement;
    private String tag;

    public RequirementTagId() {}

    public RequirementTagId(Integer requirement, String tag) {
        this.requirement = requirement;
        this.tag = tag;
    }

    public Integer getRequirement() { return requirement; }
    public void setRequirement(Integer requirement) { this.requirement = requirement; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RequirementTagId that = (RequirementTagId) o;
        return Objects.equals(requirement, that.requirement) && Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requirement, tag);
    }
}
