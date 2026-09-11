package com.neuroforge.service;

import com.neuroforge.dto.response.PipelineRunResponse;
import com.neuroforge.entity.Repository;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.RepositoryEntityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CiCdSimulatorService {

    private final RepositoryEntityRepository repositoryRepository;
    private final Map<String, PipelineRunResponse> executionHistory = new ConcurrentHashMap<>();

    public CiCdSimulatorService(RepositoryEntityRepository repositoryRepository) {
        this.repositoryRepository = repositoryRepository;
    }

    public PipelineRunResponse triggerPipeline(Integer repositoryId, String branch) {
        Repository repo = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with id: " + repositoryId));

        String pipelineId = "PIPE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String commitHash = UUID.randomUUID().toString().substring(0, 7);
        String targetBranch = (branch != null && !branch.isBlank()) ? branch : repo.getBranch();

        List<PipelineRunResponse.PipelineStageDto> stages = new ArrayList<>();

        // Stage 1: Lint & Code Analysis
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "LINT_CHECK", "SUCCESS", 1240L,
                Arrays.asList(
                        "[INFO] Initializing Checkstyle & ESLint engine...",
                        "[INFO] Running static analysis across 95 source files...",
                        "[SUCCESS] 0 errors, 0 warnings found. Code style compliant."
                )
        ));

        // Stage 2: Compile & Build
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "COMPILE_BUILD", "SUCCESS", 3150L,
                Arrays.asList(
                        "[INFO] Executing: javac [release 21] with target Spring Boot 3.3.3",
                        "[INFO] Bytecode generated in target/classes",
                        "[SUCCESS] Main artifact compiled successfully: neuroforge-core.jar"
                )
        ));

        // Stage 3: Automated Unit & Integration Tests
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "UNIT_INTEGRATION_TESTS", "SUCCESS", 4820L,
                Arrays.asList(
                        "[INFO] Running JUnit 5 Jupiter & MockMvc test suite...",
                        "[INFO] Running com.neuroforge.RbacAuthorizationTest (5 tests)",
                        "[INFO] Running com.neuroforge.AuthControllerTest (1 test)",
                        "[SUCCESS] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0"
                )
        ));

        // Stage 4: Sonar Quality Gate Scan
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "SONAR_QUALITY_GATE", "SUCCESS", 2100L,
                Arrays.asList(
                        "[INFO] Analyzing security hotspots and code smells...",
                        "[INFO] Code Coverage: 92.4% | Security Vulnerabilities: 0",
                        "[SUCCESS] SonarQube Quality Gate Status: PASSED (Grade A)"
                )
        ));

        // Stage 5: Containerize & Image Registry Push
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "DOCKER_BUILD_PUSH", "SUCCESS", 3900L,
                Arrays.asList(
                        "[INFO] Building multi-stage Docker image: neuroforge/app:" + commitHash,
                        "[INFO] Pushing layer 1/3: eclipse-temurin:21-jre-alpine",
                        "[SUCCESS] Pushed image registry.neuroforge.io/apps:" + commitHash
                )
        ));

        // Stage 6: Environment Deployment
        stages.add(new PipelineRunResponse.PipelineStageDto(
                "DEPLOY_DEV", "SUCCESS", 1850L,
                Arrays.asList(
                        "[INFO] Deploying revision " + commitHash + " to Kubernetes cluster (dev-cluster)",
                        "[INFO] Applying manifest: deployment.yaml, service.yaml",
                        "[SUCCESS] 3/3 pods healthy. Ingress routing active."
                )
        ));

        long totalDurationMs = stages.stream().mapToLong(PipelineRunResponse.PipelineStageDto::getDurationMs).sum();

        PipelineRunResponse response = new PipelineRunResponse();
        response.setPipelineId(pipelineId);
        response.setRepositoryId(repo.getRepositoryId());
        response.setRepositoryName(repo.getRepositoryName());
        response.setBranch(targetBranch);
        response.setCommitHash(commitHash);
        response.setStatus("SUCCESS");
        response.setDurationMs(totalDurationMs);
        response.setStartedAt(LocalDateTime.now());
        response.setStages(stages);

        executionHistory.put(pipelineId, response);
        return response;
    }

    public List<PipelineRunResponse> getPipelineHistory() {
        if (executionHistory.isEmpty()) {
            // Seed a sample history entry
            repositoryRepository.findAll().stream().findFirst().ifPresent(repo -> {
                triggerPipeline(repo.getRepositoryId(), "main");
            });
        }
        return new ArrayList<>(executionHistory.values());
    }

    public PipelineRunResponse getPipelineById(String pipelineId) {
        PipelineRunResponse run = executionHistory.get(pipelineId);
        if (run == null) {
            throw new ResourceNotFoundException("Pipeline run not found with id: " + pipelineId);
        }
        return run;
    }
}
