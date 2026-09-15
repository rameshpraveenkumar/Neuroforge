import React, { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../../api/taskApi';
import { sprintApi } from '../../api/sprintApi';
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
  ListTodo,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Filter,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';

export const BacklogTasksPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sprintFilter, setSprintFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sprintId: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assignedUserId: '',
    dueDate: '',
    labels: '',
  });

  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'DEVELOPER', 'DEVOPS_ENGINEER', 'SOFTWARE_ARCHITECT', 'QA_ENGINEER'].includes(role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskRes, sprintRes, userRes] = await Promise.all([
        taskApi.getAll(),
        sprintApi.getAll(),
        userApi.getAll(),
      ]);

      if (taskRes.success) setTasks(taskRes.data || []);
      if (sprintRes.success) setSprints(sprintRes.data || []);
      if (userRes.success) setUsers(userRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task backlog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setFormData({
      sprintId: sprints.length > 0 ? sprints[0].sprintId : '',
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      assignedUserId: users.length > 0 ? users[0].id : '',
      dueDate: '',
      labels: '',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      sprintId: task.sprintId,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'TODO',
      assignedUserId: task.assignedUserId || '',
      dueDate: task.dueDate || '',
      labels: (task.labels || []).join(', '),
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleInlineStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskApi.updateStatus(taskId, newStatus);
      if (res.success) {
        toast.success(`Task status updated to ${newStatus}.`);
        setTasks((prev) =>
          prev.map((t) => (t.taskId === taskId ? { ...t, status: newStatus } : t))
        );
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status transition error');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const labelArray = formData.labels
        ? formData.labels.split(',').map((l) => l.trim()).filter(Boolean)
        : [];

      const payload = {
        sprintId: Number(formData.sprintId),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : null,
        dueDate: formData.dueDate || null,
        labels: labelArray,
      };

      const res = await taskApi.create(payload);
      if (res.success) {
        toast.success(`Task "${formData.title}" created successfully.`);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to create task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const labelArray = formData.labels
        ? formData.labels.split(',').map((l) => l.trim()).filter(Boolean)
        : [];

      const payload = {
        sprintId: Number(formData.sprintId),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : null,
        dueDate: formData.dueDate || null,
        labels: labelArray,
      };

      const res = await taskApi.update(selectedTask.taskId, payload);
      if (res.success) {
        toast.success('Task updated successfully.');
        setIsEditOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to update task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const res = await taskApi.delete(selectedTask.taskId);
      if (res.success) {
        toast.success('Task deleted successfully.');
        setIsDeleteOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to delete task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting task');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadgeClass = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-[#FCF2F2] text-[#A61C1C] border-[#F4D2D2]';
      case 'HIGH':
        return 'bg-[#FAF7F0] text-[#9E6A00] border-[#EFE3C8]';
      case 'MEDIUM':
        return 'bg-[#F4F4FA] text-[#4A47A3] border-[#DFDFF2]';
      default:
        return 'bg-[#F7F6F2] text-[#66635F] border-[#ECEAE5]';
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!t) return false;
    const q = (searchQuery || '').toLowerCase();
    const title = (t.title || t.taskTitle || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const user = (t.assignedUserName || '').toLowerCase();

    const matchesSearch = !q || title.includes(q) || desc.includes(q) || user.includes(q);

    const matchesSprint = sprintFilter === 'ALL' || t.sprintId === Number(sprintFilter);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesSprint && matchesStatus && matchesPriority;
  });

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReviewCount = tasks.filter((t) => t.status === 'IN_REVIEW').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="space-y-10">
      <PageHeader
        category="Work Management"
        title="Backlog &amp; Tasks Directory"
        description="Comprehensive enterprise task catalog, sprint associations, engineer assignments, and QA test links."
        badge={`${tasks.length} Total Items`}
        actions={
          canMutate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          )
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard title="To Do" value={todoCount} subtext="Pending intake" />
        <KpiCard title="In Progress" value={inProgressCount} subtext="Active execution" />
        <KpiCard title="In Review" value={inReviewCount} subtext="QA verification" />
        <KpiCard title="Completed" value={doneCount} subtext="Merged to branch" />
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5]">
        <div className="sm:col-span-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, description, or engineer..."
            className="w-full"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={sprintFilter}
            onChange={(e) => setSprintFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Sprints ({sprints.length})</option>
            {sprints.map((s) => (
              <option key={s.sprintId} value={s.sprintId}>
                {s.sprintName}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Completed</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-14" rows={4} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="No tasks match the active filters."
          actionText={canMutate ? 'Create First Task' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="overflow-x-auto rounded-[3px] border border-[#ECEAE5] bg-[#FFFFFF]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#ECEAE5] bg-[#FAFAF8] text-[#99958F] font-medium uppercase text-[10px] tracking-[0.14em]">
                <th className="p-4">ID</th>
                <th className="p-4">Title &amp; Sprint</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Tests</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE5]">
              {filteredTasks.map((task) => (
                <tr
                  key={task.taskId}
                  className="hover:bg-[#F7F6F2] transition-colors group"
                >
                  <td className="p-4 font-mono text-[11px] text-[#99958F] whitespace-nowrap">
                    TSK-{String(task.taskId).padStart(3, '0')}
                  </td>

                  <td className="p-4 max-w-sm">
                    <p className="font-medium text-[#151515] line-clamp-1">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#99958F]">
                      <span className="font-mono text-[10px]">[{task.sprintName || 'Sprint'}]</span>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex items-center gap-1">
                          {task.labels.map((lbl, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-[#66635F] font-mono"
                            >
                              #{lbl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-[2px] border ${getPriorityBadgeClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {canMutate ? (
                      <select
                        value={task.status}
                        onChange={(e) => handleInlineStatusChange(task.taskId, e.target.value)}
                        className="px-2 py-1 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[2px] text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515] cursor-pointer"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Completed</option>
                      </select>
                    ) : (
                      <StatusBadge status={task.status} />
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#151515] text-[#FFFFFF] flex items-center justify-center font-mono text-[9px]">
                        {task.assignedUserName ? task.assignedUserName.slice(0, 1).toUpperCase() : '?'}
                      </span>
                      <span className="text-xs text-[#151515] font-sans">
                        {task.assignedUserName || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap font-mono text-[#66635F]">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-[10px]">
                      <CheckSquare className="w-3 h-3 text-[#99958F]" />
                      <span>{task.testCasesCount ?? 0}</span>
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    {canMutate && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(task)}
                          className="p-1 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FCF2F2] transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        category="New Task"
        title="Create Task Item"
        subtitle="Add a new requirement or engineering task to a sprint."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Target Sprint <span className="text-[#A61C1C]">*</span></label>
            <select
              required
              value={formData.sprintId}
              onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Sprint</option>
              {sprints.map((s) => (
                <option key={s.sprintId} value={s.sprintId}>
                  {s.sprintName} ({s.projectName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Task Title <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Task Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Technical instructions and acceptance criteria..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Assignee</label>
              <select
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Labels (comma-separated)</label>
              <input
                type="text"
                value={formData.labels}
                onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                placeholder="e.g. auth, security, jwt"
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
              />
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
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category="Edit Task"
        title={`Edit Task TASK-${selectedTask?.taskId}`}
        subtitle="Modify task description, status, or assignee."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Target Sprint</label>
            <select
              required
              value={formData.sprintId}
              onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              {sprints.map((s) => (
                <option key={s.sprintId} value={s.sprintId}>
                  {s.sprintName} ({s.projectName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Task Title <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Assignee</label>
              <select
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Labels (comma-separated)</label>
              <input
                type="text"
                value={formData.labels}
                onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to permanently delete task "${selectedTask?.title}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default BacklogTasksPage;
