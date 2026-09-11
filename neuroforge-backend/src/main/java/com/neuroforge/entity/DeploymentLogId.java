package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class DeploymentLogId implements Serializable {
    private Integer deployment;
    private Integer logNumber;

    public DeploymentLogId() {}

    public DeploymentLogId(Integer deployment, Integer logNumber) {
        this.deployment = deployment;
        this.logNumber = logNumber;
    }

    public Integer getDeployment() { return deployment; }
    public void setDeployment(Integer deployment) { this.deployment = deployment; }

    public Integer getLogNumber() { return logNumber; }
    public void setLogNumber(Integer logNumber) { this.logNumber = logNumber; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeploymentLogId that = (DeploymentLogId) o;
        return Objects.equals(deployment, that.deployment) && Objects.equals(logNumber, that.logNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deployment, logNumber);
    }
}
