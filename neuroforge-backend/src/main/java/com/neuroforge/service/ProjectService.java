package com.neuroforge.service;

import com.neuroforge.dto.request.ProjectRequest;
import com.neuroforge.dto.response.ProjectResponse;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.ProjectTechnology;
import com.neuroforge.entity.Repository;
import com.neuroforge.entity.User;
import com.neuroforge.exception.BadRequestException;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTechnologyRepository projectTechnologyRepository;
    private final RepositoryEntityRepository repositoryRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final RequirementRepository requirementRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectTechnologyRepository projectTechnologyRepository,
                          RepositoryEntityRepository repositoryRepository,
                          UserRepository userRepository,
                          RequirementRepository requirementRepository,
                          SprintRepository sprintRepository,
                          TaskRepository taskRepository,
                             AuditLogService auditLogService) {
        this.projectRepository = projectRepository;
        this.projectTechnologyRepository = projectTechnologyRepository;
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.requirementRepository = requirementRepository;
        this.sprintRepository = sprintRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        if (projectRepository.existsByProjectName(request.getProjectName())) {
            throw new BadRequestException("Project name already exists: " + request.getProjectName());
        }

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
        }

        Project project = new Project(
                request.getProjectName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus() != null ? request.getStatus() : "ACTIVE",
                manager
        );
        project = projectRepository.save(project);

        if (request.getTechnologies() != null && !request.getTechnologies().isEmpty()) {
            for (String tech : request.getTechnologies()) {
                projectTechnologyRepository.save(new ProjectTechnology(project, tech.trim()));
            }
        }

        if (request.getRepositoryName() != null && !request.getRepositoryName().isBlank()) {
            Repository repo = new Repository(project, request.getRepositoryName(), "main");
            repositoryRepository.save(repo);
        }

        auditLogService.record("PROJECT_CREATED", "CREATE", "PROJECT", Long.valueOf(project.getProjectId()), "Project created: " + project.getProjectName());
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Integer id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
            project.setManager(manager);
        }

        if (request.getTechnologies() != null) {
            List<ProjectTechnology> existing = projectTechnologyRepository.findByProject(project);
            projectTechnologyRepository.deleteAll(existing);
            for (String tech : request.getTechnologies()) {
                projectTechnologyRepository.save(new ProjectTechnology(project, tech.trim()));
            }
        }

        project = projectRepository.save(project);
        auditLogService.record("PROJECT_UPDATED", "UPDATE", "PROJECT", Long.valueOf(project.getProjectId()), "Project updated: " + project.getProjectName());
        return mapToResponse(project);
    }

    @Transactional
    public void deleteProject(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
        auditLogService.record("PROJECT_DELETED", "DELETE", "PROJECT", Long.valueOf(id), "Project deleted with ID: " + id);
    }

    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse res = new ProjectResponse();
        res.setProjectId(project.getProjectId());
        res.setProjectName(project.getProjectName());
        res.setDescription(project.getDescription());
        res.setStartDate(project.getStartDate());
        res.setEndDate(project.getEndDate());
        res.setStatus(project.getStatus());

        if (project.getManager() != null) {
            res.setManagerId(project.getManager().getUserId());
            res.setManagerName(project.getManager().getName());
        }

        List<ProjectTechnology> techs = projectTechnologyRepository.findByProject(project);
        res.setTechnologies(techs.stream().map(ProjectTechnology::getTechnology).collect(Collectors.toList()));

        repositoryRepository.findByProject(project).ifPresent(r -> res.setRepositoryName(r.getRepositoryName()));

        res.setRequirementsCount(requirementRepository.findByProject(project).size());
        res.setSprintsCount(sprintRepository.findByProject(project).size());

        long tasksCount = sprintRepository.findByProject(project).stream()
                .mapToLong(s -> taskRepository.findBySprint(s).size())
                .sum();
        res.setTasksCount(tasksCount);

        return res;
    }
}
