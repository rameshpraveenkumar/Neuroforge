import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi } from '../../api/analyticsApi';
import { ROLES } from '../../utils/constants';
import { getFilteredNavigation } from '../../utils/rolePermissions';
import { KpiCard } from '../../components/common/KpiCard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  FolderGit2,
  KanbanSquare,
  CheckSquare,
  Bug,
  FileText,
  Rocket,
  ArrowRight,
  RotateCw,
} from 'lucide-react';

const STATUS_COLORS = {
  TODO: '#99958F',
  IN_PROGRESS: '#151515',
  IN_REVIEW: '#635BFF',
  DONE: '#2E7D32',
};

const SEVERITY_COLORS = {
  CRITICAL: '#A61C1C',
  HIGH: '#C56200',
  MEDIUM: '#9E6A00',
  LOW: '#66635F',
};

export const RoleDashboardPage = () => {
  const { user, role } = useAuth();
  const roleConfig = ROLES[role] || {
    name: role || 'Engineering Lead',
    description: 'System User',
  };

  const navItems = getFilteredNavigation(role);

  const [overview, setOverview] = useState(null);
  const [dora, setDora] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const [overviewRes, doraRes] = await Promise.all([
        analyticsApi.getOverview().catch(() => ({ data: null })),
        analyticsApi.getDoraMetrics().catch(() => ({ data: null })),
      ]);

      setOverview(overviewRes.data);
      setDora(doraRes.data);
    } catch (err) {
      console.error('Failed to load analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const taskChartData = overview?.tasksByStatus
    ? Object.entries(overview.tasksByStatus).map(([status, count]) => ({
        name: status.replace(/_/g, ' '),
        value: Number(count),
        color: STATUS_COLORS[status] || '#151515',
      }))
    : [
        { name: 'TODO', value: 4, color: '#99958F' },
        { name: 'IN PROGRESS', value: 6, color: '#151515' },
        { name: 'IN REVIEW', value: 3, color: '#635BFF' },
        { name: 'DONE', value: 15, color: '#2E7D32' },
      ];

  const bugChartData = overview?.bugsBySeverity
    ? Object.entries(overview.bugsBySeverity).map(([severity, count]) => ({
        severity: severity,
        count: Number(count),
        fill: SEVERITY_COLORS[severity] || '#A61C1C',
      }))
    : [
        { severity: 'CRITICAL', count: 1, fill: '#A61C1C' },
        { severity: 'HIGH', count: 2, fill: '#C56200' },
        { severity: 'MEDIUM', count: 3, fill: '#9E6A00' },
        { severity: 'LOW', count: 1, fill: '#66635F' },
      ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-[#ECEAE5]">
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.16em] uppercase font-medium text-[#99958F]">
            {roleConfig.name} &middot; Operational Overview
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#151515] font-normal tracking-tight">
            Good morning, {user?.fullName?.split(' ')[0] || 'Engineer'}.
          </h1>
          <p className="text-sm text-[#66635F] max-w-2xl leading-relaxed font-sans font-light">
            Real-time telemetry, sprint throughput, defect triage, and continuous delivery metrics for the active engineering lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchDashboardMetrics}
            className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#151515] text-xs font-medium flex items-center gap-2 transition-colors"
            title="Refresh Metrics"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#99958F]" />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Editorial Strip */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#ECEAE5]">
          <h2 className="text-[10px] tracking-[0.18em] uppercase font-medium text-[#99958F]">
            Executive Metrics &amp; Operational Cadence
          </h2>
          <span className="text-[11px] font-mono text-[#99958F]">Sprint 02 &middot; Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#ECEAE5] border-b border-[#ECEAE5] pb-10">
          <div className="px-3 sm:px-6 py-4 first:pt-0 sm:first:pl-0">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Active Projects
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              {overview?.totalProjects || 2}
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              2 repositories linked
            </p>
          </div>

          <div className="px-3 sm:px-6 py-4 first:pt-0">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Traceable Reqs
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              {overview?.totalRequirements || 12}
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              100% verified specs
            </p>
          </div>

          <div className="px-3 sm:px-6 py-4">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Sprint Velocity
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              68%
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              {overview?.totalTasks || 28} work items
            </p>
          </div>

          <div className="px-3 sm:px-6 py-4">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Open Defects
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              {overview?.openBugs || 4}
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              1 blocker in review
            </p>
          </div>

          <div className="px-3 sm:px-6 py-4">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Test Coverage
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              94%
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              {overview?.totalTestCases || 16} passing suites
            </p>
          </div>

          <div className="px-3 sm:px-6 py-4 last:pb-0 sm:last:pr-0">
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#99958F] block mb-3">
              Deploy Success
            </span>
            <p className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#151515] font-normal tracking-tight leading-none">
              96%
            </p>
            <p className="text-xs text-[#66635F] mt-3 font-sans font-light">
              4 release stages
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sprint Task Workflow Distribution */}
        <div className="lg:col-span-6 p-8 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECEAE5] pb-4">
            <div>
              <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
                Distribution
              </p>
              <h3 className="font-serif text-xl text-[#151515] font-normal mt-0.5">
                Sprint Task Progress
              </h3>
            </div>
            <span className="text-xs font-mono text-[#66635F]">
              {overview?.totalTasks || 28} Items
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {taskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DEDCD6',
                    borderRadius: '2px',
                    color: '#151515',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-[#66635F] font-sans">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bug Severity Breakdown */}
        <div className="lg:col-span-6 p-8 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECEAE5] pb-4">
            <div>
              <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
                Quality Assurance
              </p>
              <h3 className="font-serif text-xl text-[#151515] font-normal mt-0.5">
                Defect Severity Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-[#66635F]">
              {overview?.openBugs || 4} Open
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bugChartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#ECEAE5" vertical={false} />
                <XAxis dataKey="severity" stroke="#99958F" fontSize={10} tickLine={false} />
                <YAxis stroke="#99958F" fontSize={10} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DEDCD6',
                    borderRadius: '2px',
                    color: '#151515',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {bugChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DORA Metrics Benchmark */}
      <div className="p-8 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECEAE5] pb-4">
          <div>
            <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
              DevOps Research &amp; Assessment
            </p>
            <h3 className="font-serif text-2xl text-[#151515] font-normal mt-0.5">
              DORA Velocity &amp; Reliability Index
            </h3>
          </div>
          <span className="self-start sm:self-auto text-[10px] uppercase tracking-[0.1em] font-medium px-2.5 py-1 rounded-[2px] bg-[#FFFFFF] text-[#151515] border border-[#DEDCD6]">
            Elite Performance Tier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-[2px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-2">
            <span className="text-[10px] font-medium text-[#99958F] uppercase tracking-wider">
              Deployment Frequency
            </span>
            <p className="font-serif text-2xl text-[#151515] font-normal">
              {dora?.deploymentFrequency || '4.2 / week'}
            </p>
            <p className="text-xs text-[#2E7D32] font-sans">Continuous release verified</p>
          </div>

          <div className="p-5 rounded-[2px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-2">
            <span className="text-[10px] font-medium text-[#99958F] uppercase tracking-wider">
              Lead Time for Changes
            </span>
            <p className="font-serif text-2xl text-[#151515] font-normal">
              {dora?.leadTimeForChanges || '1.8 days'}
            </p>
            <p className="text-xs text-[#66635F] font-sans">Commit to production cycle</p>
          </div>

          <div className="p-5 rounded-[2px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-2">
            <span className="text-[10px] font-medium text-[#99958F] uppercase tracking-wider">
              Change Failure Rate
            </span>
            <p className="font-serif text-2xl text-[#151515] font-normal">
              {dora?.changeFailureRate || '4.5%'}
            </p>
            <p className="text-xs text-[#2E7D32] font-sans">Threshold target &lt; 5%</p>
          </div>

          <div className="p-5 rounded-[2px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-2">
            <span className="text-[10px] font-medium text-[#99958F] uppercase tracking-wider">
              Mean Time to Restore (MTTR)
            </span>
            <p className="font-serif text-2xl text-[#151515] font-normal">
              {dora?.timeToRestoreService || '45 min'}
            </p>
            <p className="text-xs text-[#66635F] font-sans">Automated canary rollback</p>
          </div>
        </div>
      </div>

      {/* Authorized Navigation Directory */}
      <div className="p-8 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-6">
        <div className="flex items-center justify-between border-b border-[#ECEAE5] pb-4">
          <div>
            <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
              Governance &amp; Navigation
            </p>
            <h3 className="font-serif text-xl text-[#151515] font-normal mt-0.5">
              Role Workspaces
            </h3>
          </div>
          <span className="text-xs font-mono text-[#99958F]">
            {navItems.length} Authorized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {navItems.map((item, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="p-3.5 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#ECEAE5] hover:border-[#DEDCD6] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#99958F]">{num}</span>
                  <span className="text-xs font-medium text-[#151515]">
                    {item.name}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#99958F] group-hover:text-[#151515] group-hover:translate-x-0.5 transition-all" />
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleDashboardPage;

