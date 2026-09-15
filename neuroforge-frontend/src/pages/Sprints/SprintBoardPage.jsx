import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { sprintApi } from '../../api/sprintApi';
import { taskApi } from '../../api/taskApi';
import { projectApi } from '../../api/projectApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  KanbanSquare,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User as UserIcon,
  Tag as TagIcon,
  CheckCircle2,
} from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do', badge: 'bg-[#F7F7F5] text-[#666666] border-[#E6E6E3]' },
  { id: 'IN_PROGRESS', title: 'In Progress', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'IN_REVIEW', title: 'In Review / QA', badge: 'bg-amber-50 text-[#C58A16] border-amber-200' },
  { id: 'DONE', title: 'Completed', badge: 'bg-emerald-50 text-[#2E9B62] border-emerald-200' },
];

export const SprintBoardPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [users, setUsers] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assignedUserId: '',
    dueDate: '',
    labels: '',
  });

  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'DEVELOPER', 'DEVOPS_ENGINEER', 'SOFTWARE_ARCHITECT', 'QA_ENGINEER'].includes(role);

  // Initial load: Projects & Users
  useEffect(() => {
    const initProjectsAndUsers = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          projectApi.getAll(),
          userApi.getAll(),
        ]);
        if (projRes.success && projRes.data?.length > 0) {
          setProjects(projRes.data);
          const firstProjId = projRes.data[0].projectId || projRes.data[0].id;
          setSelectedProjectId(firstProjId);
        }
        if (userRes.success) {
          setUsers(userRes.data || []);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    initProjectsAndUsers();
  }, []);

  // Load Sprints when Project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const loadSprints = async () => {
      try {
        const res = await sprintApi.getByProject(selectedProjectId);
        if (res.success && res.data) {
          setSprints(res.data);
          if (res.data.length > 0) {
            setSelectedSprintId(res.data[0].sprintId || res.data[0].id);
          } else {
            setSelectedSprintId('');
            setTasks([]);
          }
        }
      } catch (err) {
        console.error('Error fetching sprints:', err);
      }
    };
    loadSprints();
  }, [selectedProjectId]);

  // Load Tasks when Sprint changes
  const loadTasks = useCallback(async () => {
    if (!selectedSprintId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await taskApi.getBySprint(selectedSprintId);
      if (res.success) {
        setTasks(res.data || []);
      } else {
        setError(res.message || 'Failed to retrieve sprint tasks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load sprint tasks.');
    } finally {
      setLoading(false);
    }
  }, [selectedSprintId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Drag & Drop Handler
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId;
    const prevTasks = [...tasks];

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.taskId === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await taskApi.updateStatus(taskId, newStatus);
      if (res.success) {
        toast.success(`Task status updated to ${newStatus.replace(/_/g, ' ')}.`);
      } else {
        setTasks(prevTasks);
        toast.error(res.message || 'Status transition rejected by server.');
      }
    } catch (err) {
      setTasks(prevTasks);
      toast.error(err.response?.data?.message || 'Failed to transition task status.');
    }
  };

  const handleOpenCreateTask = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'TODO',
      assignedUserId: users.length > 0 ? users[0].id : '',
      dueDate: '',
      labels: '',
    });
    setIsCreateTaskOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'TODO',
      assignedUserId: task.assignedUserId || '',
      dueDate: task.dueDate || '',
      labels: (task.labels || []).join(', '),
    });
    setIsEditTaskOpen(true);
  };

  const handleOpenDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteTaskOpen(true);
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSprintId) {
      toast.error('Please select an active sprint first.');
      return;
    }
    setSubmitting(true);
    try {
      const labelArray = taskForm.labels
        ? taskForm.labels.split(',').map((l) => l.trim()).filter(Boolean)
        : [];

      const payload = {
        sprintId: Number(selectedSprintId),
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        status: taskForm.status,
        assignedUserId: taskForm.assignedUserId ? Number(taskForm.assignedUserId) : null,
        dueDate: taskForm.dueDate || null,
        labels: labelArray,
      };

      const res = await taskApi.create(payload);
      if (res.success) {
        toast.success(`Task "${taskForm.title}" created successfully.`);
        setIsCreateTaskOpen(false);
        loadTasks();
      } else {
        toast.error(res.message || 'Failed to create task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const labelArray = taskForm.labels
        ? taskForm.labels.split(',').map((l) => l.trim()).filter(Boolean)
        : [];

      const payload = {
        sprintId: Number(selectedSprintId),
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        status: taskForm.status,
        assignedUserId: taskForm.assignedUserId ? Number(taskForm.assignedUserId) : null,
        dueDate: taskForm.dueDate || null,
        labels: labelArray,
      };

      const res = await taskApi.update(selectedTask.taskId, payload);
      if (res.success) {
        toast.success('Task updated successfully.');
        setIsEditTaskOpen(false);
        loadTasks();
      } else {
        toast.error(res.message || 'Failed to update task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTaskConfirm = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const res = await taskApi.delete(selectedTask.taskId);
      if (res.success) {
        toast.success('Task removed from sprint.');
        setIsDeleteTaskOpen(false);
        loadTasks();
      } else {
        toast.error(res.message || 'Failed to delete task');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting task');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadgeColor = (p) => {
    switch (p?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-[#FCF2F2] text-[#A61C1C] border-[#F4D2D2]';
      case 'MEDIUM':
        return 'bg-[#FAF7F0] text-[#9E6A00] border-[#EFE3C8]';
      default:
        return 'bg-[#F4F4FA] text-[#4A47A3] border-[#DFDFF2]';
    }
  };

  const currentSprint = sprints.find((s) => (s.sprintId || s.id) === Number(selectedSprintId));
  const completedTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-10">
      <PageHeader
        category="Agile Execution"
        title="Sprint Kanban Board"
        description="Agile sprint execution workflow with live drag-and-drop state synchronization and engineer allocation."
        badge={`${tasks.length} Active Tasks`}
        action={
          canMutate && (
            <button
              onClick={handleOpenCreateTask}
              disabled={!selectedSprintId}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          )
        }
      />

      {/* Scope Selectors and Sprint Goals Banner */}
      <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] mb-1.5">System</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3.5 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515] min-w-[200px]"
              >
                {projects.map((p) => (
                  <option key={p.projectId || p.id} value={p.projectId || p.id}>
                    {p.projectName || p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] mb-1.5">Sprint Iteration</span>
              <select
                value={selectedSprintId}
                onChange={(e) => setSelectedSprintId(e.target.value)}
                className="px-3.5 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515] min-w-[200px]"
              >
                {sprints.length === 0 ? (
                  <option value="">No Sprints Available</option>
                ) : (
                  sprints.map((s) => (
                    <option key={s.sprintId || s.id} value={s.sprintId || s.id}>
                      {s.sprintName || s.name} ({s.status})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {currentSprint && (
            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Throughput</span>
                <p className="font-serif text-lg text-[#151515] font-normal">
                  {completedTasksCount} of {tasks.length} Completed ({progressPercent}%)
                </p>
              </div>
              <div className="w-20 h-1.5 rounded-full bg-[#ECEAE5] overflow-hidden">
                <div
                  className="h-full bg-[#151515] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Sprint Target Goals Chips */}
        {currentSprint?.goals && currentSprint.goals.length > 0 && (
          <div className="pt-4 border-t border-[#ECEAE5] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] uppercase tracking-wider font-medium text-[#99958F] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#151515]" />
              <span>Sprint Goals:</span>
            </span>
            {currentSprint.goals.map((g, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-[#151515] text-[11px] font-sans"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Kanban Board Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-96" rows={1} />
          <Skeleton className="h-96" rows={1} />
          <Skeleton className="h-96" rows={1} />
          <Skeleton className="h-96" rows={1} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadTasks} />
      ) : !selectedSprintId ? (
        <EmptyState
          icon={KanbanSquare}
          title="No Sprint Selected"
          description="Select a project and sprint from the top dropdowns to load the Kanban board."
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  className="rounded-[3px] border border-[#ECEAE5] bg-[#F7F6F2] p-4 flex flex-col min-h-[520px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ECEAE5]">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#151515]">
                      {col.title}
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[2px] bg-[#FFFFFF] text-[#66635F] border border-[#ECEAE5]">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-3 transition-colors rounded-[2px] p-0.5 ${
                          snapshot.isDraggingOver ? 'bg-[#FFFFFF]/60' : ''
                        }`}
                      >
                        {colTasks.map((task, index) => (
                          <Draggable
                            key={task.taskId}
                            draggableId={String(task.taskId)}
                            index={index}
                          >
                            {(providedDrag, snapshotDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                className={`p-4 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#DEDCD6] transition-all space-y-2.5 ${
                                  snapshotDrag.isDragging ? 'shadow-xl ring-1 ring-[#151515]' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-mono text-[9px] text-[#99958F] uppercase tracking-wider">
                                    TSK-{String(task.taskId).padStart(3, '0')}
                                  </span>
                                  <span
                                    className={`text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded-[2px] border ${getPriorityBadgeColor(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>

                                <h4 className="text-xs font-medium text-[#151515] leading-snug line-clamp-2">
                                  {task.title}
                                </h4>

                                {task.description && (
                                  <p className="text-[11px] text-[#66635F] line-clamp-2 leading-relaxed font-sans font-light">
                                    {task.description}
                                  </p>
                                )}

                                {task.labels && task.labels.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap">
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

                                <div className="pt-2.5 border-t border-[#ECEAE5] flex items-center justify-between text-[10px] text-[#99958F]">
                                  <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#151515] text-[#FFFFFF] flex items-center justify-center text-[8px] font-mono">
                                      {task.assignedUserName?.slice(0, 1) || 'U'}
                                    </span>
                                    <span className="truncate text-[#66635F]">{task.assignedUserName || 'Unassigned'}</span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {canMutate && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEditTask(task);
                                          }}
                                          className="p-1 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2]"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDeleteTask(task);
                                          }}
                                          className="p-1 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FCF2F2]"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        category="New Task"
        title="Create Sprint Task"
        subtitle={`Sprint: ${currentSprint?.sprintName || 'Current Sprint'}`}
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Task Title <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Implement Rate Limiter Service with Redis"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Description</label>
            <textarea
              rows={3}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Technical implementation steps, acceptance criteria..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Initial Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
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
                value={taskForm.assignedUserId}
                onChange={(e) => setTaskForm({ ...taskForm, assignedUserId: e.target.value })}
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
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Labels (comma-separated)</label>
              <input
                type="text"
                value={taskForm.labels}
                onChange={(e) => setTaskForm({ ...taskForm, labels: e.target.value })}
                placeholder="e.g. backend, security, api"
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
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
        isOpen={isEditTaskOpen}
        onClose={() => setIsEditTaskOpen(false)}
        category="Edit Task"
        title={`Edit Task TASK-${selectedTask?.taskId}`}
        subtitle="Update task specifications and assigned engineer."
      >
        <form onSubmit={handleEditTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Task Title <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Description</label>
            <textarea
              rows={3}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
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
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
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
                value={taskForm.assignedUserId}
                onChange={(e) => setTaskForm({ ...taskForm, assignedUserId: e.target.value })}
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
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Labels (comma-separated)</label>
              <input
                type="text"
                value={taskForm.labels}
                onChange={(e) => setTaskForm({ ...taskForm, labels: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsEditTaskOpen(false)}
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

      {/* Delete Task Dialog */}
      <ConfirmDialog
        isOpen={isDeleteTaskOpen}
        onClose={() => setIsDeleteTaskOpen(false)}
        onConfirm={handleDeleteTaskConfirm}
        title="Delete Task"
        message={`Are you sure you want to remove "${selectedTask?.title}" from the sprint backlog?`}
        confirmLabel="Delete Task"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default SprintBoardPage;

