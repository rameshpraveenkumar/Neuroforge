import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { SearchInput } from '../../components/common/SearchInput';
import {
  Download,
  FileSpreadsheet,
} from 'lucide-react';

const STATIC_AUDIT_EVENTS = [
  {
    id: 'AUD-901',
    event: 'AUTH_LOGIN_SUCCESS',
    actor: 'admin (System Administrator)',
    resource: '/api/auth/login',
    status: 'SUCCESS',
    ip: '127.0.0.1 (Localhost)',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    details: 'JWT Bearer token issued with claims [ROLE_SYSTEM_ADMIN].',
  },
  {
    id: 'AUD-902',
    event: 'PERSONA_SWITCH_EXEC',
    actor: 'demo_developer (Developer)',
    resource: '/api/auth/demo-switch',
    status: 'SUCCESS',
    ip: '127.0.0.1 (Localhost)',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    details: 'Demo persona switch executed with granular RBAC permissions.',
  },
  {
    id: 'AUD-903',
    event: 'PIPELINE_RUN_TRIGGER',
    actor: 'demo_devops (DevOps Engineer)',
    resource: '/api/cicd/run/repository/1',
    status: 'SUCCESS',
    ip: '10.0.4.18',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    details: 'Simulated CI/CD 6-stage pipeline build executed for branch [main].',
  },
  {
    id: 'AUD-904',
    event: 'DEPLOYMENT_RELEASE_EXEC',
    actor: 'demo_devops (DevOps Engineer)',
    resource: '/api/deployments',
    status: 'SUCCESS',
    ip: '10.0.4.18',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    details: 'Target environment [PRODUCTION] updated to release v1.0.4 with 0 downtime.',
  },
  {
    id: 'AUD-905',
    event: 'TASK_STATUS_TRANSITION',
    actor: 'demo_pm (Project Manager)',
    resource: '/api/tasks/1/status?status=IN_PROGRESS',
    status: 'SUCCESS',
    ip: '192.168.1.102',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    details: 'Optimistic UI drag-and-drop state synchronized with database.',
  },
  {
    id: 'AUD-906',
    event: 'AI_SYNTHESIS_OFFLINE',
    actor: 'demo_architect (Software Architect)',
    resource: '/api/ai/generate',
    status: 'SUCCESS',
    ip: '192.168.1.108',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    details: 'Synthesized Architecture Review with offline heuristic inference provider.',
  },
];

export const AuditLogsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  const handleExport = (format) => {
    const dataStr =
      format === 'json'
        ? JSON.stringify(STATIC_AUDIT_EVENTS, null, 2)
        : 'Timestamp,Event,Actor,Resource,Status,IP,Details\n' +
          STATIC_AUDIT_EVENTS.map(
            (e) => `"${e.timestamp}","${e.event}","${e.actor}","${e.resource}","${e.status}","${e.ip}","${e.details}"`
          ).join('\n');

    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroforge-audit-log-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Audit trail exported as ${format.toUpperCase()}`);
  };

  const filteredLogs = STATIC_AUDIT_EVENTS.filter((log) => {
    if (!log) return false;
    const q = (search || '').toLowerCase();
    const matchesSearch =
      !q ||
      (log.event || '').toLowerCase().includes(q) ||
      (log.actor || '').toLowerCase().includes(q) ||
      (log.resource || '').toLowerCase().includes(q) ||
      (log.details || '').toLowerCase().includes(q);
    const matchesEvent = !eventFilter || log.event === eventFilter;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="GOVERNANCE & COMPLIANCE"
        title="Security Audit Logs & Governance"
        description="Immutable security audit trail capturing authentication events, deployment promotions, and privileged operations."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExport('json')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] text-xs font-medium text-[#151515] border border-[#DEDCD6] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#66635F]" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-xs font-medium tracking-wide uppercase text-white transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="SECURITY INTEGRITY"
          value="100%"
          subtext="Zero breaches detected"
        />
        <KpiCard
          label="RBAC POLICY"
          value="STRICT"
          subtext="Method-level @PreAuthorize"
        />
        <KpiCard
          label="AUDIT RETENTION"
          value="365 Days"
          subtext="Compliant with SOC2 / ISO"
        />
        <KpiCard
          label="ACTIVE SESSIONS"
          value="1 Local"
          subtext="Stateless JWT session"
        />
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 px-4 bg-[#F7F6F2] rounded-[3px] border border-[#ECEAE5]">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search actor, event, or details..."
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">All Event Categories</option>
              <option value="AUTH_LOGIN_SUCCESS">AUTH_LOGIN_SUCCESS</option>
              <option value="PERSONA_SWITCH_EXEC">PERSONA_SWITCH_EXEC</option>
              <option value="PIPELINE_RUN_TRIGGER">PIPELINE_RUN_TRIGGER</option>
              <option value="DEPLOYMENT_RELEASE_EXEC">DEPLOYMENT_RELEASE_EXEC</option>
              <option value="TASK_STATUS_TRANSITION">TASK_STATUS_TRANSITION</option>
              <option value="AI_SYNTHESIS_OFFLINE">AI_SYNTHESIS_OFFLINE</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#ECEAE5] rounded-[3px] bg-[#FFFFFF]">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#ECEAE5] bg-[#F7F6F2]">
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Event ID</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Action / Event</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Actor</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Resource</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Details</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Timestamp</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE5]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F6F2] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#151515] font-medium whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-medium bg-[#F7F6F2] text-[#151515] border border-[#ECEAE5]">
                      {log.event}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#151515] font-serif text-sm">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#66635F]">
                    {log.resource}
                  </td>
                  <td className="py-3.5 px-4 text-[#66635F] text-xs max-w-xs truncate font-sans">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-[#99958F] font-mono text-[10px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-medium bg-[#FFFFFF] border border-[#ECEAE5] text-[#151515]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
