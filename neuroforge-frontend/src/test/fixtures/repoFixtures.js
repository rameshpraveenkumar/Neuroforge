export const mockRepositories = [
  {
    repositoryId: 1,
    id: 1,
    projectId: 1,
    repoName: 'neuroforge-core',
    name: 'neuroforge-core',
    repoUrl: 'https://github.com/neuroforge/neuroforge-core.git',
    url: 'https://github.com/neuroforge/neuroforge-core.git',
    defaultBranch: 'main',
    branchesCount: 6,
    commitsCount: 142,
    lastCommitDate: '2026-03-12T14:30:00',
    description: 'Monolithic Spring Boot backend and React SPA workspace.',
  },
  {
    repositoryId: 2,
    id: 2,
    projectId: 2,
    repoName: 'neuroforge-infra',
    name: 'neuroforge-infra',
    repoUrl: 'https://github.com/neuroforge/neuroforge-infra.git',
    url: 'https://github.com/neuroforge/neuroforge-infra.git',
    defaultBranch: 'main',
    branchesCount: 3,
    commitsCount: 68,
    lastCommitDate: '2026-03-10T09:15:00',
    description: 'Terraform and Helm charts for enterprise deployment.',
  },
];

export const mockCommits = [
  {
    commitId: '03e5a93',
    commitHash: '03e5a93590f5eabe93cf7d01ef691bd209906a14',
    message: 'feat: add optional external LLM with offline fallback',
    commitMessage: 'feat: add optional external LLM with offline fallback',
    author: 'Ramesh Praveen Kumar',
    date: '2026-03-12T17:49:10',
    createdAt: '2026-03-12T17:49:10',
    branch: 'main',
  },
];
