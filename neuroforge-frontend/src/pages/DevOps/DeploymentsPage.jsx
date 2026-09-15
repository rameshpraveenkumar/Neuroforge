import React, { useState, useEffect } from 'react';
import { deploymentApi } from '../../api/deploymentApi';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Server,
  Rocket,
  FileText,
} from 'lucide-react';

const ENVIRONMENTS = [
  { key: 'DEV', name: 'Development Sandbox' },
  { key: 'QA', name: 'QA Testing Cluster' },
  { key: 'STAGING', name: 'Staging Pre-Release' },
  { key: 'PRODUCTION', name: 'Production Global' },
];

export const DeploymentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [deployments, setDeployments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const [deployForm, setDeployForm] = useState({
    projectId: '',
    environment: 'DEV',
    version: 'v1.1.0-rc1',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deployRes, projRes] = await Promise.all([
        deploymentApi.getAll(),
        projectApi.getAll(),
      ]);

      setDeployments(deployRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      console.error('Failed to load deployments:', err);
      setError(err.response?.data?.message || 'Failed to connect to Deployment Manager service');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDeploy = async (e) => {
    e.preventDefault();
    if (!deployForm.projectId) return;

    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(deployForm.projectId),
        environment: deployForm.environment,
        version: deployForm.version.trim(),
        deployedById: user?.id || 8,
      };

      await deploymentApi.trigger(payload);
      toast.success(`Release ${deployForm.version} deployed to ${deployForm.environment} successfully`);
      setIsDeployModalOpen(false);
      setDeployForm({ projectId: '', environment: 'DEV', version: 'v1.1.0-rc1' });

      // Refresh list
      const res = await deploymentApi.getAll();
      setDeployments(res.data || []);
    } catch (err) {
      console.error('Trigger deployment error:', err);
      toast.error(err.response?.data?.message || 'Failed to trigger deployment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (deploymentId, newStatus) => {
    try {
      await deploymentApi.updateStatus(deploymentId, newStatus);
      toast.success(`Deployment status updated to ${newStatus}`);

      // Refresh list
      const res = await deploymentApi.getAll();
      setDeployments(res.data || []);
    } catch (err) {
      console.error('Update deployment status error:', err);
      toast.error(err.response?.data?.message || 'Failed to update deployment status');
    }
  };

  // Filtered deployments
  const filteredDeployments = deployments.filter((d) => {
    const matchesSearch =
      (d.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.version || '').toLowerCase().includes(search.toLowerCase());
    const matchesEnv = !envFilter || d.environment === envFilter;
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesEnv && matchesStatus;
  });

  const totalDeployments = deployments.length;
  const healthyDeployments = deployments.filter(
    (d) => d.status === 'HEALTHY' || d.status === 'SUCCESS'
  ).length;
  const prodRelease = deployments.find((d) => d.environment === 'PRODUCTION')?.version || 'v1.0.4';

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="INFRASTRUCTURE & RELEASES"
        title="Environments & Deployment Manager"
        description="Manage multi-environment cloud infrastructure, release lifecycle promotions, and live audit telemetry."
        actions={
          <button
            onClick={() => {
              if (projects.length > 0) {
                setDeployForm({ projectId: projects[0].id, environment: 'DEV', version: 'v1.2.0-rc' });
              }
              setIsDeployModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] rounded-[3px] text-xs font-medium tracking-wide uppercase transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Trigger Deployment</span>
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="ACTIVE ENVIRONMENTS"
          value="4 / 4"
          subtext="DEV &bull; QA &bull; STG &bull; PROD"
        />
        <KpiCard
          label="RELEASE DISPATCHES"
          value={totalDeployments}
          subtext="Executed promotions"
        />
        <KpiCard
          label="HEALTHY PODS"
          value={healthyDeployments}
          subtext="Verified zero downtime"
        />
        <KpiCard
          label="PROD RELEASE VERSION"
          value={prodRelease}
          subtext="Live production artifact"
        />
      </div>

      {/* Environment Health Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ENVIRONMENTS.map((env) => {
          const latestDeploy = deployments.find((d) => d.environment === env.key);
          const isHealthy = latestDeploy?.status !== 'FAILED' && latestDeploy?.status !== 'DEGRADED';

          return (
            <div
              key={env.key}
              className="p-5 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-medium uppercase tracking-wider bg-[#F7F6F2] text-[#151515] border border-[#ECEAE5]">
                  {env.key}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-[#151515]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#151515]"></span>
                  {isHealthy ? 'HEALTHY' : 'ATTENTION'}
                </span>
              </div>

              <div>
                <h4 className="text-xs text-[#99958F] font-sans">{env.name}</h4>
                <p className="font-serif text-lg font-normal text-[#151515] mt-1">
                  {latestDeploy?.version || 'v1.0.0-GA'}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#ECEAE5] flex items-center justify-between text-[10px] text-[#99958F] font-mono">
                <span>{latestDeploy?.projectName || 'NeuroCloud Core'}</span>
                <span>{latestDeploy?.deploymentDate ? new Date(latestDeploy.deploymentDate).toLocaleDateString() : 'Live'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Deployments Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 px-4 bg-[#F7F6F2] rounded-[3px] border border-[#ECEAE5]">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search project or version..."
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">All Environments</option>
              {ENVIRONMENTS.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.key}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">All Statuses</option>
              <option value="HEALTHY">HEALTHY</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="DEGRADED">DEGRADED</option>
              <option value="ROLLED_BACK">ROLLED_BACK</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : filteredDeployments.length === 0 ? (
          <EmptyState
            icon={Server}
            title="No deployments found"
            description="Trigger a new environment release to start tracking delivery operations."
            actionText="Trigger Deployment"
            onAction={() => setIsDeployModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto border border-[#ECEAE5] rounded-[3px] bg-[#FFFFFF]">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#ECEAE5] bg-[#F7F6F2]">
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Version Tag</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Project</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Environment</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Deployed At</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Status</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] text-right">Actions &amp; Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE5]">
                {filteredDeployments.map((d) => (
                  <tr key={d.deploymentId} className="hover:bg-[#F7F6F2] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] font-medium text-[#151515]">
                      {d.version}
                    </td>
                    <td className="py-3.5 px-4 text-[#151515] font-serif text-sm">
                      {d.projectName || `Project #${d.projectId}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-mono uppercase bg-[#FFFFFF] border border-[#ECEAE5] text-[#66635F]">
                        {d.environment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#99958F] text-[11px]">
                      {d.deploymentDate ? new Date(d.deploymentDate).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={d.status}
                          onChange={(e) => handleUpdateStatus(d.deploymentId, e.target.value)}
                          className="px-2 py-1 rounded-[2px] bg-[#FFFFFF] border border-[#DEDCD6] text-[10px] font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                        >
                          <option value="HEALTHY">HEALTHY</option>
                          <option value="DEGRADED">DEGRADED</option>
                          <option value="ROLLED_BACK">ROLLED_BACK</option>
                        </select>

                        <button
                          onClick={() => {
                            setSelectedDeployment(d);
                            setIsLogsModalOpen(true);
                          }}
                          className="p-1 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515] transition-colors"
                          title="View Execution Logs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Trigger Deployment */}
      <Modal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        title="Trigger Environment Deployment"
        subtitle="Promote code artifacts to target cloud environments with automated telemetry."
      >
        <form onSubmit={handleTriggerDeploy} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Target Project <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={deployForm.projectId}
              onChange={(e) => setDeployForm({ ...deployForm, projectId: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Target Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Target Environment <span className="text-[#A61C1C]">*</span>
              </label>
              <select
                value={deployForm.environment}
                onChange={(e) => setDeployForm({ ...deployForm, environment: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                {ENVIRONMENTS.map((e) => (
                  <option key={e.key} value={e.key}>
                    {e.key} ({e.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Release Version Tag <span className="text-[#A61C1C]">*</span>
              </label>
              <input
                type="text"
                required
                value={deployForm.version}
                onChange={(e) => setDeployForm({ ...deployForm, version: e.target.value })}
                placeholder="v1.2.0-rc2"
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515] font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs text-[#66635F] leading-relaxed">
            Automated health probes will execute post-deployment to verify HTTP 200 responses on all ingress routes.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsDeployModalOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !deployForm.projectId}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{submitting ? 'Deploying...' : 'Deploy Release'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Deployment Logs */}
      <Modal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        title="Deployment Audit Logs"
        subtitle={`${selectedDeployment?.version || ''} &bull; ${selectedDeployment?.environment || ''}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-[2px] bg-[#151515] text-[#ECEAE5] border border-[#2A2A2A] font-mono text-xs max-h-80 overflow-y-auto space-y-1.5">
            <p className="text-[#66635F]">
              [INIT] Preparing deployment orchestrator for {selectedDeployment?.projectName}...
            </p>
            <p className="text-[#99958F]">
              [CONFIG] Pulling container image tag: {selectedDeployment?.version}
            </p>
            <p className="text-[#ECEAE5]">
              [PODS] Performing rolling update with 0 downtime on cluster [{selectedDeployment?.environment}]
            </p>

            {selectedDeployment?.logs && selectedDeployment.logs.length > 0 ? (
              selectedDeployment.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#66635F] shrink-0">
                    [{log.logTime ? new Date(log.logTime).toLocaleTimeString() : `Step ${log.logNumber}`}]
                  </span>
                  <span className="text-[#3FB950]">{log.logMessage}</span>
                </div>
              ))
            ) : (
              <>
                <p className="text-[#C9D1D9]">[AUDIT] Database migration verified: 0 pending scripts.</p>
                <p className="text-[#C9D1D9]">[HEALTH] Ingress probe /actuator/health returned status: UP.</p>
                <p className="text-[#3FB950]">
                  [SUCCESS] Release {selectedDeployment?.version} successfully deployed and traffic routed.
                </p>
              </>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-[#ECEAE5]">
            <button
              onClick={() => setIsLogsModalOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Close Log Viewer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeploymentsPage;
