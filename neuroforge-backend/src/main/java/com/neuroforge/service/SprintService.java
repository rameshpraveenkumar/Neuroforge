package com.neuroforge.service;

import com.neuroforge.dto.request.SprintRequest;
import com.neuroforge.dto.response.SprintResponse;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.Sprint;
import com.neuroforge.entity.SprintGoal;
import com.neuroforge.entity.Task;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.ProjectRepository;
import com.neuroforge.repository.SprintGoalRepository;
import com.neuroforge.repository.SprintRepository;
import com.neuroforge.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;
    private final SprintGoalRepository sprintGoalRepository;
    private final AuditLogService auditLogService;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public SprintService(SprintRepository sprintRepository,
                         SprintGoalRepository sprintGoalRepository,
                         ProjectRepository projectRepository,
                         TaskRepository taskRepository,
                             AuditLogService auditLogService) {
        this.sprintRepository = sprintRepository;
        this.sprintGoalRepository = sprintGoalRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<SprintResponse> getAllSprints() {
        return sprintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SprintResponse> getSprintsByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return sprintRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SprintResponse getSprintById(Integer id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));
        return mapToResponse(sprint);
    }

    @Transactional
    public SprintResponse createSprint(SprintRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        Sprint sprint = new Sprint(
                project,
                request.getSprintName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus() != null ? request.getStatus() : "PLANNED"
        );
        sprint = sprintRepository.save(sprint);

        if (request.getGoals() != null) {
            for (String goal : request.getGoals()) {
                sprintGoalRepository.save(new SprintGoal(sprint, goal.trim()));
            }
        }

        auditLogService.record("SPRINT_CREATED", "CREATE", "SPRINT", Long.valueOf(sprint.getSprintId()), "Sprint created: " + sprint.getSprintName());
        return mapToResponse(sprint);
    }

    @Transactional
    public SprintResponse updateSprint(Integer id, SprintRequest request) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));

        sprint.setSprintName(request.getSprintName());
        sprint.setStartDate(request.getStartDate());
        sprint.setEndDate(request.getEndDate());
        if (request.getStatus() != null) sprint.setStatus(request.getStatus());

        if (request.getGoals() != null) {
            List<SprintGoal> existing = sprintGoalRepository.findBySprint(sprint);
            sprintGoalRepository.deleteAll(existing);
            for (String goal : request.getGoals()) {
                sprintGoalRepository.save(new SprintGoal(sprint, goal.trim()));
            }
        }

        sprint = sprintRepository.save(sprint);
        auditLogService.record("SPRINT_UPDATED", "UPDATE", "SPRINT", Long.valueOf(sprint.getSprintId()), "Sprint updated: " + sprint.getSprintName());
        return mapToResponse(sprint);
    }

    @Transactional
    public void deleteSprint(Integer id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));
        sprintRepository.delete(sprint);
        auditLogService.record("SPRINT_DELETED", "DELETE", "SPRINT", Long.valueOf(id), "Sprint deleted with ID: " + id);
    }

    private SprintResponse mapToResponse(Sprint sprint) {
        SprintResponse res = new SprintResponse();
        res.setSprintId(sprint.getSprintId());
        res.setProjectId(sprint.getProject().getProjectId());
        res.setProjectName(sprint.getProject().getProjectName());
        res.setSprintName(sprint.getSprintName());
        res.setStartDate(sprint.getStartDate());
        res.setEndDate(sprint.getEndDate());
        res.setStatus(sprint.getStatus());

        List<SprintGoal> goals = sprintGoalRepository.findBySprint(sprint);
        res.setGoals(goals.stream().map(SprintGoal::getGoal).collect(Collectors.toList()));

        List<Task> tasks = taskRepository.findBySprint(sprint);
        res.setTotalTasks(tasks.size());
        res.setCompletedTasks(tasks.stream().filter(t -> "DONE".equalsIgnoreCase(t.getStatus())).count());

        return res;
    }
}
