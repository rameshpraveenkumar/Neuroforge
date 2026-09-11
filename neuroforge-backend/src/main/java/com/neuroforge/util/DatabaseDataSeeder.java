package com.neuroforge.util;

import com.neuroforge.entity.*;
import com.neuroforge.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseDataSeeder.class);

    private final UserRepository userRepository;
    private final UserPhoneRepository userPhoneRepository;
    private final ProjectRepository projectRepository;
    private final ProjectTechnologyRepository projectTechnologyRepository;
    private final RepositoryEntityRepository repositoryRepository;
    private final RepositoryCollaboratorRepository collaboratorRepository;
    private final RequirementRepository requirementRepository;
    private final RequirementTagRepository requirementTagRepository;
    private final SprintRepository sprintRepository;
    private final SprintGoalRepository sprintGoalRepository;
    private final TaskRepository taskRepository;
    private final TaskLabelRepository taskLabelRepository;
    private final TestCaseRepository testCaseRepository;
    private final BugRepository bugRepository;
    private final CodeCommitRepository commitRepository;
    private final DeploymentRepository deploymentRepository;
    private final DeploymentLogRepository deploymentLogRepository;
    private final DocumentationRepository documentationRepository;
    private final AiAssistantRepository aiAssistantRepository;
    private final ProjectAiRepository projectAiRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${neuroforge.demo-mode.seed-sample-data:true}")
    private boolean seedDataEnabled;

    public DatabaseDataSeeder(UserRepository userRepository,
                              UserPhoneRepository userPhoneRepository,
                              ProjectRepository projectRepository,
                              ProjectTechnologyRepository projectTechnologyRepository,
                              RepositoryEntityRepository repositoryRepository,
                              RepositoryCollaboratorRepository collaboratorRepository,
                              RequirementRepository requirementRepository,
                              RequirementTagRepository requirementTagRepository,
                              SprintRepository sprintRepository,
                              SprintGoalRepository sprintGoalRepository,
                              TaskRepository taskRepository,
                              TaskLabelRepository taskLabelRepository,
                              TestCaseRepository testCaseRepository,
                              BugRepository bugRepository,
                              CodeCommitRepository commitRepository,
                              DeploymentRepository deploymentRepository,
                              DeploymentLogRepository deploymentLogRepository,
                              DocumentationRepository documentationRepository,
                              AiAssistantRepository aiAssistantRepository,
                              ProjectAiRepository projectAiRepository,
                              AiSuggestionRepository aiSuggestionRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userPhoneRepository = userPhoneRepository;
        this.projectRepository = projectRepository;
        this.projectTechnologyRepository = projectTechnologyRepository;
        this.repositoryRepository = repositoryRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.requirementRepository = requirementRepository;
        this.requirementTagRepository = requirementTagRepository;
        this.sprintRepository = sprintRepository;
        this.sprintGoalRepository = sprintGoalRepository;
        this.taskRepository = taskRepository;
        this.taskLabelRepository = taskLabelRepository;
        this.testCaseRepository = testCaseRepository;
        this.bugRepository = bugRepository;
        this.commitRepository = commitRepository;
        this.deploymentRepository = deploymentRepository;
        this.deploymentLogRepository = deploymentLogRepository;
        this.documentationRepository = documentationRepository;
        this.aiAssistantRepository = aiAssistantRepository;
        this.projectAiRepository = projectAiRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedDataEnabled) {
            logger.info("Demo data seeding is disabled via configuration.");
            return;
        }

        if (userRepository.count() > 0) {
            logger.info("Database neuroforge already contains data ({} users found). Skipping seeding.", userRepository.count());
            return;
        }

        logger.info("🌱 Seeding NeuroForge MySQL Database (9 Roles + 2 Projects + Full SDLC Ecosystem)...");

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Seed 9 Enterprise Role Users
        User admin = userRepository.save(new User("Sarah Jenkins", "admin@neuroforge.io", defaultPass, "SYSTEM_ADMIN", "+1 (555) 019-2831"));
        User pm = userRepository.save(new User("Alex Rivera", "pm@neuroforge.io", defaultPass, "PROJECT_MANAGER", "+1 (555) 019-4920"));
        User po = userRepository.save(new User("Elena Rostova", "po@neuroforge.io", defaultPass, "PRODUCT_OWNER", "+1 (555) 019-3321"));
        User ba = userRepository.save(new User("Marcus Vance", "ba@neuroforge.io", defaultPass, "BUSINESS_ANALYST", "+1 (555) 019-4412"));
        User arch = userRepository.save(new User("Dr. Devon Hayes", "architect@neuroforge.io", defaultPass, "SOFTWARE_ARCHITECT", "+1 (555) 019-5567"));
        User dev = userRepository.save(new User("Liam Zhao", "dev@neuroforge.io", defaultPass, "DEVELOPER", "+1 (555) 019-7712"));
        User qa = userRepository.save(new User("Priya Sharma", "qa@neuroforge.io", defaultPass, "QA_ENGINEER", "+1 (555) 019-8834"));
        User devops = userRepository.save(new User("Kurt Becker", "devops@neuroforge.io", defaultPass, "DEVOPS_ENGINEER", "+1 (555) 019-9945"));
        User client = userRepository.save(new User("Clara Sterling", "client@neuroforge.io", defaultPass, "CLIENT", "+1 (555) 019-1122"));

        // 2. User Phones
        userPhoneRepository.save(new UserPhone(admin, "+1 (555) 019-2831"));
        userPhoneRepository.save(new UserPhone(pm, "+1 (555) 019-4920"));
        userPhoneRepository.save(new UserPhone(dev, "+1 (555) 019-7712"));
        userPhoneRepository.save(new UserPhone(qa, "+1 (555) 019-8834"));
        userPhoneRepository.save(new UserPhone(devops, "+1 (555) 019-9945"));

        // 3. Project 1: NeuroCloud Platform
        Project project1 = new Project(
                "NeuroCloud Microservices Platform",
                "Next-generation enterprise cloud orchestration and distributed event-mesh platform.",
                LocalDate.now().minusMonths(2),
                LocalDate.now().plusMonths(4),
                "ACTIVE",
                pm
        );
        project1 = projectRepository.save(project1);

        // Project 2: FinTech Gateway
        Project project2 = new Project(
                "FinTech Core Banking Gateway",
                "High-throughput transactional payment gateway with real-time settlement and PCI-DSS compliance.",
                LocalDate.now().minusMonths(1),
                LocalDate.now().plusMonths(5),
                "ACTIVE",
                pm
        );
        project2 = projectRepository.save(project2);

        // 4. Project Technologies
        projectTechnologyRepository.save(new ProjectTechnology(project1, "React 18"));
        projectTechnologyRepository.save(new ProjectTechnology(project1, "Spring Boot 3.3"));
        projectTechnologyRepository.save(new ProjectTechnology(project1, "MySQL 8.0"));
        projectTechnologyRepository.save(new ProjectTechnology(project1, "Docker"));
        projectTechnologyRepository.save(new ProjectTechnology(project1, "Kubernetes"));

        projectTechnologyRepository.save(new ProjectTechnology(project2, "Java 21"));
        projectTechnologyRepository.save(new ProjectTechnology(project2, "Kafka"));
        projectTechnologyRepository.save(new ProjectTechnology(project2, "Redis"));

        // 5. Repositories
        Repository repo1 = repositoryRepository.save(new Repository(project1, "neurocloud-core-services", "main"));
        Repository repo2 = repositoryRepository.save(new Repository(project2, "fintech-core-gateway", "main"));

        // 6. Repository Collaborators
        collaboratorRepository.save(new RepositoryCollaborator(repo1, dev));
        collaboratorRepository.save(new RepositoryCollaborator(repo1, arch));
        collaboratorRepository.save(new RepositoryCollaborator(repo1, devops));
        collaboratorRepository.save(new RepositoryCollaborator(repo1, qa));
        collaboratorRepository.save(new RepositoryCollaborator(repo2, dev));
        collaboratorRepository.save(new RepositoryCollaborator(repo2, arch));

        // 7. Requirements
        Requirement req1 = requirementRepository.save(new Requirement(
                project1, "Stateless OAuth2 & JWT RBAC Identity Management",
                "The system must enforce fine-grained role-based access control across 9 enterprise roles with cryptographic JWT signatures.",
                "MUST_HAVE", "APPROVED"
        ));
        Requirement req2 = requirementRepository.save(new Requirement(
                project1, "Interactive Drag-and-Drop Sprint Kanban Board",
                "Engineers must be able to visually transition tasks across Backlog, Todo, In Progress, Review, QA Ready, and Done columns.",
                "MUST_HAVE", "APPROVED"
        ));
        Requirement req3 = requirementRepository.save(new Requirement(
                project2, "PCI-DSS Compliant Payment Tokenization Engine",
                "Secure card tokenization vault supporting AES-256 GCM encryption at rest.",
                "MUST_HAVE", "APPROVED"
        ));

        // 8. Requirement Tags
        requirementTagRepository.save(new RequirementTag(req1, "Security"));
        requirementTagRepository.save(new RequirementTag(req1, "Authentication"));
        requirementTagRepository.save(new RequirementTag(req2, "UI/UX"));
        requirementTagRepository.save(new RequirementTag(req3, "Compliance"));

        // 9. Sprints
        Sprint sprint1 = sprintRepository.save(new Sprint(
                project1, "Sprint 1 - Foundation & Core RBAC",
                LocalDate.now().minusWeeks(4), LocalDate.now().minusWeeks(2),
                "COMPLETED"
        ));
        Sprint sprint2 = sprintRepository.save(new Sprint(
                project1, "Sprint 2 - Kanban Board & DevOps Engine",
                LocalDate.now().minusWeeks(1), LocalDate.now().plusWeeks(1),
                "ACTIVE"
        ));
        Sprint sprint3 = sprintRepository.save(new Sprint(
                project2, "Sprint 1 - Ledger Engine Genesis",
                LocalDate.now().minusWeeks(1), LocalDate.now().plusWeeks(2),
                "ACTIVE"
        ));

        // 10. Sprint Goals
        sprintGoalRepository.save(new SprintGoal(sprint1, "Implement Spring Security 6 stateless JWT filter"));
        sprintGoalRepository.save(new SprintGoal(sprint1, "Seed 9 role demo accounts and database schema"));
        sprintGoalRepository.save(new SprintGoal(sprint2, "Deliver interactive drag-and-drop Kanban board"));
        sprintGoalRepository.save(new SprintGoal(sprint3, "Architect immutable financial transaction ledger"));

        // 11. Tasks
        Task task1 = taskRepository.save(new Task(
                sprint1, dev, "Configure Spring Security 6 & Method-Level RBAC",
                "Add @EnableMethodSecurity and protect controllers with @PreAuthorize(hasRole(...))",
                "CRITICAL", "DONE", LocalDate.now().minusWeeks(2)
        ));
        Task task2 = taskRepository.save(new Task(
                sprint2, dev, "Build Responsive React AppLayout and Persona Switcher",
                "Create sleek layout with dark theme accents and persistent 1-click role switcher.",
                "HIGH", "IN_PROGRESS", LocalDate.now().plusDays(3)
        ));
        Task task3 = taskRepository.save(new Task(
                sprint2, devops, "Develop Safe CI/CD Pipeline Simulator",
                "Build background thread runner emitting step-by-step terminal logs without executing host commands.",
                "HIGH", "TODO", LocalDate.now().plusDays(5)
        ));
        Task task4 = taskRepository.save(new Task(
                sprint3, dev, "Implement PCI-DSS Token Vault",
                "Build token generator with AES-256 encryption.",
                "CRITICAL", "IN_PROGRESS", LocalDate.now().plusDays(7)
        ));

        // 12. Task Labels
        taskLabelRepository.save(new TaskLabel(task1, "Backend"));
        taskLabelRepository.save(new TaskLabel(task1, "Security"));
        taskLabelRepository.save(new TaskLabel(task2, "Frontend"));
        taskLabelRepository.save(new TaskLabel(task3, "DevOps"));

        // 13. Test Cases
        TestCase tc1 = testCaseRepository.save(new TestCase(
                task1, 1, "Validate JWT signature expiration rejection",
                "Token validation must fail with 401 on expired timestamp.",
                "HTTP 401 Unauthorized"
        ));
        TestCase tc2 = testCaseRepository.save(new TestCase(
                task1, 2, "Ensure Unauthorized Role Receives 403 Forbidden",
                "Authenticated as CLIENT role attempting write operation.",
                "HTTP 403 Forbidden with JSON error envelope"
        ));

        // 14. Bugs
        bugRepository.save(new Bug(
                tc1, 1, "Token expiration skew during clock drift",
                "MAJOR", "IN_FIX", dev
        ));

        // 15. Code Commits
        commitRepository.save(new CodeCommit(repo1, 1, "feat(auth): configure Spring Security 6 method authorization", LocalDateTime.now().minusDays(10), dev));
        commitRepository.save(new CodeCommit(repo1, 2, "test(auth): add unit test cases for role claims", LocalDateTime.now().minusDays(8), dev));
        commitRepository.save(new CodeCommit(repo2, 1, "init: scaffold financial ledger service", LocalDateTime.now().minusDays(5), dev));

        // 16. Deployments
        Deployment dep1 = deploymentRepository.save(new Deployment(
                project1, "v1.4.0-dev", "DEV", LocalDateTime.now().minusDays(2), "HEALTHY"
        ));
        Deployment dep2 = deploymentRepository.save(new Deployment(
                project1, "v1.3.2", "STAGING", LocalDateTime.now().minusDays(5), "HEALTHY"
        ));
        Deployment dep3 = deploymentRepository.save(new Deployment(
                project1, "v1.3.0", "PRODUCTION", LocalDateTime.now().minusDays(12), "HEALTHY"
        ));

        // 17. Deployment Logs
        deploymentLogRepository.save(new DeploymentLog(dep1, 1, "Deploying image neuroforge/core-api:v1.4.0-dev to dev-cluster", LocalDateTime.now().minusDays(2)));
        deploymentLogRepository.save(new DeploymentLog(dep1, 2, "All 3 pods ready and passing liveness probes.", LocalDateTime.now().minusDays(2)));

        // 18. Documentation
        documentationRepository.save(new Documentation(
                project1, 1, "ADR-001: Adopt Stateless JWT Authentication over HTTP Sessions",
                "ADR", LocalDateTime.now().minusDays(15)
        ));
        documentationRepository.save(new Documentation(
                project1, 2, "ADR-002: Normalized Relational MySQL Schema with Audit Trails",
                "ADR", LocalDateTime.now().minusDays(10)
        ));

        // 19. AI Assistants
        AiAssistant aiStory = aiAssistantRepository.save(new AiAssistant(
                "USER_STORY_GEN", "1.0", "User Story & Acceptance Criteria Architect"
        ));
        AiAssistant aiTest = aiAssistantRepository.save(new AiAssistant(
                "TEST_CASE_GEN", "1.0", "Multi-Vector QA Test Generator"
        ));
        AiAssistant aiRisk = aiAssistantRepository.save(new AiAssistant(
                "SPRINT_RISK", "1.0", "Sprint Health & Delivery Predictor"
        ));

        // 20. Project AI Links
        projectAiRepository.save(new ProjectAi(project1, aiStory));
        projectAiRepository.save(new ProjectAi(project1, aiTest));
        projectAiRepository.save(new ProjectAi(project2, aiStory));

        // 21. AI Suggestions
        aiSuggestionRepository.save(new AiSuggestion(
                aiStory, "User Story for NF-REQ-01: As a System Admin, I want fine-grained RBAC with JWT authentication so that only authorized users can perform sensitive SDLC operations."
        ));

        logger.info("✅ NeuroForge Demo Data Seeding Completed Successfully! All 21 Tables Populated.");
    }
}
