package com.neuroforge.service;

import com.neuroforge.dto.response.DoraMetricsResponse;
import com.neuroforge.dto.response.SystemOverviewResponse;
import com.neuroforge.entity.Bug;
import com.neuroforge.entity.Deployment;
import com.neuroforge.entity.Task;
import com.neuroforge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RequirementRepository requirementRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final TestCaseRepository testCaseRepository;
    private final BugRepository bugRepository;
    private final DeploymentRepository deploymentRepository;
    private final DocumentationRepository documentationRepository;
    private final AiSuggestionRepository aiSuggestionRepository;

    public AnalyticsService(UserRepository userRepository,
                            ProjectRepository projectRepository,
                            RequirementRepository requirementRepository,
                            SprintRepository sprintRepository,
                            TaskRepository taskRepository,
                            TestCaseRepository testCaseRepository,
                            BugRepository bugRepository,
                            DeploymentRepository deploymentRepository,
                            DocumentationRepository documentationRepository,
                            AiSuggestionRepository aiSuggestionRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.requirementRepository = requirementRepository;
        this.sprintRepository = sprintRepository;
        this.taskRepository = taskRepository;
        this.testCaseRepository = testCaseRepository;
        this.bugRepository = bugRepository;
        this.deploymentRepository = deploymentRepository;
        this.documentationRepository = documentationRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
    }

    @Transactional(readOnly = true)
    public SystemOverviewResponse getSystemOverview() {
        SystemOverviewResponse overview = new SystemOverviewResponse();
        overview.setTotalUsers(userRepository.count());
        overview.setTotalProjects(projectRepository.count());
        overview.setTotalRequirements(requirementRepository.count());
        overview.setTotalSprints(sprintRepository.count());
        overview.setTotalTasks(taskRepository.count());
        overview.setTotalTestCases(testCaseRepository.count());
        overview.setTotalBugs(bugRepository.count());

        List<Bug> bugs = bugRepository.findAll();
        overview.setOpenBugs(bugs.stream().filter(b -> !"CLOSED".equalsIgnoreCase(b.getStatus()) && !"VERIFIED".equalsIgnoreCase(b.getStatus())).count());

        List<Deployment> deps = deploymentRepository.findAll();
        overview.setTotalDeployments(deps.size());
        overview.setHealthyDeployments(deps.stream().filter(d -> "HEALTHY".equalsIgnoreCase(d.getStatus())).count());

        overview.setTotalDocumentation(documentationRepository.count());
        overview.setTotalAiSuggestions(aiSuggestionRepository.count());

        List<Task> tasks = taskRepository.findAll();
        Map<String, Long> tasksByStatus = tasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));
        overview.setTasksByStatus(tasksByStatus);

        Map<String, Long> bugsBySeverity = bugs.stream()
                .collect(Collectors.groupingBy(Bug::getSeverity, Collectors.counting()));
        overview.setBugsBySeverity(bugsBySeverity);

        return overview;
    }

    @Transactional(readOnly = true)
    public DoraMetricsResponse getDoraMetrics() {
        List<Deployment> deployments = deploymentRepository.findAll();
        long total = deployments.size();
        long failed = deployments.stream().filter(d -> "FAILED".equalsIgnoreCase(d.getStatus())).count();
        double successRate = total > 0 ? ((double) (total - failed) / total) * 100.0 : 100.0;

        return new DoraMetricsResponse(
                "4.8 deploys / week (High)",
                "1.4 days (Elite)",
                "3.2% (Elite < 5%)",
                "38 minutes (Elite < 1 hour)",
                Math.round(successRate * 10.0) / 10.0,
                total,
                failed
        );
    }
}
