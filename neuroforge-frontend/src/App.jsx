import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/Auth/LoginPage';
import { RoleDashboardPage } from './pages/Dashboard/RoleDashboardPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { RequirementsPage } from './pages/Requirements/RequirementsPage';
import { SprintBoardPage } from './pages/Sprints/SprintBoardPage';
import { BacklogTasksPage } from './pages/Tasks/BacklogTasksPage';
import { DocumentationPage } from './pages/Documentation/DocumentationPage';
import { QaTestCenterPage } from './pages/QA/QaTestCenterPage';
import { BugTrackerPage } from './pages/Bugs/BugTrackerPage';
import { RepositoriesPage } from './pages/Repositories/RepositoriesPage';
import { CiCdConsolePage } from './pages/DevOps/CiCdConsolePage';
import { DeploymentsPage } from './pages/DevOps/DeploymentsPage';
import { AiStudioPage } from './pages/AI/AiStudioPage';
import { UserManagementPage } from './pages/Admin/UserManagementPage';
import { AuditLogsPage } from './pages/Admin/AuditLogsPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AccessDenied } from './components/common/AccessDenied';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing NeuroForge Security Session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleGuardedRoute = ({ allowedRoles, element }) => {
  const { role } = useAuth();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return element;
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<RoleDashboardPage />} />
              
              <Route
                path="projects"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'CLIENT'
                    ]}
                    element={<ProjectsPage />}
                  />
                }
              />

              <Route
                path="requirements"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'CLIENT'
                    ]}
                    element={<RequirementsPage />}
                  />
                }
              />

              <Route
                path="sprints/board"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
                    ]}
                    element={<SprintBoardPage />}
                  />
                }
              />

              <Route
                path="tasks/backlog"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER'
                    ]}
                    element={<BacklogTasksPage />}
                  />
                }
              />

              <Route
                path="documentation/adrs"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER', 'CLIENT'
                    ]}
                    element={<DocumentationPage />}
                  />
                }
              />

              <Route
                path="qa/test-suites"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'CLIENT'
                    ]}
                    element={<QaTestCenterPage />}
                  />
                }
              />

              <Route
                path="bugs"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
                    ]}
                    element={<BugTrackerPage />}
                  />
                }
              />

              <Route
                path="repositories"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
                    ]}
                    element={<RepositoriesPage />}
                  />
                }
              />

              <Route
                path="devops/pipelines"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
                    ]}
                    element={<CiCdConsolePage />}
                  />
                }
              />

              <Route
                path="devops/deployments"
                element={
                  <RoleGuardedRoute
                    allowedRoles={['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'DEVOPS_ENGINEER', 'CLIENT']}
                    element={<DeploymentsPage />}
                  />
                }
              />

              <Route
                path="ai-studio"
                element={
                  <RoleGuardedRoute
                    allowedRoles={[
                      'SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST',
                      'SOFTWARE_ARCHITECT', 'DEVELOPER', 'QA_ENGINEER', 'DEVOPS_ENGINEER'
                    ]}
                    element={<AiStudioPage />}
                  />
                }
              />

              <Route
                path="admin/users"
                element={
                  <RoleGuardedRoute
                    allowedRoles={['SYSTEM_ADMIN', 'PROJECT_MANAGER']}
                    element={<UserManagementPage />}
                  />
                }
              />

              <Route
                path="admin/audit-logs"
                element={
                  <RoleGuardedRoute
                    allowedRoles={['SYSTEM_ADMIN']}
                    element={<AuditLogsPage />}
                  />
                }
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
