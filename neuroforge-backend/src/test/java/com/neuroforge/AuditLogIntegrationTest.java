package com.neuroforge;

import com.neuroforge.dto.request.ProjectRequest;
import com.neuroforge.dto.request.TaskStatusUpdateRequest;
import com.neuroforge.dto.response.AuditLogResponse;
import com.neuroforge.entity.AuditLog;
import com.neuroforge.repository.AuditLogRepository;
import com.neuroforge.service.AuditLogService;
import com.neuroforge.service.ProjectService;
import com.neuroforge.service.TaskService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuditLogIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @Test
    @DisplayName("AuditLog: direct persistence and retrieval")
    public void testAuditLogDirectPersistence() {
        AuditLog log = new AuditLog(
                "TEST_EVENT", "CREATE", "TEST_ENTITY", 999L,
                "testuser", 1L, "SYSTEM_ADMIN", "Test audit description",
                "SUCCESS", "/api/test", "127.0.0.1"
        );

        AuditLog saved = auditLogRepository.save(log);
        assertThat(saved.getId()).isNotNull();

        List<AuditLogResponse> logs = auditLogService.getAuditLogs("TEST_EVENT", null, null);
        assertThat(logs).isNotEmpty();
        assertThat(logs.get(0).getEvent()).isEqualTo("TEST_EVENT");
        assertThat(logs.get(0).getDetails()).isEqualTo("Test audit description");
    }

    @Test
    @WithMockUser(username = "admin", roles = {"SYSTEM_ADMIN"})
    @DisplayName("GET /api/audit-logs: authorized role returns audit logs")
    public void testGetAuditLogsAuthorized() throws Exception {
        mockMvc.perform(get("/api/audit-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /api/audit-logs: unauthenticated request rejected with 401")
    public void testGetAuditLogsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/audit-logs"))
                .andExpect(status().isUnauthorized());
    }
}
