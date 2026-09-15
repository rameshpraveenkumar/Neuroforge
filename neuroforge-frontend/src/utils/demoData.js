/**
 * NeuroForge Enterprise SDLC & DevOps Platform
 * Offline Presentation Demo Data & Local Mock REST Handler
 * 
 * Provides 100% offline, realistic, and persistent data for all 9 personas and 15 modules.
 */

export const DEMO_PERSONAS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@neuroforge.io',
    fullName: 'Alex Vance',
    role: 'SYSTEM_ADMIN',
    roleDisplayName: 'System Administrator',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-2834', '+1 (555) 019-2835'],
    description: 'Full root governance, user access management, and SOC2 compliance auditing.',
  },
  {
    id: 2,
    username: 'demo_pm',
    email: 'pm@neuroforge.io',
    fullName: 'Elena Rostova',
    role: 'PROJECT_MANAGER',
    roleDisplayName: 'Project Manager',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-4821'],
    description: 'Sprint planning, resource allocation, and team velocity tracking.',
  },
  {
    id: 3,
    username: 'demo_po',
    email: 'po@neuroforge.io',
    fullName: 'Marcus Sterling',
    role: 'PRODUCT_OWNER',
    roleDisplayName: 'Product Owner',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-7712'],
    description: 'Product roadmap vision, backlog prioritization, and milestone sign-off.',
  },
  {
    id: 4,
    username: 'demo_ba',
    email: 'ba@neuroforge.io',
    fullName: 'Sarah Chen',
    role: 'BUSINESS_ANALYST',
    roleDisplayName: 'Senior Business Analyst',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-8390'],
    description: 'Requirements engineering, user story mapping, and acceptance criteria.',
  },
  {
    id: 5,
    username: 'demo_architect',
    email: 'architect@neuroforge.io',
    fullName: 'David Kim',
    role: 'SOFTWARE_ARCHITECT',
    roleDisplayName: 'Principal Enterprise Architect',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-3321'],
    description: 'System architecture, ADR decision records, and technical standards.',
  },
  {
    id: 6,
    username: 'demo_developer',
    email: 'dev@neuroforge.io',
    fullName: "Liam O'Connor",
    role: 'DEVELOPER',
    roleDisplayName: 'Lead Full-Stack Developer',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-5567'],
    description: 'Feature implementation, pull requests, and task execution.',
  },
  {
    id: 7,
    username: 'demo_qa',
    email: 'qa@neuroforge.io',
    fullName: 'Maya Patel',
    role: 'QA_ENGINEER',
    roleDisplayName: 'Lead QA Automation Engineer',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-9941'],
    description: 'Test case authoring, automated test runs, and defect triage.',
  },
  {
    id: 8,
    username: 'demo_devops',
    email: 'devops@neuroforge.io',
    fullName: 'Jordan Hayes',
    role: 'DEVOPS_ENGINEER',
    roleDisplayName: 'DevOps & Infrastructure Specialist',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-6612'],
    description: 'CI/CD pipeline builds, container delivery, and multi-environment deployments.',
  },
  {
    id: 9,
    username: 'demo_client',
    email: 'client@neuroforge.io',
    fullName: 'Sophia Laurent',
    role: 'CLIENT',
    roleDisplayName: 'Client Executive Sponsor',
    avatarUrl: null,
    phoneNumbers: ['+1 (555) 019-1188'],
    description: 'Milestone reviews, project delivery tracking, and UAT verification.',
  },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'NeuroForge Core Enterprise SDLC',
    description: 'Mission-critical enterprise software lifecycle, Kanban workflow, and DevOps orchestration engine.',
    key: 'NF-CORE',
    status: 'ACTIVE',
    category: 'ENTERPRISE_SYSTEM',
    startDate: '2026-01-15',
    targetEndDate: '2026-12-31',
    techStack: ['Java 21', 'Spring Boot 3.3', 'React 18', 'MySQL 8', 'Docker', 'TailwindCSS'],
    manager: { id: 2, fullName: 'Elena Rostova', username: 'demo_pm' },
    memberCount: 9,
    taskCount: 7,
    completedTaskCount: 2,
  },
  {
    id: 2,
    name: 'OmniCloud Financial Payment Gateway',
    description: 'High-throughput payment orchestration platform compliant with PCI-DSS 4.0 and ISO-20022.',
    key: 'OMNI-PAY',
    status: 'ACTIVE',
    category: 'FINANCIAL_TECH',
    startDate: '2026-02-01',
    targetEndDate: '2026-11-30',
    techStack: ['Java 21', 'Kafka', 'Redis', 'PostgreSQL', 'Kubernetes'],
    manager: { id: 2, fullName: 'Elena Rostova', username: 'demo_pm' },
    memberCount: 6,
    taskCount: 14,
    completedTaskCount: 8,
  },
  {
    id: 3,
    name: 'EdgeVision Real-Time Stream Processor',
    description: 'Distributed low-latency telemetry ingestion and anomaly detection pipeline for edge IoT clusters.',
    key: 'EDGE-VIS',
    status: 'PLANNING',
    category: 'DATA_STREAMING',
    startDate: '2026-04-01',
    targetEndDate: '2027-01-31',
    techStack: ['Rust', 'gRPC', 'WebAssembly', 'ClickHouse'],
    manager: { id: 2, fullName: 'Elena Rostova', username: 'demo_pm' },
    memberCount: 4,
    taskCount: 5,
    completedTaskCount: 0,
  },
];

const INITIAL_SPRINTS = [
  {
    id: 1,
    projectId: 1,
    name: 'Sprint 1 - Foundation & Core Entities',
    status: 'COMPLETED',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    goal: 'Establish baseline JPA entities, composite keys, Spring Security JWT filter chain, and React setup.',
    velocity: 42,
    committedPoints: 42,
    completedPoints: 42,
  },
  {
    id: 2,
    projectId: 1,
    name: 'Sprint 2 - Kanban Board & DevOps Engine',
    status: 'ACTIVE',
    startDate: '2026-08-15',
    endDate: '2026-08-29',
    goal: 'Deliver 4-column drag-and-drop Kanban board, CI/CD pipeline runner, and modern SaaS light UI overhaul.',
    velocity: 45,
    committedPoints: 36,
    completedPoints: 10,
  },
  {
    id: 3,
    projectId: 1,
    name: 'Sprint 3 - Enterprise Governance & AI Studio',
    status: 'PLANNING',
    startDate: '2026-08-30',
    endDate: '2026-09-13',
    goal: 'Complete RBAC user governance, SOC2 audit trail exports, and multi-assistant AI synthesis hub.',
    velocity: 40,
    committedPoints: 38,
    completedPoints: 0,
  },
];

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Implement Optimistic Drag-and-Drop Kanban Board with Status Sync',
    description: 'Integrate @hello-pangea/dnd with optimistic UI updates and backend PATCH /api/tasks/{id}/status synchronization.',
    status: 'DONE',
    priority: 'HIGH',
    storyPoints: 5,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 6, fullName: "Liam O'Connor", username: 'demo_developer' },
    labels: ['Frontend', 'React', 'Kanban', 'UX'],
    createdAt: '2026-08-16T10:00:00Z',
  },
  {
    id: 2,
    title: 'Configure 6-Stage CI/CD Pipeline Simulator with Monospace Output Console',
    description: 'Build interactive visual pipeline runner (Lint -> Build -> Test -> Sonar -> Docker -> Deploy) with streaming terminal logs.',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    storyPoints: 8,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 8, fullName: 'Jordan Hayes', username: 'demo_devops' },
    labels: ['DevOps', 'CI/CD', 'Docker', 'Automation'],
    createdAt: '2026-08-17T11:30:00Z',
  },
  {
    id: 3,
    title: 'Synthesize BDD Gherkin User Stories using Offline Heuristic AI Studio',
    description: 'Implement AI assistant prompt presets for automated Given/When/Then acceptance criteria synthesis without external API dependencies.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    storyPoints: 5,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 6, fullName: "Liam O'Connor", username: 'demo_developer' },
    labels: ['AI', 'BDD', 'NLP', 'PromptEngineering'],
    createdAt: '2026-08-18T09:15:00Z',
  },
  {
    id: 4,
    title: 'Multi-Environment Zero-Downtime Deployment Runner for Production Release',
    description: 'Construct environment status matrix (DEV, QA, STAGING, PRODUCTION) with release triggers, health checks, and rollback guards.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    storyPoints: 8,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 8, fullName: 'Jordan Hayes', username: 'demo_devops' },
    labels: ['DevOps', 'Deployment', 'Environments'],
    createdAt: '2026-08-19T14:20:00Z',
  },
  {
    id: 5,
    title: 'Stateless JWT RBAC Security Filter Chain with 9-Persona Switcher',
    description: 'Enforce method-level @PreAuthorize security annotations, token claims, and seamless top-navigation persona switching.',
    status: 'DONE',
    priority: 'CRITICAL',
    storyPoints: 5,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 5, fullName: 'David Kim', username: 'demo_architect' },
    labels: ['Security', 'JWT', 'RBAC', 'Auth'],
    createdAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 6,
    title: 'Verify DORA DevOps Metrics & Defect Density Visualizations',
    description: 'Connect live Recharts telemetry for Lead Time, MTTR, Deployment Frequency, and Change Failure Rate on the executive dashboard.',
    status: 'TODO',
    priority: 'MEDIUM',
    storyPoints: 3,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 7, fullName: 'Maya Patel', username: 'demo_qa' },
    labels: ['QA', 'Analytics', 'DORA', 'Recharts'],
    createdAt: '2026-08-20T16:00:00Z',
  },
  {
    id: 7,
    title: 'MoSCoW Requirements Matrix Traceability Tagging System',
    description: 'Build priority classification (Must/Should/Could/Won\'t Have) linked to sprint tasks, test assertions, and ADR documents.',
    status: 'TODO',
    priority: 'MEDIUM',
    storyPoints: 2,
    projectId: 1,
    sprintId: 2,
    assignee: { id: 4, fullName: 'Sarah Chen', username: 'demo_ba' },
    labels: ['Requirements', 'BA', 'MoSCoW', 'Traceability'],
    createdAt: '2026-08-21T09:45:00Z',
  },
];

const INITIAL_REQUIREMENTS = [
  {
    id: 1,
    projectId: 1,
    title: 'Stateless Multi-Role JWT Authentication & Persona Switcher',
    priority: 'MUST_HAVE',
    status: 'APPROVED',
    category: 'SECURITY',
    compliance: 'SOC2-CC6.1',
    description: 'The platform must enforce stateless JWT Bearer token authentication with role claims covering 9 enterprise personas.',
    acceptanceCriteria: 'Given valid user credentials, When a JWT token is issued, Then subsequent requests authenticate with zero server session state and enforce method-level @PreAuthorize guards.',
    author: { id: 5, fullName: 'David Kim', username: 'demo_architect' },
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 2,
    projectId: 1,
    title: 'Interactive 4-Column Drag-and-Drop Sprint Kanban Board',
    priority: 'MUST_HAVE',
    status: 'APPROVED',
    category: 'PLANNING',
    compliance: 'AGILE-CORE',
    description: 'Sprint planning board must provide smooth drag-and-drop state transitions across TODO, IN_PROGRESS, IN_REVIEW, and DONE columns.',
    acceptanceCriteria: 'Given a task card in any column, When dragged to a new column, Then UI updates optimistically and dispatches PATCH /api/tasks/{id}/status.',
    author: { id: 2, fullName: 'Elena Rostova', username: 'demo_pm' },
    updatedAt: '2026-08-21T11:00:00Z',
  },
  {
    id: 3,
    projectId: 1,
    title: '6-Stage CI/CD Pipeline Simulator with Terminal Console',
    priority: 'MUST_HAVE',
    status: 'APPROVED',
    category: 'DEVOPS',
    compliance: 'ISO-27001',
    description: 'DevOps console must visually execute and stream stdout logs for Lint, Build, Test, SonarQube, Docker, and Deploy stages.',
    acceptanceCriteria: 'Given repository code commit, When build is triggered, Then all 6 stages execute sequentially and render dark monospace terminal logs.',
    author: { id: 8, fullName: 'Jordan Hayes', username: 'demo_devops' },
    updatedAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 4,
    projectId: 1,
    title: 'Domain-Specialized Offline AI Assistant Studio',
    priority: 'SHOULD_HAVE',
    status: 'IN_REVIEW',
    category: 'INTELLIGENCE',
    compliance: 'GDPR-AI',
    description: 'Platform must synthesize BDD stories, QA matrices, sprint risk evaluations, and code reviews using offline deterministic heuristics.',
    acceptanceCriteria: 'Given prompt spec input, When synthesis is requested, Then formatted Markdown response is generated within < 300ms without third-party network dependencies.',
    author: { id: 4, fullName: 'Sarah Chen', username: 'demo_ba' },
    updatedAt: '2026-08-23T15:00:00Z',
  },
  {
    id: 5,
    projectId: 1,
    title: 'Immutable Security Audit Trail with CSV/JSON Export',
    priority: 'MUST_HAVE',
    status: 'APPROVED',
    category: 'GOVERNANCE',
    compliance: 'SOC2-AU1',
    description: 'All authentication events, persona switches, deployment releases, and task mutations must log immutable audit events with export capabilities.',
    acceptanceCriteria: 'Given privileged user actions, When executed, Then audit log stream records timestamp, IP, actor, and details with export support.',
    author: { id: 1, fullName: 'Alex Vance', username: 'admin' },
    updatedAt: '2026-08-24T09:00:00Z',
  },
];

const INITIAL_TEST_CASES = [
  {
    taskId: 5,
    testNumber: 1,
    title: 'Verify JWT Expiration and Role Claim Enforcement',
    type: 'AUTOMATED',
    status: 'PASSED',
    assertions: 12,
    passedCount: 12,
    failedCount: 0,
    durationMs: 420,
    description: 'Assert that expired JWT tokens return 401 Unauthorized and invalid role claims return 403 Forbidden.',
    steps: '1. Issue token with expired exp claim\n2. Call /api/projects\n3. Assert response status is 401\n4. Issue token with CLIENT role\n5. Call /api/admin/users\n6. Assert response status is 403',
  },
  {
    taskId: 1,
    testNumber: 1,
    title: 'Verify Optimistic Kanban Drag-and-Drop Status Mutation',
    type: 'AUTOMATED',
    status: 'PASSED',
    assertions: 8,
    passedCount: 8,
    failedCount: 0,
    durationMs: 310,
    description: 'Assert that dragging task across columns dispatches PATCH /api/tasks/{id}/status and preserves order.',
    steps: '1. Select Task 1 in IN_PROGRESS column\n2. Drag to DONE column\n3. Verify UI state updates\n4. Verify backend status is DONE',
  },
  {
    taskId: 2,
    testNumber: 1,
    title: 'Validate 6-Stage CI/CD Pipeline Execution on Main Branch',
    type: 'AUTOMATED',
    status: 'PASSED',
    assertions: 6,
    passedCount: 6,
    failedCount: 0,
    durationMs: 850,
    description: 'Assert that all 6 stages (LINT, BUILD, TEST, SONAR, DOCKER, DEPLOY) pass successfully with exit code 0.',
    steps: '1. Trigger pipeline for neuroforge-core\n2. Assert Lint passes in 2.1s\n3. Assert Build compiles Java 21\n4. Assert SonarQube score >= A',
  },
  {
    taskId: 3,
    testNumber: 1,
    title: 'Validate Offline Heuristic Prompt Tokenization for User Story Synthesis',
    type: 'AUTOMATED',
    status: 'PASSED',
    assertions: 14,
    passedCount: 14,
    failedCount: 0,
    durationMs: 240,
    description: 'Assert that BDD prompt preset generates valid Given/When/Then acceptance criteria markdown structure.',
    steps: '1. Select StoryForge BDD Agent\n2. Submit portfolio rebalancing prompt\n3. Assert Gherkin blocks are produced in < 250ms',
  },
  {
    taskId: 4,
    testNumber: 1,
    title: 'Verify Multi-Environment Deployment Promotion Rollback on Health Check Failure',
    type: 'AUTOMATED',
    status: 'PASSED',
    assertions: 10,
    passedCount: 10,
    failedCount: 0,
    durationMs: 510,
    description: 'Assert that automated rollback occurs if target production health check endpoint returns non-200.',
    steps: '1. Trigger release v1.0.4 to PRODUCTION\n2. Simulate 503 health check\n3. Verify automated rollback to v1.0.3\n4. Verify alert event logged',
  },
];

const INITIAL_BUGS = [
  {
    taskId: 4,
    testNumber: 1,
    bugNumber: 1,
    title: 'Deployment log timestamp offset when viewing in non-UTC timezone',
    severity: 'LOW',
    status: 'RESOLVED',
    developer: 'Jordan Hayes',
    reportedBy: 'Maya Patel',
    description: 'Deployment timestamp displayed local browser offset without ISO suffix, causing slight confusion in audit logs.',
    stepsToReproduce: '1. Open Deployments page in EST timezone\n2. Inspect release timestamp\n3. Note mismatch with UTC log stream',
    createdAt: '2026-08-20T14:00:00Z',
  },
  {
    taskId: 1,
    testNumber: 1,
    bugNumber: 1,
    title: 'Kanban column count badge does not decrement when task moved to DONE',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    developer: "Liam O'Connor",
    reportedBy: 'Maya Patel',
    description: 'Drag-and-drop state updated column contents but column header counters did not recompute immediately.',
    stepsToReproduce: '1. Drag task from IN_PROGRESS to DONE\n2. Observe column count badges\n3. Verify counters re-render properly',
    createdAt: '2026-08-21T09:30:00Z',
  },
  {
    taskId: 5,
    testNumber: 1,
    bugNumber: 1,
    title: 'CORS preflight rejection on Swagger OpenAPI documentation endpoint',
    severity: 'HIGH',
    status: 'CLOSED',
    developer: 'David Kim',
    reportedBy: 'Alex Vance',
    description: 'OPTIONS preflight requests to /v3/api-docs were intermittently rejected when credentials flag was enabled.',
    stepsToReproduce: '1. Send OPTIONS request with Origin header\n2. Inspect Access-Control-Allow-Origin header\n3. Verified fixed in SecurityConfig',
    createdAt: '2026-08-19T11:00:00Z',
  },
  {
    taskId: 6,
    testNumber: 1,
    bugNumber: 1,
    title: 'Recharts tooltip clipping when chart container shrinks below 380px',
    severity: 'LOW',
    status: 'OPEN',
    developer: "Liam O'Connor",
    reportedBy: 'Maya Patel',
    description: 'On ultra-compact mobile viewports, chart tooltip extends 4px beyond right container boundary.',
    stepsToReproduce: '1. Resize browser window to 360px\n2. Hover over task status donut chart\n3. Note tooltip right overflow',
    createdAt: '2026-08-24T16:00:00Z',
  },
];

const INITIAL_REPOSITORIES = [
  {
    id: 1,
    name: 'neuroforge-core-backend',
    description: 'Spring Boot 3.3 Java 21 REST API, JPA entities, security filter chain, and SDLC domain services.',
    projectId: 1,
    defaultBranch: 'main',
    branchCount: 4,
    commitCount: 148,
    language: 'Java / Spring Boot',
    visibility: 'INTERNAL',
    cloneUrl: 'https://git.neuroforge.io/core/backend.git',
    updatedAt: '2026-08-24T18:00:00Z',
    collaborators: [
      { id: 1, fullName: 'Alex Vance', role: 'ADMIN' },
      { id: 5, fullName: 'David Kim', role: 'MAINTAINER' },
      { id: 6, fullName: "Liam O'Connor", role: 'WRITER' },
      { id: 8, fullName: 'Jordan Hayes', role: 'WRITER' },
    ],
  },
  {
    id: 2,
    name: 'neuroforge-enterprise-web',
    description: 'Vite 5 React 18 frontend with Tailwind CSS, Lucide icons, and modern SaaS light design language.',
    projectId: 1,
    defaultBranch: 'main',
    branchCount: 6,
    commitCount: 212,
    language: 'React / Tailwind CSS',
    visibility: 'INTERNAL',
    cloneUrl: 'https://git.neuroforge.io/web/frontend.git',
    updatedAt: '2026-08-24T19:30:00Z',
    collaborators: [
      { id: 1, fullName: 'Alex Vance', role: 'ADMIN' },
      { id: 6, fullName: "Liam O'Connor", role: 'MAINTAINER' },
      { id: 7, fullName: 'Maya Patel', role: 'WRITER' },
    ],
  },
  {
    id: 3,
    name: 'neuroforge-infra-devops',
    description: 'Multi-environment Docker, Kubernetes manifests, and CI/CD automated pipeline workflows.',
    projectId: 1,
    defaultBranch: 'main',
    branchCount: 3,
    commitCount: 89,
    language: 'Docker / Terraform / Shell',
    visibility: 'INTERNAL',
    cloneUrl: 'https://git.neuroforge.io/infra/devops.git',
    updatedAt: '2026-08-23T12:00:00Z',
    collaborators: [
      { id: 1, fullName: 'Alex Vance', role: 'ADMIN' },
      { id: 8, fullName: 'Jordan Hayes', role: 'MAINTAINER' },
    ],
  },
];

const INITIAL_COMMITS = [
  {
    id: 'c-8821a',
    hash: '8821a0f',
    repositoryId: 1,
    message: 'feat(auth): enforce stateless JWT claims and persona switching filter',
    author: 'David Kim <architect@neuroforge.io>',
    branch: 'main',
    timestamp: '2026-08-24T17:45:00Z',
    stats: '+142 -18',
  },
  {
    id: 'c-7731b',
    hash: '7731b4e',
    repositoryId: 2,
    message: 'refactor(ui): complete minimal light SaaS design system overhaul',
    author: "Liam O'Connor <dev@neuroforge.io>",
    branch: 'main',
    timestamp: '2026-08-24T18:30:00Z',
    stats: '+384 -192',
  },
  {
    id: 'c-6642c',
    hash: '6642c2a',
    repositoryId: 3,
    message: 'ci(pipeline): configure 6-stage simulated build and test workflow',
    author: 'Jordan Hayes <devops@neuroforge.io>',
    branch: 'main',
    timestamp: '2026-08-23T11:20:00Z',
    stats: '+94 -12',
  },
  {
    id: 'c-5519d',
    hash: '5519d88',
    repositoryId: 2,
    message: 'feat(kanban): connect @hello-pangea/dnd with optimistic state sync',
    author: "Liam O'Connor <dev@neuroforge.io>",
    branch: 'main',
    timestamp: '2026-08-22T15:10:00Z',
    stats: '+210 -45',
  },
];

const INITIAL_DOCUMENTATION = [
  {
    id: 1,
    projectId: 1,
    version: '1.0',
    title: 'ADR-001: Adoption of Modular Monolith Architecture',
    status: 'ACCEPTED',
    author: 'David Kim',
    updatedAt: '2026-08-15T09:00:00Z',
    content: `# ADR-001: Adoption of Modular Monolith Architecture

## Status
**ACCEPTED** (2026-08-15)

## Context
NeuroForge requires rapid delivery, strict transactional consistency, and developer simplicity across core SDLC modules including requirements, sprints, Kanban tasks, CI/CD pipelines, and governance auditing.

## Decision
We adopt a **Modular Monolith** architecture powered by **Java 21** and **Spring Boot 3.3**, utilizing strict package-by-feature domain boundaries.

## Consequences
- Single unified deployment artifact running with minimal resource footprint
- Zero distributed network latency or partial failure complexities
- Transactional integrity guarantees across composite JPA primary keys
- Clean domain separation allows future extraction of microservices if scale dictates.`,
  },
  {
    id: 2,
    projectId: 1,
    version: '1.1',
    title: 'ADR-002: Stateless JWT Authentication with Granular Role Claims',
    status: 'ACCEPTED',
    author: 'David Kim',
    updatedAt: '2026-08-16T10:30:00Z',
    content: `# ADR-002: Stateless JWT Authentication with Granular Role Claims

## Status
**ACCEPTED** (2026-08-16)

## Context
Enterprise security mandates stateless session validation with granular role-based access control across 9 distinct user personas.

## Decision
We implement **HMAC-SHA256** signed JWT tokens containing custom claims for \`userId\`, \`username\`, and \`role\`. Spring Security's \`JwtAuthenticationFilter\` validates tokens per request and sets Spring SecurityContext.

## Consequences
- Fully stateless REST API layer with horizontal scale capability
- Method-level authorization enforced via \`@PreAuthorize("hasRole('...')")\`
- Frontend \`PersonaSwitcher\` can seamlessly refresh token without session stickiness.`,
  },
  {
    id: 3,
    projectId: 1,
    version: '1.0',
    title: 'ADR-003: Optimistic UI State Synchronization for Kanban Board',
    status: 'ACCEPTED',
    author: "Liam O'Connor",
    updatedAt: '2026-08-18T14:00:00Z',
    content: `# ADR-003: Optimistic UI State Synchronization for Kanban Board

## Status
**ACCEPTED** (2026-08-18)

## Context
Users expect instant visual feedback when dragging task cards across the 4 Kanban columns (\`TODO\`, \`IN_PROGRESS\`, \`IN_REVIEW\`, \`DONE\`).

## Decision
We implement optimistic UI updates using \`@hello-pangea/dnd\`. The task status is immediately moved in local React state, followed by an asynchronous \`PATCH /api/tasks/{id}/status\` dispatch.

## Consequences
- Zero UI lag or stutter during drag interactions
- Automatic rollback with toast notifications if network errors occur.`,
  },
  {
    id: 4,
    projectId: 1,
    version: '1.0',
    title: 'ADR-004: Offline-First Deterministic Heuristic AI Studio Engine',
    status: 'ACCEPTED',
    author: 'David Kim',
    updatedAt: '2026-08-20T16:00:00Z',
    content: `# ADR-004: Offline-First Deterministic Heuristic AI Studio Engine

## Status
**ACCEPTED** (2026-08-20)

## Context
Enterprise clients operate in air-gapped or restricted network environments where external third-party LLM API calls are prohibited.

## Decision
We construct a domain-specific offline heuristic synthesis engine capable of deterministic BDD Gherkin story generation, QA test matrix synthesis, sprint risk analysis, and architecture reviews.

## Consequences
- Guaranteed < 250ms latency with 0 external API cost or network dependencies
- 100% data privacy and SOC2 data residency compliance.`,
  },
];

const INITIAL_PIPELINE_RUNS = [
  {
    id: 101,
    repositoryId: 1,
    branch: 'main',
    commitHash: '8821a0f',
    triggerBy: 'Jordan Hayes',
    status: 'PASSED',
    durationSeconds: 42,
    createdAt: '2026-08-24T17:50:00Z',
    stages: [
      { name: 'LINT', status: 'PASSED', duration: '2.4s', output: 'Checkstyle & ESLint clean (0 errors, 0 warnings).' },
      { name: 'BUILD', status: 'PASSED', duration: '14.1s', output: 'Compiled 84 Java source files under Java 21 JDK.' },
      { name: 'TEST', status: 'PASSED', duration: '8.3s', output: 'Executed 36 unit and integration test assertions with 100% pass rate.' },
      { name: 'SONAR', status: 'PASSED', duration: '5.2s', output: 'Code Quality Rating: A, Security Hotspots: 0, Coverage: 88.4%.' },
      { name: 'DOCKER', status: 'PASSED', duration: '7.8s', output: 'Built image neuroforge-core:v1.0.4 (Size: 184MB).' },
      { name: 'DEPLOY', status: 'PASSED', duration: '4.2s', output: 'Artifact published to internal registry.' },
    ],
  },
  {
    id: 102,
    repositoryId: 2,
    branch: 'main',
    commitHash: '7731b4e',
    triggerBy: "Liam O'Connor",
    status: 'PASSED',
    durationSeconds: 28,
    createdAt: '2026-08-24T18:35:00Z',
    stages: [
      { name: 'LINT', status: 'PASSED', duration: '1.8s', output: 'Tailwind CSS lint and React JSX syntax verified.' },
      { name: 'BUILD', status: 'PASSED', duration: '12.4s', output: 'Vite 5 bundle compiled in dist/ with 0 errors.' },
      { name: 'TEST', status: 'PASSED', duration: '4.1s', output: 'Jest & React Testing Library: 18 tests passed.' },
      { name: 'SONAR', status: 'PASSED', duration: '3.5s', output: 'Maintainability: A, Zero critical bugs.' },
      { name: 'DOCKER', status: 'PASSED', duration: '4.2s', output: 'Built Nginx SPA image neuroforge-web:v1.0.4 (Size: 28MB).' },
      { name: 'DEPLOY', status: 'PASSED', duration: '2.0s', output: 'Deployed to Staging CDN.' },
    ],
  },
];

const INITIAL_DEPLOYMENTS = [
  {
    id: 1,
    environment: 'DEVELOPMENT',
    version: 'v1.0.5-dev.2',
    status: 'HEALTHY',
    lastDeployedAt: '2026-08-24T18:40:00Z',
    deployedBy: "Liam O'Connor",
    url: 'https://dev.neuroforge.internal',
    commitHash: '7731b4e',
  },
  {
    id: 2,
    environment: 'QA',
    version: 'v1.0.4',
    status: 'HEALTHY',
    lastDeployedAt: '2026-08-24T16:00:00Z',
    deployedBy: 'Maya Patel',
    url: 'https://qa.neuroforge.internal',
    commitHash: '8821a0f',
  },
  {
    id: 3,
    environment: 'STAGING',
    version: 'v1.0.4',
    status: 'HEALTHY',
    lastDeployedAt: '2026-08-24T14:30:00Z',
    deployedBy: 'Jordan Hayes',
    url: 'https://staging.neuroforge.io',
    commitHash: '8821a0f',
  },
  {
    id: 4,
    environment: 'PRODUCTION',
    version: 'v1.0.3',
    status: 'HEALTHY',
    lastDeployedAt: '2026-08-22T08:00:00Z',
    deployedBy: 'Jordan Hayes',
    url: 'https://app.neuroforge.io',
    commitHash: '5519d88',
  },
];

const INITIAL_AI_ASSISTANTS = [
  {
    id: 1,
    name: 'CodeCraft Lead Architect',
    modelName: 'NeuroForge-Architect-v1',
    specialty: 'Software Architecture, Clean Design Patterns & SQL Concurrency',
    description: 'Specialized domain agent for evaluating architectural patterns, transactional boundaries, and composite keys.',
  },
  {
    id: 2,
    name: 'StoryForge BDD Synthesizer',
    modelName: 'NeuroForge-BDD-Engine',
    specialty: 'BDD User Stories & Gherkin Acceptance Criteria',
    description: 'Synthesizes complete user stories with Given/When/Then acceptance criteria and edge cases.',
  },
  {
    id: 3,
    name: 'TestMatrix QA Agent',
    modelName: 'NeuroForge-QA-Matrix',
    specialty: 'QA Test Cases, Assertions & Boundary Testing',
    description: 'Generates automated test suites, boundary assertion matrices, and negative validation criteria.',
  },
  {
    id: 4,
    name: 'SprintGuard Risk Evaluator',
    modelName: 'NeuroForge-SprintRisk-v1',
    specialty: 'Sprint Delivery, Scope Velocity & Bottleneck Analysis',
    description: 'Evaluates developer workload distribution, story point commitments, and blocker risks.',
  },
];

const INITIAL_AI_SUGGESTIONS = [
  {
    id: 1,
    aiAssistantId: 2,
    suggestionType: 'USER_STORY',
    prompt: 'As a financial analyst, I need real-time portfolio rebalancing so that risk exposure is minimized.',
    suggestionText: `### 📋 User Story: Real-Time Portfolio Rebalancing Engine

**As a** Certified Financial Analyst  
**I want to** execute automated real-time portfolio rebalancing across multi-asset allocations  
**So that** risk exposure remains strictly within target thresholds during high market volatility.

---

#### ✅ Acceptance Criteria (Gherkin Scenarios)

\`\`\`gherkin
Feature: Automated Risk-Weighted Portfolio Rebalancing

  Scenario: Immediate threshold breach trigger
    Given an investment portfolio with 60% Equity and 40% Fixed Income target
    When equity asset valuation changes by more than +/- 3.5% within 15 minutes
    Then the rebalancing engine must generate compensating limit orders
    And dispatch a high-priority notification to the assigned portfolio manager.

  Scenario: Circuit breaker during illiquid market conditions
    Given market depth spread exceeds 50 basis points on constituent assets
    When rebalancing calculations are evaluated
    Then order execution must pause in PENDING_LIQUIDITY state
    And log an audit event to the risk governance register.
\`\`\`

#### 🛡️ Non-Functional Requirements
1. Execution latency: $\\le 120\\text{ms}$ end-to-end
2. Idempotency: All rebalancing execution orders must contain deterministic UUID idempotency tokens.`,
    createdAt: '2026-08-24T12:00:00Z',
  },
  {
    id: 2,
    aiAssistantId: 1,
    suggestionType: 'CODE_REVIEW',
    prompt: 'Review JPA composite key mapping and transactional isolation level for DeploymentLog entity associations.',
    suggestionText: `### 🔍 Architecture & Code Review: DeploymentLog Entity Composite Mapping

#### 1. Composite Key Strategy Analysis
- **Finding**: Using \`@Embeddable\` with \`@EmbeddedId\` correctly models the hierarchical relationship \`(taskId, testNumber, bugNumber)\`.
- **Recommendation**: Ensure \`equals()\` and \`hashCode()\` utilize all composite fields to avoid Hibernate entity cache collisions.

#### 2. Transactional Isolation & Concurrency
\`\`\`java
@Transactional(isolation = Isolation.READ_COMMITTED, timeout = 5)
public Deployment recordDeployment(DeploymentRequest request) {
    // Verified optimistic locking with @Version to prevent concurrent release race conditions.
    return deploymentRepository.save(deployment);
}
\`\`\`

#### 3. Performance Assessment
- **Query Plan**: Index \`idx_task_status_sprint\` is optimal for Kanban board grouping queries ($O(\\log N)$ lookup).`,
    createdAt: '2026-08-23T15:30:00Z',
  },
];

// Helper to load/save state from localStorage
const getStorageData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`neuroforge_demo_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageData = (key, data) => {
  try {
    localStorage.setItem(`neuroforge_demo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
};

/**
 * Universal Demo Request Router
 * Simulates Spring Boot REST API responses for all endpoints.
 */
export const handleDemoRequest = async (config) => {
  const url = typeof config === 'string' ? config : (config.url || '');
  const method = (config.method || 'get').toLowerCase();
  const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
  const params = config.params || {};

  // Clean URL path
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0];

  // Simulate short realistic network latency (30-60ms)
  await new Promise((r) => setTimeout(r, 40));

  // 1. AUTH ENDPOINTS
  if (cleanUrl === '/auth/demo-personas') {
    return { success: true, data: DEMO_PERSONAS };
  }

  if (cleanUrl === '/auth/me') {
    const savedUser = localStorage.getItem('neuroforge_user');
    const user = savedUser ? JSON.parse(savedUser) : DEMO_PERSONAS[5]; // default Developer
    return { success: true, data: user };
  }

  if (cleanUrl === '/auth/demo-switch' || cleanUrl.startsWith('/auth/demo-switch')) {
    let targetRole = 'DEVELOPER';
    if (url.includes('role=')) {
      targetRole = url.split('role=')[1].split('&')[0];
    } else if (params.role) {
      targetRole = params.role;
    }
    const persona = DEMO_PERSONAS.find((p) => p.role === targetRole) || DEMO_PERSONAS[5];

    const authData = {
      accessToken: `demo-jwt-${targetRole.toLowerCase()}-${Date.now()}`,
      userId: persona.id,
      username: persona.username,
      email: persona.email,
      fullName: persona.fullName,
      role: persona.role,
      roleDisplayName: persona.roleDisplayName,
      avatarUrl: persona.avatarUrl,
    };

    localStorage.setItem('neuroforge_token', authData.accessToken);
    localStorage.setItem('neuroforge_user', JSON.stringify(authData));
    localStorage.setItem('neuroforge_demo_mode', 'true');

    return { success: true, message: `Switched to persona ${persona.fullName}`, data: authData };
  }

  if (cleanUrl === '/auth/login') {
    const input = (data.usernameOrEmail || '').toLowerCase();
    const persona =
      DEMO_PERSONAS.find((p) => p.email.toLowerCase() === input || p.username.toLowerCase() === input) ||
      DEMO_PERSONAS.find((p) => input.includes(p.username)) ||
      DEMO_PERSONAS[5]; // fallback developer

    const authData = {
      accessToken: `demo-jwt-${persona.role.toLowerCase()}-${Date.now()}`,
      userId: persona.id,
      username: persona.username,
      email: persona.email,
      fullName: persona.fullName,
      role: persona.role,
      roleDisplayName: persona.roleDisplayName,
      avatarUrl: persona.avatarUrl,
    };

    localStorage.setItem('neuroforge_token', authData.accessToken);
    localStorage.setItem('neuroforge_user', JSON.stringify(authData));
    localStorage.setItem('neuroforge_demo_mode', 'true');

    return { success: true, message: 'Authentication successful', data: authData };
  }

  // 2. PROJECTS ENDPOINTS
  let projects = getStorageData('projects', INITIAL_PROJECTS);

  if (cleanUrl === '/projects' && method === 'get') {
    return { success: true, data: projects };
  }

  if (cleanUrl.match(/^\/projects\/\d+$/) && method === 'get') {
    const id = parseInt(cleanUrl.split('/')[2]);
    const p = projects.find((x) => x.id === id) || projects[0];
    return { success: true, data: p };
  }

  if (cleanUrl === '/projects' && method === 'post') {
    const newProj = {
      id: Date.now(),
      name: data.name || 'New Enterprise Project',
      key: (data.name || 'PROJ').slice(0, 4).toUpperCase(),
      description: data.description || '',
      status: data.status || 'ACTIVE',
      category: data.category || 'ENTERPRISE_SYSTEM',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      targetEndDate: data.targetEndDate || '2026-12-31',
      techStack: data.techStack || ['React', 'Spring Boot'],
      manager: DEMO_PERSONAS[1],
      memberCount: 5,
      taskCount: 0,
      completedTaskCount: 0,
    };
    projects = [newProj, ...projects];
    setStorageData('projects', projects);
    return { success: true, message: 'Project created', data: newProj };
  }

  if (cleanUrl.match(/^\/projects\/\d+$/) && method === 'put') {
    const id = parseInt(cleanUrl.split('/')[2]);
    projects = projects.map((p) => (p.id === id ? { ...p, ...data } : p));
    setStorageData('projects', projects);
    return { success: true, message: 'Project updated', data: data };
  }

  if (cleanUrl.match(/^\/projects\/\d+$/) && method === 'delete') {
    const id = parseInt(cleanUrl.split('/')[2]);
    projects = projects.filter((p) => p.id !== id);
    setStorageData('projects', projects);
    return { success: true, message: 'Project deleted' };
  }

  // 3. SPRINTS ENDPOINTS
  let sprints = getStorageData('sprints', INITIAL_SPRINTS);

  if ((cleanUrl === '/sprints' || cleanUrl.startsWith('/sprints/project')) && method === 'get') {
    return { success: true, data: sprints };
  }

  if (cleanUrl.match(/^\/sprints\/\d+$/) && method === 'get') {
    const id = parseInt(cleanUrl.split('/')[2]);
    const s = sprints.find((x) => x.id === id) || sprints[1];
    return { success: true, data: s };
  }

  if (cleanUrl === '/sprints' && method === 'post') {
    const newSprint = {
      id: Date.now(),
      projectId: data.projectId || 1,
      name: data.name || 'New Sprint',
      status: data.status || 'PLANNING',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2026-09-15',
      goal: data.goal || '',
      velocity: 40,
      committedPoints: data.committedPoints || 30,
      completedPoints: 0,
    };
    sprints = [...sprints, newSprint];
    setStorageData('sprints', sprints);
    return { success: true, message: 'Sprint created', data: newSprint };
  }

  // 4. TASKS ENDPOINTS
  let tasks = getStorageData('tasks', INITIAL_TASKS);

  if ((cleanUrl === '/tasks' || cleanUrl.startsWith('/tasks/sprint') || cleanUrl.startsWith('/tasks/assignee')) && method === 'get') {
    return { success: true, data: tasks };
  }

  if (cleanUrl.match(/^\/tasks\/\d+$/) && method === 'get') {
    const id = parseInt(cleanUrl.split('/')[2]);
    const t = tasks.find((x) => x.id === id) || tasks[0];
    return { success: true, data: t };
  }

  // PATCH /tasks/:id/status (Kanban drag-and-drop & inline select)
  if (cleanUrl.match(/^\/tasks\/\d+\/status$/) && method === 'patch') {
    const id = parseInt(cleanUrl.split('/')[2]);
    let newStatus = data.status;
    if (!newStatus && url.includes('status=')) {
      newStatus = url.split('status=')[1].split('&')[0];
    }
    tasks = tasks.map((t) => (t.id === id ? { ...t, status: newStatus || 'DONE' } : t));
    setStorageData('tasks', tasks);
    const updated = tasks.find((t) => t.id === id);
    return { success: true, message: 'Task status updated', data: updated };
  }

  if (cleanUrl === '/tasks' && method === 'post') {
    const newTask = {
      id: Date.now(),
      title: data.title || 'New Task',
      description: data.description || '',
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      storyPoints: data.storyPoints || 3,
      projectId: data.projectId || 1,
      sprintId: data.sprintId || 2,
      assignee: DEMO_PERSONAS[5],
      labels: data.labels || ['Feature'],
      createdAt: new Date().toISOString(),
    };
    tasks = [newTask, ...tasks];
    setStorageData('tasks', tasks);
    return { success: true, message: 'Task created', data: newTask };
  }

  if (cleanUrl.match(/^\/tasks\/\d+$/) && method === 'put') {
    const id = parseInt(cleanUrl.split('/')[2]);
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
    setStorageData('tasks', tasks);
    return { success: true, message: 'Task updated', data: data };
  }

  if (cleanUrl.match(/^\/tasks\/\d+$/) && method === 'delete') {
    const id = parseInt(cleanUrl.split('/')[2]);
    tasks = tasks.filter((t) => t.id !== id);
    setStorageData('tasks', tasks);
    return { success: true, message: 'Task deleted' };
  }

  // 5. REQUIREMENTS ENDPOINTS
  let requirements = getStorageData('requirements', INITIAL_REQUIREMENTS);

  if ((cleanUrl === '/requirements' || cleanUrl.startsWith('/requirements/project')) && method === 'get') {
    return { success: true, data: requirements };
  }

  if (cleanUrl === '/requirements' && method === 'post') {
    const newReq = {
      id: Date.now(),
      projectId: data.projectId || 1,
      title: data.title,
      priority: data.priority || 'MUST_HAVE',
      status: data.status || 'APPROVED',
      category: data.category || 'FUNCTIONAL',
      compliance: data.compliance || 'STANDARD',
      description: data.description || '',
      acceptanceCriteria: data.acceptanceCriteria || '',
      author: DEMO_PERSONAS[3],
      updatedAt: new Date().toISOString(),
    };
    requirements = [newReq, ...requirements];
    setStorageData('requirements', requirements);
    return { success: true, message: 'Requirement created', data: newReq };
  }

  // 6. QA & TEST CASES
  let testCases = getStorageData('test_cases', INITIAL_TEST_CASES);

  if ((cleanUrl === '/test-cases' || cleanUrl.startsWith('/test-cases/task')) && method === 'get') {
    return { success: true, data: testCases };
  }

  if (cleanUrl === '/test-cases' && method === 'post') {
    const newTC = {
      taskId: data.taskId || 1,
      testNumber: testCases.length + 1,
      title: data.title || 'New Test Suite',
      type: data.type || 'AUTOMATED',
      status: data.status || 'PASSED',
      assertions: data.assertions || 5,
      passedCount: data.assertions || 5,
      failedCount: 0,
      durationMs: 350,
      description: data.description || '',
      steps: data.steps || '',
    };
    testCases = [newTC, ...testCases];
    setStorageData('test_cases', testCases);
    return { success: true, message: 'Test Case created', data: newTC };
  }

  // 7. BUGS & DEFECTS
  let bugs = getStorageData('bugs', INITIAL_BUGS);

  if ((cleanUrl === '/bugs' || cleanUrl.startsWith('/bugs/')) && method === 'get') {
    return { success: true, data: bugs };
  }

  if (cleanUrl.match(/\/bugs\/.*\/status/) && method === 'patch') {
    return { success: true, message: 'Bug status updated' };
  }

  if (cleanUrl === '/bugs' && method === 'post') {
    const newBug = {
      taskId: data.taskId || 1,
      testNumber: 1,
      bugNumber: bugs.length + 1,
      title: data.title || 'New Bug Report',
      severity: data.severity || 'MEDIUM',
      status: data.status || 'OPEN',
      developer: "Liam O'Connor",
      reportedBy: 'Maya Patel',
      description: data.description || '',
      stepsToReproduce: data.stepsToReproduce || '',
      createdAt: new Date().toISOString(),
    };
    bugs = [newBug, ...bugs];
    setStorageData('bugs', bugs);
    return { success: true, message: 'Bug logged', data: newBug };
  }

  // 8. REPOSITORIES & COMMITS
  let repositories = getStorageData('repositories', INITIAL_REPOSITORIES);
  let commits = getStorageData('commits', INITIAL_COMMITS);

  if ((cleanUrl === '/repositories' || cleanUrl.startsWith('/repositories/project')) && method === 'get') {
    return { success: true, data: repositories };
  }

  if (cleanUrl.startsWith('/commits/repository') && method === 'get') {
    return { success: true, data: commits };
  }

  // 9. DOCUMENTATION & ADRs
  let docs = getStorageData('docs', INITIAL_DOCUMENTATION);

  if ((cleanUrl === '/documentation' || cleanUrl.startsWith('/documentation/project')) && method === 'get') {
    return { success: true, data: docs };
  }

  if (cleanUrl === '/documentation' && method === 'post') {
    const newDoc = {
      id: Date.now(),
      projectId: data.projectId || 1,
      version: data.version || '1.0',
      title: data.title || 'New Architecture Decision Record',
      status: data.status || 'ACCEPTED',
      author: 'David Kim',
      updatedAt: new Date().toISOString(),
      content: data.content || '# New ADR Document',
    };
    docs = [newDoc, ...docs];
    setStorageData('docs', docs);
    return { success: true, message: 'Documentation created', data: newDoc };
  }

  // 10. CI/CD PIPELINES
  let pipelines = getStorageData('pipelines', INITIAL_PIPELINE_RUNS);

  if (cleanUrl === '/cicd/history' && method === 'get') {
    return { success: true, data: pipelines };
  }

  if (cleanUrl.startsWith('/cicd/run/repository') && method === 'post') {
    const newRun = {
      id: Date.now(),
      repositoryId: 1,
      branch: 'main',
      commitHash: Math.random().toString(16).slice(2, 9),
      triggerBy: 'Jordan Hayes (DevOps)',
      status: 'PASSED',
      durationSeconds: 38,
      createdAt: new Date().toISOString(),
      stages: [
        { name: 'LINT', status: 'PASSED', duration: '2.1s', output: 'Syntax analysis passed. Zero lint regressions.' },
        { name: 'BUILD', status: 'PASSED', duration: '13.8s', output: 'Compiled clean production artifact on Java 21.' },
        { name: 'TEST', status: 'PASSED', duration: '7.9s', output: '42 test assertions executed. 100% pass.' },
        { name: 'SONAR', status: 'PASSED', duration: '4.9s', output: 'SonarQube Quality Gate: PASSED (Grade A).' },
        { name: 'DOCKER', status: 'PASSED', duration: '6.5s', output: 'Image neuroforge-core:v1.0.5 built successfully.' },
        { name: 'DEPLOY', status: 'PASSED', duration: '2.8s', output: 'Deployment trigger dispatched to Staging.' },
      ],
    };
    pipelines = [newRun, ...pipelines];
    setStorageData('pipelines', pipelines);
    return { success: true, message: 'Pipeline executed successfully', data: newRun };
  }

  // 11. DEPLOYMENTS
  let deployments = getStorageData('deployments', INITIAL_DEPLOYMENTS);

  if (cleanUrl === '/deployments' && method === 'get') {
    return { success: true, data: deployments };
  }

  if (cleanUrl === '/deployments' && method === 'post') {
    const env = data.environment || 'QA';
    deployments = deployments.map((d) =>
      d.environment === env
        ? {
            ...d,
            version: data.version || 'v1.0.5',
            lastDeployedAt: new Date().toISOString(),
            status: 'HEALTHY',
          }
        : d
    );
    setStorageData('deployments', deployments);
    return { success: true, message: `Deployment to ${env} completed successfully` };
  }

  // 12. AI STUDIO
  if (cleanUrl === '/ai/assistants') {
    return { success: true, data: INITIAL_AI_ASSISTANTS };
  }

  if (cleanUrl.startsWith('/ai/suggestions/assistant')) {
    return { success: true, data: INITIAL_AI_SUGGESTIONS };
  }

  if (cleanUrl === '/ai/generate' && method === 'post') {
    const promptText = data.prompt || '';
    const type = data.type || 'USER_STORY';

    let resultText = '';
    if (type === 'USER_STORY') {
      resultText = `### 📋 Generated BDD User Story

**As an** Enterprise System User  
**I want to** ${promptText.slice(0, 80)}...  
**So that** business productivity and system integrity are optimized.

---

#### 🧪 Acceptance Criteria (Given / When / Then)

\`\`\`gherkin
Feature: ${promptText.slice(0, 40)}

  Scenario: Standard verified execution
    Given the user is authenticated with a valid enterprise role
    When the action is triggered with valid inputs
    Then the response must return within 200ms
    And an immutable audit event is persisted to the database.

  Scenario: Validation boundary check
    Given invalid or expired parameters
    When the operation is submitted
    Then a descriptive 400 Bad Request error is returned.
\`\`\`

#### 📐 Architecture Impact
- **Database**: Zero schema alteration required.
- **Security**: Method-level \`@PreAuthorize\` validation enforced.`;
    } else if (type === 'TEST_CASE') {
      resultText = `### 🧪 QA Test Case Matrix & Assertion Suite

**Target Requirement**: ${promptText}

| Test ID | Scenario | Input | Expected Assertion | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Happy Path Execution | Valid payload | \`status == 200 && success == true\` | **PASSED** |
| **TC-02** | Token Expiry Guard | Expired JWT | \`status == 401 && message contains 'Expired'\` | **PASSED** |
| **TC-03** | Boundary Validation | Empty string | \`status == 400 && fieldErrors present\` | **PASSED** |
| **TC-04** | Concurrent Mutation | Dual request | \`OptimisticLockingException handled\` | **PASSED** |`;
    } else if (type === 'SPRINT_RISK') {
      resultText = `### ⚠️ Sprint Delivery & Bottleneck Risk Assessment

**Evaluated Scope**: ${promptText}

#### 📊 Velocity & Capacity Analysis
- **Committed Story Points**: 36 SP
- **Team Velocity (Historical)**: 45 SP
- **Risk Level**: 🟢 **LOW RISK (Safe Delivery Buffer: +20%)**

#### 🔍 Identified Bottlenecks & Mitigations
1. **QA Verification Window**: Ensure pull requests merge $\\ge 48\\text{hrs}$ before sprint freeze.
2. **Database Migrations**: Zero DDL locks detected during initial rollout.`;
    } else {
      resultText = `### 🏛️ Static Code & Architecture Review

**Target**: ${promptText}

#### 1. Concurrency & Isolation
- Transactional boundary verified with \`Isolation.READ_COMMITTED\`.
- Optimistic locking verified via JPA \`@Version\` attribute.

#### 2. Pattern Adherence
- Clean repository-service separation adheres to SOLID architectural principles.`;
    }

    return {
      success: true,
      data: {
        id: Date.now(),
        suggestionType: type,
        prompt: promptText,
        suggestionText: resultText,
        createdAt: new Date().toISOString(),
      },
    };
  }

  // 13. ANALYTICS
  if (cleanUrl === '/analytics/overview') {
    return {
      success: true,
      data: {
        totalProjects: projects.length,
        activeTasks: tasks.filter((t) => t.status !== 'DONE').length,
        completedTasks: tasks.filter((t) => t.status === 'DONE').length,
        criticalBugs: bugs.filter((b) => b.severity === 'CRITICAL' && b.status !== 'CLOSED').length,
        sprintVelocity: 45,
        deploymentsCount: 14,
      },
    };
  }

  if (cleanUrl === '/analytics/dora') {
    return {
      success: true,
      data: {
        deploymentFrequency: '4.2 / day',
        deploymentFrequencyChange: '+18% vs last month',
        leadTimeForChanges: '1.8 hrs',
        leadTimeChange: '-24% faster',
        meanTimeToRecovery: '14 mins',
        mttrChange: '-35% faster MTTR',
        changeFailureRate: '0.4%',
        cfrChange: '-0.8% failure rate',
      },
    };
  }

  // 14. USERS & GOVERNANCE
  let users = getStorageData('users', DEMO_PERSONAS);

  if (cleanUrl === '/users' && method === 'get') {
    return { success: true, data: users };
  }

  if (cleanUrl.match(/^\/users\/\d+$/) && method === 'put') {
    const id = parseInt(cleanUrl.split('/')[2]);
    users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    setStorageData('users', users);
    return { success: true, message: 'User updated', data: data };
  }

  if (cleanUrl.match(/^\/users\/\d+$/) && method === 'delete') {
    const id = parseInt(cleanUrl.split('/')[2]);
    users = users.filter((u) => u.id !== id);
    setStorageData('users', users);
    return { success: true, message: 'User deleted' };
  }

  // Default Fallback
  return { success: true, data: [] };
};
