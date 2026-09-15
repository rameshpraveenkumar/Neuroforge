package com.neuroforge.service;

import com.neuroforge.dto.response.PipelineRunResponse;
import com.neuroforge.entity.CiPipeline;
import com.neuroforge.entity.CiPipelineStage;
import com.neuroforge.entity.Repository;
import com.neuroforge.entity.User;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.CiPipelineRepository;
import com.neuroforge.repository.RepositoryEntityRepository;
import com.neuroforge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CiCdSimulatorService {

    private static final Logger logger = LoggerFactory.getLogger(CiCdSimulatorService.class);

    private final RepositoryEntityRepository repositoryRepository;
    private final CiPipelineRepository ciPipelineRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public CiCdSimulatorService(RepositoryEntityRepository repositoryRepository,
                                CiPipelineRepository ciPipelineRepository,
                                UserRepository userRepository,
                                AuditLogService auditLogService) {
        this.repositoryRepository = repositoryRepository;
        this.ciPipelineRepository = ciPipelineRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public PipelineRunResponse triggerPipeline(Integer repositoryId, String branch) {
        Repository repo = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with id: " + repositoryId));

        String pipelineId = "PIPE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String commitHash = UUID.randomUUID().toString().substring(0, 7);
        String targetBranch = (branch != null && !branch.isBlank()) ? branch : repo.getBranch();

        // Get currently authenticated user if present
        User triggeredByUser = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                String username = auth.getName();
                triggeredByUser = userRepository.findByName(username)
                        .or(() -> userRepository.findByEmail(username))
                        .orElse(null);
            }
        } catch (Exception ignored) {}

        LocalDateTime startedAt = LocalDateTime.now();

        List<PipelineRunResponse.PipelineStageDto> stageDtos = new ArrayList<>();

        // Stage 1: Lint & Code Analysis
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "LINT_CHECK", "SUCCESS", 1240L,
                Arrays.asList(
                        "[INFO] Initializing Checkstyle & ESLint engine...",
                        "[INFO] Running static analysis across 95 source files...",
                        "[SUCCESS] 0 errors, 0 warnings found. Code style compliant."
                )
        ));

        // Stage 2: Compile & Build
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "COMPILE_BUILD", "SUCCESS", 3150L,
                Arrays.asList(
                        "[INFO] Executing: javac [release 21] with target Spring Boot 3.3.3",
                        "[INFO] Bytecode generated in target/classes",
                        "[SUCCESS] Main artifact compiled successfully: neuroforge-core.jar"
                )
        ));

        // Stage 3: Automated Unit & Integration Tests
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "UNIT_INTEGRATION_TESTS", "SUCCESS", 4820L,
                Arrays.asList(
                        "[INFO] Running JUnit 5 Jupiter & MockMvc test suite...",
                        "[INFO] Running com.neuroforge.RbacAuthorizationTest (5 tests)",
                        "[INFO] Running com.neuroforge.AuthControllerTest (1 test)",
                        "[SUCCESS] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0"
                )
        ));

        // Stage 4: Sonar Quality Gate Scan
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "SONAR_QUALITY_GATE", "SUCCESS", 2100L,
                Arrays.asList(
                        "[INFO] Analyzing security hotspots and code smells...",
                        "[INFO] Code Coverage: 92.4% | Security Vulnerabilities: 0",
                        "[SUCCESS] SonarQube Quality Gate Status: PASSED (Grade A)"
                )
        ));

        // Stage 5: Containerize & Image Registry Push
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "DOCKER_BUILD_PUSH", "SUCCESS", 3900L,
                Arrays.asList(
                        "[INFO] Building multi-stage Docker image: neuroforge/app:" + commitHash,
                        "[INFO] Pushing layer 1/3: eclipse-temurin:21-jre-alpine",
                        "[SUCCESS] Pushed image registry.neuroforge.io/apps:" + commitHash
                )
        ));

        // Stage 6: Environment Deployment
        stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                "DEPLOY_DEV", "SUCCESS", 1850L,
                Arrays.asList(
                        "[INFO] Deploying revision " + commitHash + " to Kubernetes cluster (dev-cluster)",
                        "[INFO] Applying manifest: deployment.yaml, service.yaml",
                        "[SUCCESS] 3/3 pods healthy. Ingress routing active."
                )
        ));

        long totalDurationMs = stageDtos.stream().mapToLong(PipelineRunResponse.PipelineStageDto::getDurationMs).sum();
        LocalDateTime completedAt = startedAt.plusNanos(totalDurationMs * 1_000_000L);

        CiPipeline pipeline = new CiPipeline(
                pipelineId,
                repo,
                repo.getProject(),
                triggeredByUser,
                "SUCCESS",
                targetBranch,
                commitHash,
                repo.getRepositoryName() + " Build Pipeline",
                totalDurationMs,
                startedAt,
                completedAt
        );

        int order = 1;
        for (PipelineRunResponse.PipelineStageDto stageDto : stageDtos) {
            LocalDateTime stageStart = startedAt.plusNanos((order - 1) * 2000L * 1_000_000L);
            LocalDateTime stageEnd = stageStart.plusNanos(stageDto.getDurationMs() * 1_000_000L);
            String logs = stageDto.getLogs() != null ? String.join("\n", stageDto.getLogs()) : "";

            CiPipelineStage stageEntity = new CiPipelineStage(
                    pipeline,
                    stageDto.getStageName(),
                    order++,
                    stageDto.getStatus(),
                    stageStart,
                    stageEnd,
                    stageDto.getDurationMs(),
                    logs
            );
            pipeline.addStage(stageEntity);
        }

        pipeline = ciPipelineRepository.save(pipeline);
        logger.info("Persisted CI/CD Pipeline [{}] for repository [{}]", pipelineId, repo.getRepositoryName());

        auditLogService.record("PIPELINE_RUN_TRIGGER", "TRIGGER", "PIPELINE", Long.valueOf(repo.getRepositoryId()), "Simulated CI/CD 6-stage pipeline build executed for branch [" + targetBranch + "].");

        return mapToResponse(pipeline);
    }

    @Transactional(readOnly = true)
    public List<PipelineRunResponse> getPipelineHistory() {
        List<CiPipeline> pipelines = ciPipelineRepository.findAllByOrderByCreatedAtDesc();
        return pipelines.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PipelineRunResponse getPipelineById(String pipelineId) {
        CiPipeline pipeline = ciPipelineRepository.findByPipelineId(pipelineId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline run not found with id: " + pipelineId));
        return mapToResponse(pipeline);
    }

    private PipelineRunResponse mapToResponse(CiPipeline pipeline) {
        PipelineRunResponse res = new PipelineRunResponse();
        res.setPipelineId(pipeline.getPipelineId());
        if (pipeline.getRepository() != null) {
            res.setRepositoryId(pipeline.getRepository().getRepositoryId());
            res.setRepositoryName(pipeline.getRepository().getRepositoryName());
        } else {
            res.setRepositoryName(pipeline.getPipelineName() != null ? pipeline.getPipelineName() : "Repository");
        }
        res.setBranch(pipeline.getBranchName());
        res.setCommitHash(pipeline.getCommitHash());
        res.setStatus(pipeline.getStatus());
        res.setDurationMs(pipeline.getDurationMs());
        res.setStartedAt(pipeline.getStartedAt() != null ? pipeline.getStartedAt() : pipeline.getCreatedAt());

        List<PipelineRunResponse.PipelineStageDto> stageDtos = new ArrayList<>();
        if (pipeline.getStages() != null) {
            for (CiPipelineStage stage : pipeline.getStages()) {
                List<String> logsList = (stage.getLogs() != null && !stage.getLogs().isBlank())
                        ? Arrays.asList(stage.getLogs().split("\n"))
                        : Collections.emptyList();
                stageDtos.add(new PipelineRunResponse.PipelineStageDto(
                        stage.getStageName(),
                        stage.getStatus(),
                        stage.getDurationMs(),
                        logsList
                ));
            }
        }
        res.setStages(stageDtos);

        return res;
    }
}