package com.neuroforge;

import com.neuroforge.dto.response.PipelineRunResponse;
import com.neuroforge.entity.CiPipeline;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.Repository;
import com.neuroforge.repository.CiPipelineRepository;
import com.neuroforge.repository.CiPipelineStageRepository;
import com.neuroforge.repository.ProjectRepository;
import com.neuroforge.repository.RepositoryEntityRepository;
import com.neuroforge.service.CiCdSimulatorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CiPipelineIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CiPipelineRepository ciPipelineRepository;

    @Autowired
    private CiPipelineStageRepository ciPipelineStageRepository;

    @Autowired
    private CiCdSimulatorService ciCdSimulatorService;

    @Autowired
    private RepositoryEntityRepository repositoryEntityRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    @DisplayName("CiPipeline: direct persistence of pipeline execution and stages")
    public void testPipelineDirectPersistence() {
        Project project = projectRepository.save(new Project("CI Test Project", "Desc", LocalDate.now(), LocalDate.now().plusMonths(1), "ACTIVE", null));
        Repository repo = repositoryEntityRepository.save(new Repository(project, "ci-test-repo", "main"));

        PipelineRunResponse response = ciCdSimulatorService.triggerPipeline(repo.getRepositoryId(), "main");
        assertThat(response).isNotNull();
        assertThat(response.getPipelineId()).startsWith("PIPE-");
        assertThat(response.getStatus()).isEqualTo("SUCCESS");
        assertThat(response.getStages()).hasSize(6);

        CiPipeline persisted = ciPipelineRepository.findByPipelineId(response.getPipelineId()).orElse(null);
        assertThat(persisted).isNotNull();
        assertThat(persisted.getCommitHash()).isEqualTo(response.getCommitHash());
        assertThat(persisted.getStages()).hasSize(6);
        assertThat(persisted.getStages().get(0).getStageName()).isEqualTo("LINT_CHECK");
    }

    @Test
    @WithMockUser(username = "admin", roles = {"SYSTEM_ADMIN"})
    @DisplayName("GET /api/cicd/history: retrieves persistent pipeline runs")
    public void testGetPipelineHistory() throws Exception {
        mockMvc.perform(get("/api/cicd/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "devops", roles = {"DEVOPS_ENGINEER"})
    @DisplayName("POST /api/cicd/run/repository/{id}: triggers and persists pipeline")
    public void testTriggerPipelineEndpoint() throws Exception {
        Project project = projectRepository.save(new Project("DevOps Test Project", "Desc", LocalDate.now(), LocalDate.now().plusMonths(1), "ACTIVE", null));
        Repository repo = repositoryEntityRepository.save(new Repository(project, "devops-repo", "main"));

        mockMvc.perform(post("/api/cicd/run/repository/" + repo.getRepositoryId() + "?branch=feature/audit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.pipelineId").isNotEmpty())
                .andExpect(jsonPath("$.data.branch").value("feature/audit"))
                .andExpect(jsonPath("$.data.stages").isArray());
    }

    @Test
    @DisplayName("GET /api/cicd/history: unauthenticated request rejected with 401")
    public void testGetHistoryUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/cicd/history"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"SYSTEM_ADMIN"})
    @DisplayName("GET /api/cicd/history: read-only operation does not create new records")
    public void testGetPipelineHistoryIsReadOnly() throws Exception {
        long countBefore = ciPipelineRepository.count();
        mockMvc.perform(get("/api/cicd/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        long countAfter = ciPipelineRepository.count();
        assertThat(countAfter).isEqualTo(countBefore);
    }
}