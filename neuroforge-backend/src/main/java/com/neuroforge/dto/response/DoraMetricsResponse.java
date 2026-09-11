package com.neuroforge.dto.response;

public class DoraMetricsResponse {

    private String deploymentFrequency; // e.g. "4.2 deploys / week (High)"
    private String leadTimeForChanges; // e.g. "1.8 days (Elite)"
    private String changeFailureRate; // e.g. "4.5% (Elite < 5%)"
    private String timeToRestoreService; // e.g. "45 minutes (Elite < 1 hour)"
    private double successRatePercent;
    private long totalDeployments;
    private long failedDeployments;

    public DoraMetricsResponse() {}

    public DoraMetricsResponse(String deploymentFrequency, String leadTimeForChanges, String changeFailureRate,
                               String timeToRestoreService, double successRatePercent, long totalDeployments, long failedDeployments) {
        this.deploymentFrequency = deploymentFrequency;
        this.leadTimeForChanges = leadTimeForChanges;
        this.changeFailureRate = changeFailureRate;
        this.timeToRestoreService = timeToRestoreService;
        this.successRatePercent = successRatePercent;
        this.totalDeployments = totalDeployments;
        this.failedDeployments = failedDeployments;
    }

    public String getDeploymentFrequency() { return deploymentFrequency; }
    public void setDeploymentFrequency(String deploymentFrequency) { this.deploymentFrequency = deploymentFrequency; }

    public String getLeadTimeForChanges() { return leadTimeForChanges; }
    public void setLeadTimeForChanges(String leadTimeForChanges) { this.leadTimeForChanges = leadTimeForChanges; }

    public String getChangeFailureRate() { return changeFailureRate; }
    public void setChangeFailureRate(String changeFailureRate) { this.changeFailureRate = changeFailureRate; }

    public String getTimeToRestoreService() { return timeToRestoreService; }
    public void setTimeToRestoreService(String timeToRestoreService) { this.timeToRestoreService = timeToRestoreService; }

    public double getSuccessRatePercent() { return successRatePercent; }
    public void setSuccessRatePercent(double successRatePercent) { this.successRatePercent = successRatePercent; }

    public long getTotalDeployments() { return totalDeployments; }
    public void setTotalDeployments(long totalDeployments) { this.totalDeployments = totalDeployments; }

    public long getFailedDeployments() { return failedDeployments; }
    public void setFailedDeployments(long failedDeployments) { this.failedDeployments = failedDeployments; }
}
