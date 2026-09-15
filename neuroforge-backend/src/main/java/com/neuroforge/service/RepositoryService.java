package com.neuroforge.service;

import com.neuroforge.dto.request.RepositoryRequest;
import com.neuroforge.dto.response.RepositoryResponse;
import com.neuroforge.dto.response.UserProfileResponse;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.Repository;
import com.neuroforge.entity.RepositoryCollaborator;
import com.neuroforge.entity.User;
import com.neuroforge.exception.BadRequestException;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.CodeCommitRepository;
import com.neuroforge.repository.ProjectRepository;
import com.neuroforge.repository.RepositoryCollaboratorRepository;
import com.neuroforge.repository.RepositoryEntityRepository;
import com.neuroforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepositoryService {

    private final RepositoryEntityRepository repositoryRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final RepositoryCollaboratorRepository collaboratorRepository;
    private final CodeCommitRepository commitRepository;
    private final AuditLogService auditLogService;

    public RepositoryService(RepositoryEntityRepository repositoryRepository,
                             ProjectRepository projectRepository,
                             UserRepository userRepository,
                             RepositoryCollaboratorRepository collaboratorRepository,
                             CodeCommitRepository commitRepository,
                             AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
        this.repositoryRepository = repositoryRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.commitRepository = commitRepository;
    }

    @Transactional(readOnly = true)
    public List<RepositoryResponse> getAllRepositories() {
        return repositoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RepositoryResponse getRepositoryById(Integer id) {
        Repository repo = repositoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with id: " + id));
        return mapToResponse(repo);
    }

    @Transactional(readOnly = true)
    public RepositoryResponse getRepositoryByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        Repository repo = repositoryRepository.findByProject(project)
                .orElseThrow(() -> new ResourceNotFoundException("No repository configured for project id: " + projectId));
        return mapToResponse(repo);
    }

    @Transactional
    public RepositoryResponse createRepository(RepositoryRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        Repository repo = new Repository(project, request.getRepositoryName(), request.getBranch());
        final Repository savedRepo = repositoryRepository.save(repo);

        if (request.getCollaboratorUserIds() != null) {
            for (Integer uId : request.getCollaboratorUserIds()) {
                userRepository.findById(uId).ifPresent(u -> collaboratorRepository.save(new RepositoryCollaborator(savedRepo, u)));
            }
        }

        auditLogService.record("REPOSITORY_CREATED", "CREATE", "REPOSITORY", Long.valueOf(savedRepo.getRepositoryId()), "Repository created: " + savedRepo.getRepositoryName());
        return mapToResponse(savedRepo);
    }

    @Transactional
    public void addCollaborator(Integer repositoryId, Integer userId) {
        Repository repo = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        collaboratorRepository.save(new RepositoryCollaborator(repo, user));
        auditLogService.record("COLLABORATOR_ADDED", "ADD_COLLABORATOR", "REPOSITORY", Long.valueOf(repositoryId), "Collaborator added (User ID: " + userId + ") to repo ID: " + repositoryId);
    }

    private RepositoryResponse mapToResponse(Repository repo) {
        RepositoryResponse res = new RepositoryResponse();
        res.setRepositoryId(repo.getRepositoryId());
        res.setProjectId(repo.getProject().getProjectId());
        res.setProjectName(repo.getProject().getProjectName());
        res.setRepositoryName(repo.getRepositoryName());
        res.setBranch(repo.getBranch());
        res.setTotalCommits(commitRepository.findByRepository(repo).size());

        List<RepositoryCollaborator> collabs = collaboratorRepository.findByRepository(repo);
        List<UserProfileResponse> collabList = collabs.stream()
                .map(c -> new UserProfileResponse(
                        c.getUser().getUserId(),
                        c.getUser().getName(),
                        c.getUser().getEmail(),
                        c.getUser().getName(),
                        c.getUser().getRole(),
                        c.getUser().getPhone(),
                        null
                ))
                .collect(Collectors.toList());
        res.setCollaborators(collabList);

        return res;
    }
}
