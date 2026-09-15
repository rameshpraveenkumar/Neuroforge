export const NAVIGATION_SECTIONS = [
  {
    title: 'WORKSPACE',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        allowedRoles: [
          'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
          'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'CLIENT'
        ],
      },
      {
        name: 'Projects',
        path: '/projects',
        icon: 'FolderGit2',
        allowedRoles: [
          'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
          'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'CLIENT'
        ],
      },
      {
        name: 'Requirements',
        path: '/requirements',
        icon: 'FileText',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'SOFTWARE_ARCHITECT', 'CLIENT'],
      },
      {
        name: 'Backlog',
        path: '/tasks/backlog',
        icon: 'ListTodo',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER'],
      },
      {
        name: 'Sprint Board',
        path: '/sprints/board',
        icon: 'KanbanSquare',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'],
      },
    ],
  },
  {
    title: 'QUALITY',
    items: [
      {
        name: 'QA / Test Center',
        path: '/qa/test-suites',
        icon: 'CheckSquare',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'CLIENT'],
      },
      {
        name: 'Bug Tracker',
        path: '/bugs',
        icon: 'Bug',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'],
      },
    ],
  },
  {
    title: 'ENGINEERING',
    items: [
      {
        name: 'Repositories',
        path: '/repositories',
        icon: 'GitBranch',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'],
      },
      {
        name: 'Documentation',
        path: '/documentation/adrs',
        icon: 'Layers',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'CLIENT'],
      },
      {
        name: 'CI/CD Pipelines',
        path: '/devops/pipelines',
        icon: 'Workflow',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'],
      },
      {
        name: 'Deployments',
        path: '/devops/deployments',
        icon: 'Server',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'DEVOPS_ENGINEER', 'CLIENT'],
      },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      {
        name: 'AI Studio',
        path: '/ai-studio',
        icon: 'Sparkles',
        allowedRoles: [
          'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
          'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
        ],
      },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      {
        name: 'User Management',
        path: '/admin/users',
        icon: 'Users',
        allowedRoles: ['SYSTEM_ADMIN', 'PROJECT_MANAGER'],
      },
      {
        name: 'Audit Logs',
        path: '/admin/audit-logs',
        icon: 'ShieldAlert',
        allowedRoles: ['SYSTEM_ADMIN'],
      },
    ],
  },
];

export const NAVIGATION_ITEMS = NAVIGATION_SECTIONS.flatMap((s) => s.items);

export function getFilteredSections(role) {
  if (!role) return [];
  return NAVIGATION_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.allowedRoles.includes(role)),
  })).filter((section) => section.items.length > 0);
}

export function getFilteredNavigation(role) {
  if (!role) return [];
  return NAVIGATION_ITEMS.filter((item) => item.allowedRoles.includes(role));
}
