export const mockAnalyticsOverview = {
  activeProjects: 4,
  activeSprints: 3,
  openTasks: 24,
  openBugs: 5,
  pipelineSuccessRate: 94.2,
  codeCoveragePercent: 87.5,
  avgDeploymentDuration: '3m 12s',
  totalDeploymentsThisMonth: 38,
  taskStatusDistribution: [
    { name: 'To Do', count: 8 },
    { name: 'In Progress', count: 7 },
    { name: 'In Review', count: 4 },
    { name: 'Completed', count: 28 },
  ],
  bugSeverityDistribution: [
    { name: 'Critical', count: 1 },
    { name: 'High', count: 2 },
    { name: 'Medium', count: 3 },
    { name: 'Low', count: 4 },
  ],
};

export const mockDoraMetrics = {
  deploymentFrequency: '2.4 / day',
  leadTimeForChanges: '4.2 hours',
  changeFailureRate: '3.1%',
  timeToRestoreService: '28 minutes',
  rating: 'ELITE',
};
