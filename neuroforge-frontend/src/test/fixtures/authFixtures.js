export const mockPersonas = [
  { role: 'SYSTEM_ADMIN', fullName: 'Alexander Vance', email: 'admin@neuroforge.io', username: 'admin' },
  { role: 'PROJECT_MANAGER', fullName: 'Sarah Jenkins', email: 'pm@neuroforge.io', username: 'pm' },
  { role: 'PRODUCT_OWNER', fullName: 'Elena Rostova', email: 'po@neuroforge.io', username: 'po' },
  { role: 'BUSINESS_ANALYST', fullName: 'David Kim', email: 'ba@neuroforge.io', username: 'ba' },
  { role: 'SOFTWARE_ARCHITECT', fullName: 'Marcus Brody', email: 'architect@neuroforge.io', username: 'architect' },
  { role: 'DEVELOPER', fullName: 'Lucas Thorne', email: 'dev@neuroforge.io', username: 'dev' },
  { role: 'QA_ENGINEER', fullName: 'Priya Sharma', email: 'qa@neuroforge.io', username: 'qa' },
  { role: 'DEVOPS_ENGINEER', fullName: 'Kasper Lindqvist', email: 'devops@neuroforge.io', username: 'devops' },
  { role: 'CLIENT', fullName: 'Victoria Sterling', email: 'client@neuroforge.io', username: 'client' },
];

export const mockAuthSuccessResponse = {
  success: true,
  message: 'Authentication successful',
  data: {
    accessToken: 'mock-valid-jwt-token-12345',
    tokenType: 'Bearer',
    userId: 1,
    id: 1,
    username: 'admin',
    email: 'admin@neuroforge.io',
    fullName: 'Alexander Vance',
    role: 'SYSTEM_ADMIN',
    roleDisplayName: 'System Administrator',
  },
};
