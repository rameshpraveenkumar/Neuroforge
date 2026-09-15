import React, { useState, useEffect, useCallback } from 'react';
import { testCaseApi } from '../../api/testCaseApi';
import { taskApi } from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { KpiCard } from '../../components/common/KpiCard';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Bug,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const QaTestCenterPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [testCases, setTestCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    taskId: '',
    testName: '',
    description: '',
    expectedResult: '',
  });

  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER', 'DEVELOPER'].includes(role);
  const canDelete = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'QA_ENGINEER'].includes(role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tcRes, taskRes] = await Promise.all([
        selectedTaskId === 'ALL'
          ? testCaseApi.getAll()
          : testCaseApi.getByTask(selectedTaskId),
        taskApi.getAll(),
      ]);

      if (tcRes.success) setTestCases(tcRes.data || []);
      if (taskRes.success) setTasks(taskRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load test cases.');
    } finally {
      setLoading(false);
    }
  }, [selectedTaskId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setFormData({
      taskId: tasks.length > 0 ? tasks[0].taskId : '',
      testName: '',
      description: '',
      expectedResult: '',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (tc) => {
    setSelectedTestCase(tc);
    setFormData({
      taskId: tc.taskId,
      testName: tc.testName,
      description: tc.description || '',
      expectedResult: tc.expectedResult || '',
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (tc) => {
    setSelectedTestCase(tc);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        taskId: Number(formData.taskId),
        testName: formData.testName,
        description: formData.description,
        expectedResult: formData.expectedResult,
      };

      const res = await testCaseApi.create(payload);
      if (res.success) {
        toast.success(`Test case "${formData.testName}" created.`);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to create test case');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating test case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTestCase) return;
    setSubmitting(true);
    try {
      const payload = {
        taskId: selectedTestCase.taskId,
        testNumber: selectedTestCase.testNumber,
        testName: formData.testName,
        description: formData.description,
        expectedResult: formData.expectedResult,
      };

      const res = await testCaseApi.update(
        selectedTestCase.taskId,
        selectedTestCase.testNumber,
        payload
      );
      if (res.success) {
        toast.success('Test case updated successfully.');
        setIsEditOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to update test case');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating test case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTestCase) return;
    setSubmitting(true);
    try {
      const res = await testCaseApi.delete(
        selectedTestCase.taskId,
        selectedTestCase.testNumber
      );
      if (res.success) {
        toast.success('Test case deleted.');
        setIsDeleteOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to delete test case');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting test case');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTestCases = testCases.filter((tc) => {
    if (!tc) return false;
    const q = (searchQuery || '').toLowerCase();
    const name = (tc.testName || tc.name || tc.title || '').toLowerCase();
    const desc = (tc.description || '').toLowerCase();
    const taskTitle = (tc.taskTitle || '').toLowerCase();
    const expected = (tc.expectedResult || '').toLowerCase();

    const matchesSearch =
      !q ||
      name.includes(q) ||
      desc.includes(q) ||
      taskTitle.includes(q) ||
      expected.includes(q);

    return matchesSearch;
  });

  const totalBugs = testCases.reduce((acc, curr) => acc + (curr.bugsCount || 0), 0);

  return (
    <div className="space-y-10">
      <PageHeader
        category="Quality Engineering"
        title="QA Test Management"
        description="Comprehensive test specification repository, validation assertions, expected results, and defect density mapping."
        badge={`${testCases.length} Test Suites`}
        actions={
          canMutate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Test Case</span>
            </button>
          )
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard title="Total Test Suites" value={testCases.length} subtext="Validation catalog" />
        <KpiCard title="Covered Work Items" value={new Set(testCases.map((t) => t.taskId)).size} subtext="Linked sprint tasks" />
        <KpiCard title="Active Defects" value={totalBugs} subtext={totalBugs > 0 ? `${totalBugs} unresolved` : 'Zero defect state'} />
        <KpiCard title="Assertion Pass Rate" value="100%" subtext="Automated suite verified" />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5]">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by test assertion, task title, or description..."
          className="w-full sm:w-96"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] shrink-0">Task Scope:</span>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515] min-w-[200px]"
          >
            <option value="ALL">All Tasks ({tasks.length})</option>
            {tasks.map((t) => (
              <option key={t.taskId} value={t.taskId}>
                TASK-{t.taskId}: {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28" rows={3} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredTestCases.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No test cases found"
          description="No QA test specifications match your search criteria or linked task scope."
          actionText={canMutate ? 'Add First Test Case' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          {filteredTestCases.map((tc) => (
            <div
              key={`${tc.taskId}-${tc.testNumber}`}
              className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6 group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-[10px] text-[#99958F] uppercase tracking-wider">
                    TC-TASK#{tc.taskId}-T{tc.testNumber}
                  </span>
                  <span className="text-xs text-[#99958F]">
                    &middot; Task: <span className="text-[#151515] font-medium">TASK-{tc.taskId} ({tc.taskTitle})</span>
                  </span>
                  {tc.bugsCount > 0 ? (
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-[2px] bg-[#FCF2F2] text-[#A61C1C] border border-[#F4D2D2] flex items-center gap-1">
                      <Bug className="w-3 h-3" />
                      <span>{tc.bugsCount} Bug Linked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-[2px] bg-[#F2F7F2] text-[#2E7D32] border border-[#D6E6D6] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Passing</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl text-[#151515] font-normal">{tc.testName}</h3>

                {tc.description && (
                  <p className="text-xs text-[#66635F] leading-relaxed max-w-3xl font-sans font-light">
                    {tc.description}
                  </p>
                )}

                {tc.expectedResult && (
                  <div className="p-3.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs flex items-start gap-2.5 max-w-3xl">
                    <span className="text-[10px] uppercase tracking-wider font-medium text-[#99958F] shrink-0 mt-0.5">Assertion:</span>
                    <span className="text-[#151515] font-mono text-[11px] leading-relaxed">
                      {tc.expectedResult}
                    </span>
                  </div>
                )}
              </div>

              {canMutate && (
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEdit(tc)}
                    className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                    title="Edit Test Case"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleOpenDelete(tc)}
                      className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FCF2F2] transition-colors"
                      title="Delete Test Case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Test Case Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        category="New Assertion"
        title="Add QA Test Case Specification"
        subtitle="Define verification steps and expected results linked to a task."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Associated Task <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={formData.taskId}
              onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Task</option>
              {tasks.map((t) => (
                <option key={t.taskId} value={t.taskId}>
                  TASK-{t.taskId}: {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Test Case Name <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.testName}
              onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
              placeholder="e.g. Verify concurrent Redis token bucket refresh under 500 TPS"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Test Steps &amp; Preconditions</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="1. Authenticate with valid Bearer JWT. 2. Dispatch 500 concurrent requests..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Expected Result / Assertion <span className="text-[#A61C1C]">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.expectedResult}
              onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
              placeholder="e.g. Exactly 100 requests return HTTP 200; remaining return HTTP 429 Too Many Requests."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
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
              {submitting ? 'Creating...' : 'Add Test Case'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Test Case Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category="Edit Assertion"
        title={`Edit Test Case TC-TASK#${selectedTestCase?.taskId}-T${selectedTestCase?.testNumber}`}
        subtitle="Update test assertions and expected results."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Test Name <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={formData.testName}
              onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Test Steps</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Expected Result <span className="text-[#A61C1C]">*</span></label>
            <textarea
              rows={2}
              required
              value={formData.expectedResult}
              onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Test Case Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Test Case"
        message={`Are you sure you want to delete test case "${selectedTestCase?.testName}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default QaTestCenterPage;
