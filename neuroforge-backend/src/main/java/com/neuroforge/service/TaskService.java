package com.neuroforge.service;

import com.neuroforge.dto.request.TaskRequest;
import com.neuroforge.dto.request.TaskStatusUpdateRequest;
import com.neuroforge.dto.response.TaskResponse;
import com.neuroforge.entity.Sprint;
import com.neuroforge.entity.Task;
import com.neuroforge.entity.TaskLabel;
import com.neuroforge.entity.User;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskLabelRepository taskLabelRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final TestCaseRepository testCaseRepository;

    public TaskService(TaskRepository taskRepository,
                       TaskLabelRepository taskLabelRepository,
                       SprintRepository sprintRepository,
                       UserRepository userRepository,
                       TestCaseRepository testCaseRepository,
                             AuditLogService auditLogService) {
        this.taskRepository = taskRepository;
        this.taskLabelRepository = taskLabelRepository;
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.testCaseRepository = testCaseRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksBySprint(Integer sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + sprintId));
        return taskRepository.findBySprint(sprint).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByAssignee(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return taskRepository.findByAssignedUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Sprint sprint = sprintRepository.findById(request.getSprintId())
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.getSprintId()));

        User assignee = null;
        if (request.getAssignedUserId() != null) {
            assignee = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
        }

        Task task = new Task(
                sprint,
                assignee,
                request.getTitle(),
                request.getDescription(),
                request.getPriority() != null ? request.getPriority() : "MEDIUM",
                request.getStatus() != null ? request.getStatus() : "TODO",
                request.getDueDate()
        );
        task = taskRepository.save(task);

        if (request.getLabels() != null) {
            for (String label : request.getLabels()) {
                taskLabelRepository.save(new TaskLabel(task, label.trim()));
            }
        }

        auditLogService.record("TASK_CREATED", "CREATE", "TASK", Long.valueOf(task.getTaskId()), "Task created: " + task.getTitle());
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Integer id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (request.getSprintId() != null && !request.getSprintId().equals(task.getSprint().getSprintId())) {
            Sprint sprint = sprintRepository.findById(request.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.getSprintId()));
            task.setSprint(sprint);
        }

        if (request.getAssignedUserId() != null) {
            User assignee = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(assignee);
        } else {
            task.setAssignedUser(null);
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        if (request.getLabels() != null) {
            List<TaskLabel> existing = taskLabelRepository.findByTask(task);
            taskLabelRepository.deleteAll(existing);
            for (String label : request.getLabels()) {
                taskLabelRepository.save(new TaskLabel(task, label.trim()));
            }
        }

        task = taskRepository.save(task);
        auditLogService.record("TASK_UPDATED", "UPDATE", "TASK", Long.valueOf(task.getTaskId()), "Task updated: " + task.getTitle());
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Integer id, TaskStatusUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(request.getStatus());
        task = taskRepository.save(task);
        auditLogService.record("TASK_STATUS_TRANSITION", "STATUS_CHANGE", "TASK", Long.valueOf(task.getTaskId()), "Task status updated to " + request.getStatus() + ": " + task.getTitle());
        return mapToResponse(task);
    }

    @Transactional
    public void deleteTask(Integer id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
        auditLogService.record("TASK_DELETED", "DELETE", "TASK", Long.valueOf(id), "Task deleted with ID: " + id);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse res = new TaskResponse();
        res.setTaskId(task.getTaskId());
        res.setSprintId(task.getSprint().getSprintId());
        res.setSprintName(task.getSprint().getSprintName());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setPriority(task.getPriority());
        res.setStatus(task.getStatus());
        res.setDueDate(task.getDueDate());

        if (task.getAssignedUser() != null) {
            res.setAssignedUserId(task.getAssignedUser().getUserId());
            res.setAssignedUserName(task.getAssignedUser().getName());
            res.setAssignedUserEmail(task.getAssignedUser().getEmail());
        }

        List<TaskLabel> labels = taskLabelRepository.findByTask(task);
        res.setLabels(labels.stream().map(TaskLabel::getLabel).collect(Collectors.toList()));
        res.setTestCasesCount(testCaseRepository.findByTask(task).size());

        return res;
    }
}
