import React, { useState, useEffect, useCallback } from 'react';
import { bugApi } from '../../api/bugApi';
import { testCaseApi } from '../../api/testCaseApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { KpiCard } from '../../components/common/KpiCard';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Bug,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

export const BugTrackerPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [bugs, setBugs] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    testCaseSelection: '',
    bugTitle: '',
    severity: 'MAJOR',
    status: 'NEW',
    assignedDeveloperId: '',
  });

  const canReport = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER', 'CLIENT'].includes(role);
  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER'].includes(role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bugRes, tcRes, userRes] = await Promise.all([
        bugApi.getAll(),
        testCaseApi.getAll(),
        userApi.getAll(),
      ]);

      if (bugRes.success) setBugs(bugRes.data || []);
      if (tcRes.success) setTestCases(tcRes.data || []);
      if (userRes.success) setUsers(userRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve bug tracker records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    const defaultTc = testCases.length > 0 ? `${testCases[0].taskId}-${testCases[0].testNumber}` : '';
    setFormData({
      testCaseSelection: defaultTc,
      bugTitle: '',
      severity: 'MAJOR',
      status: 'NEW',
      assignedDeveloperId: users.length > 0 ? users[0].id : '',
    });
    setIsCreateOpen(true);
  };

  const handleOpenDelete = (bug) => {
    setSelectedBug(bug);
    setIsDeleteOpen(true);
  };

  const handleStatusTransition = async (bug, newStatus) => {
    try {
      const res = await bugApi.updateStatus(
        bug.taskId,
        bug.testNumber,
        bug.bugNumber,
        newStatus,
        bug.assignedDeveloperId
      );
      if (res.success) {
        toast.success(`Defect status updated to ${newStatus}.`);
        setBugs((prev) =>
          prev.map((b) =>
            b.taskId === bug.taskId &&
            b.testNumber === bug.testNumber &&
            b.bugNumber === bug.bugNumber
              ? { ...b, status: newStatus }
              : b
          )
        );
      } else {
        toast.error(res.message || 'Status transition rejected');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bug status');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.testCaseSelection) {
      toast.error('Please associate the defect with a QA test case.');
      return;
    }
    setSubmitting(true);
    try {
      const [taskId, testNumber] = formData.testCaseSelection.split('-').map(Number);

      const payload = {
        taskId,
        testNumber,
        bugTitle: formData.bugTitle,
        severity: formData.severity,
        status: formData.status,
        assignedDeveloperId: formData.assignedDeveloperId
          ? Number(formData.assignedDeveloperId)
          : null,
      };

      const res = await bugApi.create(payload);
      if (res.success) {
        toast.success(`Defect "${formData.bugTitle}" logged successfully.`);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to report bug');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error reporting bug');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBug) return;
    setSubmitting(true);
    try {
      const res = await bugApi.delete(
        selectedBug.taskId,
        selectedBug.testNumber,
        selectedBug.bugNumber
      );
      if (res.success) {
        toast.success('Defect record removed.');
        setIsDeleteOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to delete bug');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting bug');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityBadgeClass = (s) => {
    switch (s?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-[#FFF0F0] text-[#A61C1C] border-[#F2D6D6]';
      case 'MAJOR':
        return 'bg-[#FFF8E6] text-[#8C6B10] border-[#F0E4BE]';
      default:
        return 'bg-[#F7F6F2] text-[#66635F] border-[#ECEAE5]';
    }
  };

  const filteredBugs = bugs.filter((b) => {
    if (!b) return false;
    const q = (searchQuery || '').toLowerCase();
    const title = (b.bugTitle || b.title || '').toLowerCase();
    const taskTitle = (b.taskTitle || '').toLowerCase();
    const devName = (b.assignedDeveloperName || '').toLowerCase();
    const desc = (b.description || '').toLowerCase();

    const matchesSearch =
      !q ||
      title.includes(q) ||
      taskTitle.includes(q) ||
      devName.includes(q) ||
      desc.includes(q);

    const matchesSeverity = severityFilter === 'ALL' || b.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalBugsCount = bugs.filter((b) => b.severity === 'CRITICAL').length;
  const inFixCount = bugs.filter((b) => b.status === 'IN_FIX').length;
  const verifiedCount = bugs.filter((b) => b.status === 'VERIFIED' || b.status === 'CLOSED').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="QUALITY ASSURANCE"
        title="Defect & Bug Tracker"
        description="Enterprise defect triage, severity classification, developer remediation workflows, and verification status."
        actions={
          canReport && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] rounded-[3px] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Defect</span>
            </button>
          )
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="TOTAL DEFECTS"
          value={bugs.length}
          subtext="Logged in tracker"
        />
        <KpiCard
          label="CRITICAL SEVERITY"
          value={criticalBugsCount}
          subtext="Requires immediate fix"
        />
        <KpiCard
          label="IN REMEDIATION"
          value={inFixCount}
          subtext="Active engineering work"
        />
        <KpiCard
          label="VERIFIED / CLOSED"
          value={verifiedCount}
          subtext="Resolution confirmed"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 px-4 bg-[#F7F6F2] rounded-[3px] border border-[#ECEAE5]">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search defects, tasks, or engineers..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-[#99958F]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="MAJOR">Major</option>
            <option value="MINOR">Minor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_FIX">In Fix</option>
            <option value="VERIFIED">Verified</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Defects Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredBugs.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No defects logged"
          description="Zero reported defects matching the selected criteria. All QA test cases are executing normally."
          actionText={canReport ? 'Report Defect' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="overflow-x-auto border border-[#ECEAE5] rounded-[3px] bg-[#FFFFFF]">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#ECEAE5] bg-[#F7F6F2]">
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">ID</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Defect Title &amp; Context</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Severity</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Status</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Assignee</th>
                <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE5]">
              {filteredBugs.map((bug) => (
                <tr
                  key={`${bug.taskId}-${bug.testNumber}-${bug.bugNumber}`}
                  className="hover:bg-[#F7F6F2] transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#66635F] whitespace-nowrap">
                    BUG-T{bug.taskId}-#{bug.bugNumber}
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <p className="font-serif text-sm font-normal text-[#151515] group-hover:text-[#000000] transition-colors">
                      {bug.bugTitle}
                    </p>
                    <p className="text-[11px] text-[#99958F] mt-1 truncate">
                      Task: <span className="text-[#66635F] font-mono">TASK-{bug.taskId} ({bug.taskTitle})</span> &bull;{' '}
                      Test: <span className="text-[#66635F] font-mono">{bug.testName}</span>
                    </p>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] border font-medium ${getSeverityBadgeClass(
                        bug.severity
                      )}`}
                    >
                      {bug.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {canMutate ? (
                      <select
                        value={bug.status}
                        onChange={(e) => handleStatusTransition(bug, e.target.value)}
                        className="px-2 py-1 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[2px] text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515] cursor-pointer"
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_FIX">IN_FIX</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    ) : (
                      <StatusBadge status={bug.status} />
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#F7F6F2] border border-[#DEDCD6] flex items-center justify-center font-mono text-[9px] text-[#66635F]">
                        {bug.assignedDeveloperName ? bug.assignedDeveloperName.slice(0, 2).toUpperCase() : '--'}
                      </div>
                      <span className="text-xs text-[#151515]">
                        {bug.assignedDeveloperName || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {canMutate && (
                      <button
                        onClick={() => handleOpenDelete(bug)}
                        className="p-1 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FFF0F0] transition-colors"
                        title="Delete Defect Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report Defect Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Report Software Defect"
        subtitle="Log an identified failure against a QA test case and assign for engineering remediation."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Associated QA Test Case <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={formData.testCaseSelection}
              onChange={(e) => setFormData({ ...formData, testCaseSelection: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Associated Test Case</option>
              {testCases.map((tc) => (
                <option key={`${tc.taskId}-${tc.testNumber}`} value={`${tc.taskId}-${tc.testNumber}`}>
                  TC-TASK#{tc.taskId}-T{tc.testNumber}: {tc.testName} (TASK-{tc.taskId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Defect Title / Anomaly Summary <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.bugTitle}
              onChange={(e) => setFormData({ ...formData, bugTitle: e.target.value })}
              placeholder="e.g. Race condition in Redis token bucket replenishment during high concurrency"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="MAJOR">MAJOR</option>
                <option value="MINOR">MINOR</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="NEW">NEW</option>
                <option value="IN_FIX">IN_FIX</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Assign Developer</label>
              <select
                value={formData.assignedDeveloperId}
                onChange={(e) => setFormData({ ...formData, assignedDeveloperId: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Reporting...' : 'Report Defect'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Defect Record"
        message={`Are you sure you want to permanently delete defect "${selectedBug?.bugTitle}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default BugTrackerPage;
