import React, { useState, useEffect } from 'react';
import { cicdApi } from '../../api/cicdApi';
import { repositoryApi } from '../../api/repositoryApi';
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
  Workflow,
  Play,
  CheckCircle2,
  Clock,
  Terminal,
  GitBranch,
  RotateCw,
  Cpu,
  ShieldCheck,
  Package,
  Server,
  FileCode,
} from 'lucide-react';

const STAGE_ICONS = {
  LINT: FileCode,
  BUILD: Cpu,
  TEST: CheckCircle2,
  SONAR: ShieldCheck,
  DOCKER: Package,
  DEPLOY: Server,
};

export const CiCdConsolePage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [history, setHistory] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggering, setTriggering] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [triggerForm, setTriggerForm] = useState({
    repositoryId: '',
    branch: 'main',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [histRes, repoRes] = await Promise.all([
        cicdApi.getHistory(),
        repositoryApi.getAll(),
      ]);

      const runs = histRes.data || [];
      setHistory(runs);
      setRepositories(repoRes.data || []);

      if (runs.length > 0 && !selectedRun) {
        setSelectedRun(runs[0]);
        if (runs[0].stages && runs[0].stages.length > 0) {
          setSelectedStage(runs[0].stages[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load CI/CD data:', err);
      setError(err.response?.data?.message || 'Failed to connect to CI/CD Pipeline Simulator');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRun = async (e) => {
    e.preventDefault();
    if (!triggerForm.repositoryId) return;

    setTriggering(true);
    try {
      const res = await cicdApi.triggerPipeline(
        Number(triggerForm.repositoryId),
        triggerForm.branch.trim() || 'main'
      );

      toast.success('CI/CD Pipeline run triggered successfully');
      setIsTriggerModalOpen(false);

      const refreshRes = await cicdApi.getHistory();
      const updatedRuns = refreshRes.data || [];
      setHistory(updatedRuns);

      if (res.data) {
        setSelectedRun(res.data);
        if (res.data.stages && res.data.stages.length > 0) {
          setSelectedStage(res.data.stages[0]);
        }
      }
    } catch (err) {
      console.error('Trigger pipeline error:', err);
      toast.error(err.response?.data?.message || 'Failed to execute pipeline run');
    } finally {
      setTriggering(false);
    }
  };

  // Filtered runs
  const filteredRuns = history.filter((run) => {
    const matchesSearch =
      (run.pipelineId || '').toLowerCase().includes(search.toLowerCase()) ||
      (run.repositoryName || '').toLowerCase().includes(search.toLowerCase()) ||
      (run.branch || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRuns = history.length;
  const successfulRuns = history.filter((r) => r.status === 'SUCCESS').length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 100;
  const avgDuration =
    totalRuns > 0
      ? Math.round(history.reduce((acc, r) => acc + (r.durationMs || 1200), 0) / totalRuns)
      : 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="DEVOPS & PIPELINES"
        title="CI/CD Pipelines Console"
        description="Simulated continuous integration & deployment execution engine and real-time runner log console."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              className="p-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515] transition-colors"
              title="Refresh Pipeline Runs"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (repositories.length > 0) {
                  setTriggerForm({ repositoryId: repositories[0].id, branch: repositories[0].defaultBranch || 'main' });
                }
                setIsTriggerModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] rounded-[3px] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Run Pipeline</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="TOTAL EXECUTIONS"
          value={totalRuns}
          subtext="Simulated CI/CD runs"
        />
        <KpiCard
          label="SUCCESS RATE"
          value={`${successRate}%`}
          subtext={`${successfulRuns} of ${totalRuns} passed`}
        />
        <KpiCard
          label="AVERAGE DURATION"
          value={`${avgDuration} ms`}
          subtext="P95 build runtime"
        />
        <KpiCard
          label="MONITORED REPOSITORIES"
          value={repositories.length}
          subtext="Configured build targets"
        />
      </div>

      {/* Main Execution View */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Pipeline Execution History List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                  PIPELINE RUNS ({filteredRuns.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Filter runs..."
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="RUNNING">Running</option>
                </select>
              </div>
            </div>

            {filteredRuns.length === 0 ? (
              <EmptyState
                icon={Workflow}
                title="No pipeline runs found"
                description="Trigger a simulated pipeline build to inspect execution logs."
                actionText="Run Pipeline"
                onAction={() => setIsTriggerModalOpen(true)}
              />
            ) : (
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredRuns.map((run) => {
                  const isSelected = selectedRun?.pipelineId === run.pipelineId;
                  return (
                    <div
                      key={run.pipelineId}
                      onClick={() => {
                        setSelectedRun(run);
                        if (run.stages && run.stages.length > 0) {
                          setSelectedStage(run.stages[0]);
                        }
                      }}
                      className={`p-4 rounded-[3px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F2] border-[#151515]'
                          : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6] hover:bg-[#F7F6F2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={run.status} />
                            <span className="font-mono text-xs font-semibold text-[#151515]">
                              #{run.pipelineId}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-normal text-[#151515] truncate mt-1.5">
                            {run.repositoryName || `Repo #${run.repositoryId}`}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-[#99958F]">
                            <span className="flex items-center gap-1 text-[#66635F]">
                              <GitBranch className="w-2.5 h-2.5" />
                              {run.branch || 'main'}
                            </span>
                            <span>&bull;</span>
                            <span>{run.commitHash ? run.commitHash.substring(0, 7) : 'HEAD'}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-xs font-mono">
                          <div className="flex items-center justify-end gap-1 text-[#151515] font-semibold text-[11px]">
                            <Clock className="w-3 h-3 text-[#99958F]" />
                            {run.durationMs || 1200} ms
                          </div>
                          <span className="text-[9px] uppercase tracking-wider text-[#99958F] block mt-1">
                            {run.startedAt ? new Date(run.startedAt).toLocaleTimeString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Visual 6-Stage Runner & Monospace Terminal Console */}
          <div className="lg:col-span-7 space-y-6">
            {selectedRun ? (
              <>
                {/* Pipeline Header Summary */}
                <div className="p-6 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <StatusBadge status={selectedRun.status} />
                        <h3 className="font-serif text-xl font-normal text-[#151515]">
                          Pipeline #{selectedRun.pipelineId}
                        </h3>
                      </div>
                      <p className="text-xs text-[#99958F] mt-1 font-sans">
                        Target: <span className="text-[#151515] font-medium">{selectedRun.repositoryName}</span> &bull; Branch:{' '}
                        <span className="text-[#66635F] font-mono">{selectedRun.branch}</span>
                      </p>
                    </div>

                    <div className="px-3 py-1.5 rounded-[2px] bg-[#FFFFFF] border border-[#DEDCD6] font-mono text-xs text-[#151515]">
                      Duration: <span className="font-semibold">{selectedRun.durationMs || 1200} ms</span>
                    </div>
                  </div>

                  {/* 6-Stage Visual Stepper */}
                  <div className="mt-5 pt-4 border-t border-[#ECEAE5]">
                    <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] block mb-3">
                      EXECUTION STAGES ({selectedRun.stages?.length || 6})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {(selectedRun.stages || [
                        { stageName: 'LINT', status: 'SUCCESS', durationMs: 140 },
                        { stageName: 'BUILD', status: 'SUCCESS', durationMs: 420 },
                        { stageName: 'TEST', status: 'SUCCESS', durationMs: 310 },
                        { stageName: 'SONAR', status: 'SUCCESS', durationMs: 190 },
                        { stageName: 'DOCKER', status: 'SUCCESS', durationMs: 280 },
                        { stageName: 'DEPLOY', status: 'SUCCESS', durationMs: 120 },
                      ]).map((stage) => {
                        const Icon = STAGE_ICONS[stage.stageName] || Cpu;
                        const isStageActive = selectedStage?.stageName === stage.stageName;

                        return (
                          <div
                            key={stage.stageName}
                            onClick={() => setSelectedStage(stage)}
                            className={`p-3 rounded-[3px] border text-center transition-colors cursor-pointer ${
                              isStageActive
                                ? 'bg-[#FFFFFF] border-[#151515]'
                                : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6]'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1.5">
                              <div className="w-6 h-6 rounded-full bg-[#F7F6F2] border border-[#ECEAE5] flex items-center justify-center text-[#151515]">
                                <Icon className="w-3 h-3" />
                              </div>
                            </div>
                            <p className="text-[10px] font-medium text-[#151515] uppercase font-mono">
                              {stage.stageName}
                            </p>
                            <p className="text-[9px] font-mono text-[#99958F] mt-0.5">
                              {stage.durationMs || 150}ms
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Monospace Terminal Console Viewer */}
                <div className="p-6 rounded-[3px] bg-[#151515] text-[#ECEAE5] border border-[#2A2A2A] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#99958F]" />
                      <span className="text-xs font-mono text-[#ECEAE5]">
                        Execution Logs &bull; Stage: {selectedStage?.stageName || 'BUILD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#99958F]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]"></span>
                      RUNNER READY
                    </div>
                  </div>

                  {/* Log Stream Output */}
                  <div className="p-4 rounded-[2px] bg-[#0E0E0E] border border-[#222222] font-mono text-xs leading-relaxed overflow-x-auto max-h-72 space-y-1">
                    <p className="text-[#66635F]">
                      [INFO] NeuroForge CI/CD Pipeline Simulator v2.4 initialized
                    </p>
                    <p className="text-[#99958F]">
                      [INFO] Repo: {selectedRun.repositoryName} | Commit: {selectedRun.commitHash || 'HEAD'}
                    </p>
                    <p className="text-[#ECEAE5] font-semibold">
                      [STAGE: {selectedStage?.stageName || 'BUILD'}] Starting stage execution...
                    </p>

                    {selectedStage?.logs && selectedStage.logs.length > 0 ? (
                      selectedStage.logs.map((logLine, idx) => (
                        <p
                          key={idx}
                          className={
                            logLine.includes('ERROR') || logLine.includes('FAIL')
                              ? 'text-[#F85149]'
                              : logLine.includes('SUCCESS') || logLine.includes('PASSED')
                              ? 'text-[#3FB950]'
                              : 'text-[#C9D1D9]'
                          }
                        >
                          {logLine}
                        </p>
                      ))
                    ) : (
                      <>
                        <p className="text-[#C9D1D9]">
                          [RUNNER] Compiling bytecode with Java 21 LTS toolchain...
                        </p>
                        <p className="text-[#C9D1D9]">
                          [RUNNER] Executing test suites (all unit and integration tests passed)
                        </p>
                        <p className="text-[#C9D1D9]">
                          [SONAR] Static code analysis: 0 vulnerabilities, 0 code smells.
                        </p>
                        <p className="text-[#C9D1D9]">
                          [DOCKER] Building image: registry.neuroforge.io/{selectedRun.repositoryName}:latest
                        </p>
                        <p className="text-[#3FB950]">
                          [SUCCESS] Stage {selectedStage?.stageName || 'BUILD'} completed in {selectedStage?.durationMs || 240}ms with exit code 0.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Workflow}
                title="Select a pipeline execution"
                description="Choose a run from the history on the left to inspect the 6-stage runner and live console output."
              />
            )}
          </div>
        </div>
      )}

      {/* Modal: Trigger Run */}
      <Modal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        title="Trigger CI/CD Pipeline Run"
        subtitle="Simulate continuous integration and deployment in an isolated environment."
      >
        <form onSubmit={handleTriggerRun} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Select Git Repository <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={triggerForm.repositoryId}
              onChange={(e) => setTriggerForm({ ...triggerForm, repositoryId: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Target Repository</option>
              {repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.repoName} ({r.projectName || `Project #${r.projectId}`})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Target Branch <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={triggerForm.branch}
              onChange={(e) => setTriggerForm({ ...triggerForm, branch: e.target.value })}
              placeholder="main"
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515] font-mono"
            />
          </div>

          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs text-[#66635F] leading-relaxed">
            Pipeline simulator safely validates all 6 stages (Lint, Compile, Test, Sonar, Container, Deploy) in an isolated execution sandbox.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsTriggerModalOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={triggering || !triggerForm.repositoryId}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{triggering ? 'Executing Pipeline...' : 'Start Pipeline'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CiCdConsolePage;
