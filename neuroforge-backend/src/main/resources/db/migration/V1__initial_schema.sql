-- =============================================================================
-- NeuroForge Enterprise SDLC Platform - Initial Database Schema Migration
-- Flyway Version: V1
-- =============================================================================

-- 1. Users & Profiles
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    phone VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Phone Numbers
CREATE TABLE IF NOT EXISTS user_phone (
    user_id INT NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, phone_number),
    CONSTRAINT fk_user_phone_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects
CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(255) DEFAULT 'ACTIVE',
    manager_id INT,
    CONSTRAINT fk_projects_manager FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Project Technologies
CREATE TABLE IF NOT EXISTS project_technology (
    project_id INT NOT NULL,
    technology_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id, technology_name),
    CONSTRAINT fk_project_tech_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Repositories
CREATE TABLE IF NOT EXISTS repositories (
    repository_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNIQUE,
    repository_name VARCHAR(255) NOT NULL,
    repository_url VARCHAR(255),
    default_branch VARCHAR(255) DEFAULT 'main',
    created_date DATE,
    CONSTRAINT fk_repositories_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Repository Collaborators
CREATE TABLE IF NOT EXISTS repository_collaborator (
    repository_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (repository_id, user_id),
    CONSTRAINT fk_repo_collab_repo FOREIGN KEY (repository_id) REFERENCES repositories(repository_id) ON DELETE CASCADE,
    CONSTRAINT fk_repo_collab_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Requirements
CREATE TABLE IF NOT EXISTS requirements (
    requirement_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(255) DEFAULT 'FUNCTIONAL',
    priority VARCHAR(255) DEFAULT 'MEDIUM',
    status VARCHAR(255) DEFAULT 'DRAFT',
    created_date DATE,
    CONSTRAINT fk_requirements_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Requirement Tags
CREATE TABLE IF NOT EXISTS requirement_tag (
    requirement_id INT NOT NULL,
    tag_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (requirement_id, tag_name),
    CONSTRAINT fk_req_tag_req FOREIGN KEY (requirement_id) REFERENCES requirements(requirement_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Sprints
CREATE TABLE IF NOT EXISTS sprints (
    sprint_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(255) DEFAULT 'PLANNED',
    CONSTRAINT fk_sprints_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Sprint Goals
CREATE TABLE IF NOT EXISTS sprint_goal (
    sprint_id INT NOT NULL,
    goal_number INT NOT NULL,
    goal_description TEXT,
    PRIMARY KEY (sprint_id, goal_number),
    CONSTRAINT fk_sprint_goal_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    assigned_user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(255) DEFAULT 'MEDIUM',
    status VARCHAR(255) DEFAULT 'TODO',
    due_date DATE,
    CONSTRAINT fk_tasks_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_user FOREIGN KEY (assigned_user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Task Labels
CREATE TABLE IF NOT EXISTS task_label (
    task_id INT NOT NULL,
    label_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (task_id, label_name),
    CONSTRAINT fk_task_label_task FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. QA Test Cases
CREATE TABLE IF NOT EXISTS test_cases (
    task_id INT NOT NULL,
    test_number INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    description TEXT,
    expected_result TEXT,
    PRIMARY KEY (task_id, test_number),
    CONSTRAINT fk_test_cases_task FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Bugs / Defects
CREATE TABLE IF NOT EXISTS bugs (
    task_id INT NOT NULL,
    test_number INT NOT NULL,
    bug_number INT NOT NULL,
    bug_title VARCHAR(255) NOT NULL,
    severity VARCHAR(255) DEFAULT 'MAJOR',
    status VARCHAR(255) DEFAULT 'NEW',
    assigned_developer_id INT,
    PRIMARY KEY (task_id, test_number, bug_number),
    CONSTRAINT fk_bugs_test_case FOREIGN KEY (task_id, test_number) REFERENCES test_cases(task_id, test_number) ON DELETE CASCADE,
    CONSTRAINT fk_bugs_developer FOREIGN KEY (assigned_developer_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Code Commits
CREATE TABLE IF NOT EXISTS code_commits (
    repository_id INT NOT NULL,
    commit_hash VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    commit_message TEXT,
    commit_date DATETIME,
    branch_name VARCHAR(255) DEFAULT 'main',
    lines_added INT DEFAULT 0,
    lines_deleted INT DEFAULT 0,
    PRIMARY KEY (repository_id, commit_hash),
    CONSTRAINT fk_commits_repository FOREIGN KEY (repository_id) REFERENCES repositories(repository_id) ON DELETE CASCADE,
    CONSTRAINT fk_commits_author FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Deployments
CREATE TABLE IF NOT EXISTS deployments (
    deployment_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    version VARCHAR(255) NOT NULL,
    environment VARCHAR(255) NOT NULL,
    deployment_date DATETIME,
    status VARCHAR(255) DEFAULT 'HEALTHY',
    CONSTRAINT fk_deployments_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Deployment Logs
CREATE TABLE IF NOT EXISTS deployment_log (
    deployment_id INT NOT NULL,
    log_number INT NOT NULL,
    log_message TEXT,
    log_time DATETIME,
    PRIMARY KEY (deployment_id, log_number),
    CONSTRAINT fk_deployment_log_deployment FOREIGN KEY (deployment_id) REFERENCES deployments(deployment_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Documentation & ADRs
CREATE TABLE IF NOT EXISTS documentation (
    project_id INT NOT NULL,
    document_version INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(255) DEFAULT 'ADR',
    content MEDIUMTEXT,
    updated_date DATE,
    author_id INT,
    PRIMARY KEY (project_id, document_version),
    CONSTRAINT fk_doc_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_author FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. AI Assistants
CREATE TABLE IF NOT EXISTS ai_assistants (
    ai_id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    version VARCHAR(255) NOT NULL,
    recommendation_type VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. AI Suggestions
CREATE TABLE IF NOT EXISTS ai_suggestions (
    suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
    ai_id INT NOT NULL,
    suggestion_text MEDIUMTEXT,
    generated_at DATETIME,
    CONSTRAINT fk_ai_sugg_assistant FOREIGN KEY (ai_id) REFERENCES ai_assistants(ai_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Project AI Linkage
CREATE TABLE IF NOT EXISTS project_ai (
    project_id INT NOT NULL,
    ai_id INT NOT NULL,
    PRIMARY KEY (project_id, ai_id),
    CONSTRAINT fk_project_ai_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_ai_assistant FOREIGN KEY (ai_id) REFERENCES ai_assistants(ai_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
