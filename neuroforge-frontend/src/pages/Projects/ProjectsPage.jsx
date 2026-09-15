import React, { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  GitBranch,
  User as UserIcon,
} from 'lucide-react';

export const ProjectsPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    technologies: '',
    repositoryName: '',
  });

  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER'].includes(role);
  const canDelete = role === 'SYSTEM_ADMIN';

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectApi.getAll();
      if (res.success) {
        setProjects(res.data || []);
      } else {
        setError(res.message || 'Failed to retrieve projects');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not connect to project services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleOpenCreate = () => {
    setFormData({
      projectName: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'ACTIVE',
      technologies: '',
      repositoryName: '',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      projectName: project.projectName || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      status: project.status || 'ACTIVE',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : (typeof project.technologies === 'string' ? project.technologies : ''),
      repositoryName: project.repositoryName || '',
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const techArray = formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        projectName: formData.projectName,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: formData.status,
        technologies: techArray,
        repositoryName: formData.repositoryName || null,
      };

      const res = await projectApi.create(payload);
      if (res.success) {
        toast.success(`Project "${formData.projectName}" created successfully.`);
        setIsCreateOpen(false);
        loadProjects();
      } else {
        toast.error(res.message || 'Failed to create project');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      const techArray = formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        projectName: formData.projectName,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: formData.status,
        technologies: techArray,
        repositoryName: formData.repositoryName || null,
      };

      const res = await projectApi.update(selectedProject.projectId, payload);
      if (res.success) {
        toast.success(`Project updated successfully.`);
        setIsEditOpen(false);
        loadProjects();
      } else {
        toast.error(res.message || 'Failed to update project');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      const res = await projectApi.delete(selectedProject.projectId);
      if (res.success) {
        toast.success(`Project deleted.`);
        setIsDeleteOpen(false);
        loadProjects();
      } else {
        toast.error(res.message || 'Failed to delete project');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!p) return false;
    const query = (searchQuery || '').toLowerCase();
    const name = (p.projectName || p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    let techMatches = false;
    if (Array.isArray(p.technologies)) {
      techMatches = p.technologies.some((t) => (t ? String(t).toLowerCase().includes(query) : false));
    } else if (typeof p.technologies === 'string') {
      techMatches = p.technologies.toLowerCase().includes(query);
    }

    const matchesSearch = !query || name.includes(query) || desc.includes(query) || techMatches;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <PageHeader
        category="Portfolio &amp; Workspaces"
        title="Enterprise Systems"
        description="Software architecture initiatives, repository linkages, technology stacks, and team allocations."
        badge={`${projects.length} Total Systems`}
        action={
          canMutate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5]">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by name, tech stack, or description..."
          className="w-full sm:w-96"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PLANNED">Planned</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-56" rows={1} />
          <Skeleton className="h-56" rows={1} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadProjects} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'ALL'
              ? 'No projects match your current filter criteria.'
              : 'No enterprise projects are registered in the system yet.'
          }
          actionLabel={canMutate ? 'Create First Project' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={project.projectId}
                className="p-8 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="font-mono text-[10px] text-[#99958F] tracking-widest uppercase">
                        {num} &middot; SYS-{project.projectId}
                      </span>
                      <h3 className="font-serif text-2xl text-[#151515] font-normal mt-1 group-hover:text-[#151515]">
                        {project.projectName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} />
                      {canMutate && (
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleOpenDelete(project)}
                          className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FCF2F2] transition-colors"
                          title="Delete Project (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#66635F] line-clamp-2 leading-relaxed font-sans font-light mb-6">
                    {project.description || 'No description provided for this project.'}
                  </p>

                  {/* Technologies */}
                  {Boolean(project.technologies) && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : typeof project.technologies === 'string'
                        ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                        : []
                      ).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-[#66635F] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Metrics */}
                <div className="pt-6 border-t border-[#ECEAE5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-[2px] bg-[#FAFAF8] border border-[#ECEAE5]">
                    <p className="text-[9px] uppercase tracking-wider font-medium text-[#99958F]">Requirements</p>
                    <p className="font-serif text-lg text-[#151515] font-normal">{project.requirementsCount ?? 0}</p>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-[#FAFAF8] border border-[#ECEAE5]">
                    <p className="text-[9px] uppercase tracking-wider font-medium text-[#99958F]">Sprints</p>
                    <p className="font-serif text-lg text-[#151515] font-normal">{project.sprintsCount ?? 0}</p>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-[#FAFAF8] border border-[#ECEAE5]">
                    <p className="text-[9px] uppercase tracking-wider font-medium text-[#99958F]">Tasks</p>
                    <p className="font-serif text-lg text-[#151515] font-normal">{project.tasksCount ?? 0}</p>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-[#FAFAF8] border border-[#ECEAE5]">
                    <p className="text-[9px] uppercase tracking-wider font-medium text-[#99958F]">Lead</p>
                    <p className="text-xs font-medium text-[#151515] truncate mt-0.5">
                      {project.managerName || 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        category="New Entity"
        title="Create New Project"
        subtitle="Register an enterprise software system with technology stack and repository linkages."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Project Name <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="e.g. NeuroCloud Core Engine"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe project objectives and scope..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Target End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PLANNED">PLANNED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Git Repository Name
              </label>
              <input
                type="text"
                value={formData.repositoryName}
                onChange={(e) => setFormData({ ...formData, repositoryName: e.target.value })}
                placeholder="e.g. neurocloud-core"
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Technology Stack (comma-separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="e.g. Java 21, Spring Boot, React, MySQL, Docker"
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
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category="Edit Entity"
        title={`Edit Project #${selectedProject?.projectId}`}
        subtitle="Update project parameters and technology stack."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Project Name <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Target End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PLANNED">PLANNED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Git Repository Name
              </label>
              <input
                type="text"
                value={formData.repositoryName}
                onChange={(e) => setFormData({ ...formData, repositoryName: e.target.value })}
                placeholder="e.g. neurocloud-core"
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Technology Stack (comma-separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${selectedProject?.projectName}"? All linked requirements, sprints, and task metadata will be removed.`}
        confirmLabel="Delete Project"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default ProjectsPage;
