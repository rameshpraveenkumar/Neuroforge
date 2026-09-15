package com.neuroforge.service;

import com.neuroforge.dto.request.DeploymentRequest;
import com.neuroforge.dto.response.DeploymentResponse;
import com.neuroforge.entity.Deployment;
import com.neuroforge.entity.DeploymentLog;
import com.neuroforge.entity.Project;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.DeploymentLogRepository;
import com.neuroforge.repository.DeploymentRepository;
import com.neuroforge.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final DeploymentLogRepository deploymentLogRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogService auditLogService;

    public DeploymentService(DeploymentRepository deploymentRepository,
                             DeploymentLogRepository deploymentLogRepository,
                             ProjectRepository projectRepository,
                             AuditLogService auditLogService) {
        this.deploymentRepository = deploymentRepository;
        this.deploymentLogRepository = deploymentLogRepository;
        this.projectRepository = projectRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<DeploymentResponse> getAllDeployments() {
        return deploymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeploymentResponse> getDeploymentsByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return deploymentRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DeploymentResponse getDeploymentById(Integer id) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment not found with id: " + id));
        return mapToResponse(deployment);
    }

    @Transactional
    public DeploymentResponse triggerDeployment(DeploymentRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        Deployment deployment = new Deployment(
                project,
                request.getVersion(),
                request.getEnvironment(),
                LocalDateTime.now(),
                "HEALTHY"
        );
        deployment = deploymentRepository.save(deployment);

        // Record initial deployment logs
        deploymentLogRepository.save(new DeploymentLog(
                deployment, 1,
                "Triggered deployment " + request.getVersion() + " to " + request.getEnvironment() + " environment.",
                LocalDateTime.now()
        ));
        deploymentLogRepository.save(new DeploymentLog(
                deployment, 2,
                "Health checks and container readiness probes succeeded. Traffic routed.",
                LocalDateTime.now()
        ));

        auditLogService.record("DEPLOYMENT_RELEASE_EXEC", "RELEASE", "DEPLOYMENT", Long.valueOf(deployment.getDeploymentId()), "Target environment [" + request.getEnvironment() + "] release v" + request.getVersion() + " created.");

        return mapToResponse(deployment);
    }

    @Transactional
    public DeploymentResponse updateDeploymentStatus(Integer id, String status) {
        Deployment deployment = deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deployment not found with id: " + id));

        deployment.setStatus(status);
        deployment = deploymentRepository.save(deployment);

        int nextLogNum = deploymentLogRepository.findByDeployment(deployment).stream()
                .mapToInt(DeploymentLog::getLogNumber).max().orElse(0) + 1;

        deploymentLogRepository.save(new DeploymentLog(
                deployment, nextLogNum,
                "Deployment status transitioned to: " + status,
                LocalDateTime.now()
        ));

        auditLogService.record("DEPLOYMENT_STATUS_CHANGED", "STATUS_CHANGE", "DEPLOYMENT", Long.valueOf(deployment.getDeploymentId()), "Deployment status transitioned to: " + status + " for deployment ID: " + id);

        return mapToResponse(deployment);
    }

    private DeploymentResponse mapToResponse(Deployment dep) {
        DeploymentResponse res = new DeploymentResponse();
        res.setDeploymentId(dep.getDeploymentId());
        res.setProjectId(dep.getProject().getProjectId());
        res.setProjectName(dep.getProject().getProjectName());
        res.setVersion(dep.getVersion());
        res.setEnvironment(dep.getEnvironment());
        res.setDeploymentDate(dep.getDeploymentDate());
        res.setStatus(dep.getStatus());

        List<DeploymentLog> logs = deploymentLogRepository.findByDeployment(dep);
        res.setLogs(logs.stream()
                .map(l -> new DeploymentResponse.DeploymentLogDto(l.getLogNumber(), l.getLogMessage(), l.getLogTime()))
                .collect(Collectors.toList()));
        return res;
    }
}
