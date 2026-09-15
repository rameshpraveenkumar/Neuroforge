package com.neuroforge.service.ai;

import org.springframework.stereotype.Component;

@Component
public class OfflineAiProvider implements AiProvider {

    @Override
    public String generate(String type, String inputPrompt) {
        String topic = inputPrompt != null && !inputPrompt.isBlank() ? inputPrompt.trim() : "System Feature";

        return switch (type != null ? type.toUpperCase() : "USER_STORY") {
            case "TEST_CASE" -> """
                    ### Ã°Å¸Â§Âª AI-Generated Multi-Vector QA Test Matrix for: %s

                    **Test Scenario 1: Happy Path Execution**
                    - *Precondition*: Authenticated user with authorized permissions.
                    - *Action*: Submit valid request payload matching API specifications.
                    - *Expected Result*: HTTP 200 OK returned with structured ApiResponse and valid state update.

                    **Test Scenario 2: Boundary & Edge Condition**
                    - *Precondition*: Concurrent write requests targeting identical resource.
                    - *Action*: Dispatch simultaneous update calls within 10ms window.
                    - *Expected Result*: Optimistic lock check prevents lost updates; returns HTTP 409 Conflict if conflict occurs.

                    **Test Scenario 3: Negative / Authorization Check**
                    - *Precondition*: Unauthorized or expired Bearer JWT token.
                    - *Action*: Invoke protected endpoint with mutated signature.
                    - *Expected Result*: HTTP 401 Unauthorized / HTTP 403 Forbidden with security error envelope.
                    """.formatted(topic);

            case "SPRINT_RISK" -> """
                    ### Ã°Å¸â€œÅ  AI Sprint Velocity & Delivery Risk Assessment: %s

                    - **Overall Health Score**: 88/100 (LOW RISK - On Track)
                    - **Burnup / Velocity Indicator**: Estimated 92%% completion by sprint deadline.
                    - **Risk Factors Identified**:
                      1. 1 pending high-priority bug in verification queue.
                      2. 2 tasks currently in code review stage awaiting approval.
                    - **Recommendations**:
                      - Expedite QA verification for critical defect.
                      - Pair developers on final integration tests.
                    """.formatted(topic);

            case "CODE_REVIEW" -> """
                    ### Ã°Å¸â€Â AI Automated Code Review & Security Analysis: %s

                    - **Architecture & Maintainability**: Clean separation between DTOs, Services, and Repositories.
                    - **Security Evaluation**: Method-level @PreAuthorize correctly configured for RBAC.
                    - **Performance Optimization**: Lazy loading enabled on collections to prevent N+1 queries.
                    - **Verdict**: LGTM! Meets enterprise quality standards.
                    """.formatted(topic);

            default -> """
                    ### Ã°Å¸â€œâ€“ AI-Generated User Story & Acceptance Criteria: %s

                    **User Story**:
                    *As an* Enterprise User,
                    *I want* to %s,
                    *So that* my team can maintain full SDLC traceability and operational efficiency.

                    **Gherkin Acceptance Criteria (BDD)**:
                    - **Given** an authenticated user with appropriate role permissions
                    - **When** the user accesses the management portal and submits valid parameters
                    - **Then** the system should validate the input, persist the relational record, and return an audit confirmation.
                    """.formatted(topic, topic.toLowerCase());
        };
    }

    @Override
    public String getProviderName() {
        return "OFFLINE_HEURISTIC";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}
