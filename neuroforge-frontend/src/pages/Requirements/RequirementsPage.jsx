import React, { useState, useEffect, useCallback } from 'react';
import { requirementApi } from '../../api/requirementApi';
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
  FileText,
  Plus,
  Edit2,
  Trash2,
  Tag as TagIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const RequirementsPage = () => {
  const { role } = useAuth();
  const toast = useToast();

  const [requirements, setRequirements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    projectId: '',
    requirementName: '',
    description: '',
    priority: 'MUST_HAVE',
    status: 'DRAFT',
    tags: '',
  });

  const canMutate = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER', 'BUSINESS_ANALYST'].includes(role);
  const canDelete = ['SYSTEM_ADMIN', 'PROJECT_MANAGER', 'PRODUCT_OWNER'].includes(role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqRes, projRes] = await Promise.all([
        selectedProjectId === 'ALL'
          ? requirementApi.getAll()
          : requirementApi.getByProject(selectedProjectId),
        projectApi.getAll(),
      ]);

      if (reqRes.success) setRequirements(reqRes.data || []);
      if (projRes.success) setProjects(projRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requirements matrix.');
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setFormData({
      projectId: projects.length > 0 ? (projects[0].projectId || projects[0].id) : '',
      requirementName: '',
      description: '',
      priority: 'MUST_HAVE',
      status: 'DRAFT',
      tags: '',
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (req) => {
    setSelectedReq(req);
    setFormData({
      projectId: req.projectId,
      requirementName: req.requirementName,
      description: req.description || '',
      priority: req.priority || 'MUST_HAVE',
      status: req.status || 'DRAFT',
      tags: (req.tags || []).join(', '),
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (req) => {
    setSelectedReq(req);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        projectId: Number(formData.projectId),
        requirementName: formData.requirementName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        tags: tagArray,
      };

      const res = await requirementApi.create(payload);
      if (res.success) {
        toast.success(`Requirement "${formData.requirementName}" created successfully.`);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to create requirement');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setSubmitting(true);
    try {
      const tagArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        projectId: Number(formData.projectId),
        requirementName: formData.requirementName,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        tags: tagArray,
      };

      const res = await requirementApi.update(selectedReq.requirementId, payload);
      if (res.success) {
        toast.success(`Requirement updated successfully.`);
        setIsEditOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to update requirement');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReq) return;
    setSubmitting(true);
    try {
      const res = await requirementApi.delete(selectedReq.requirementId);
      if (res.success) {
        toast.success(`Requirement deleted.`);
        setIsDeleteOpen(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to delete requirement');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadgeColor = (p) => {
    switch (p?.toUpperCase()) {
      case 'MUST_HAVE':
        return 'bg-[#FCF2F2] text-[#A61C1C] border-[#F4D2D2]';
      case 'SHOULD_HAVE':
        return 'bg-[#FAF7F0] text-[#9E6A00] border-[#EFE3C8]';
      case 'COULD_HAVE':
        return 'bg-[#F4F4FA] text-[#4A47A3] border-[#DFDFF2]';
      default:
        return 'bg-[#F7F6F2] text-[#66635F] border-[#ECEAE5]';
    }
  };

  const filteredRequirements = requirements.filter((r) => {
    if (!r) return false;
    const q = (searchQuery || '').toLowerCase();
    const name = (r.requirementName || r.name || r.title || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();

    let tagMatches = false;
    if (Array.isArray(r.tags)) {
      tagMatches = r.tags.some((t) => (t ? String(t).toLowerCase().includes(q) : false));
    } else if (typeof r.tags === 'string') {
      tagMatches = r.tags.toLowerCase().includes(q);
    }

    const matchesSearch = !q || name.includes(q) || desc.includes(q) || tagMatches;
    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <PageHeader
        category="Product Specifications"
        title="Requirements Matrix"
        description="Functional and architectural specifications, MoSCoW priorities, acceptance criteria, and traceability tags."
        badge={`${requirements.length} Specifications`}
        action={
          canMutate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </button>
          )
        }
      />

      {/* Filter and Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5]">
        <div className="sm:col-span-5">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search specifications or tags..."
            className="w-full"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Systems ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.projectId || p.id} value={p.projectId || p.id}>
                {p.projectName || p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Priorities</option>
            <option value="MUST_HAVE">Must Have</option>
            <option value="SHOULD_HAVE">Should Have</option>
            <option value="COULD_HAVE">Could Have</option>
            <option value="WONT_HAVE">Won't Have</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="IMPLEMENTED">Implemented</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28" rows={3} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredRequirements.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No requirements found"
          description="No specifications match the applied filters or project scope."
          actionLabel={canMutate ? 'Create Specification' : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequirements.map((req) => (
            <div
              key={req.requirementId}
              className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6 group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-[10px] text-[#99958F] uppercase tracking-wider">
                    REQ-{String(req.requirementId).padStart(3, '0')}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-[2px] border ${getPriorityBadgeColor(
                      req.priority
                    )}`}
                  >
                    {req.priority?.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge status={req.status} />
                  <span className="text-xs text-[#99958F]">
                    &middot; {req.projectName}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-[#151515] font-normal">{req.requirementName}</h3>

                <div className="text-xs text-[#66635F] leading-relaxed max-w-4xl font-sans font-light prose prose-sm">
                  <ReactMarkdown>{req.description || 'No detailed specification provided.'}</ReactMarkdown>
                </div>

                {req.tags && req.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <TagIcon className="w-3 h-3 text-[#99958F]" />
                    {req.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] text-[#66635F] font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {canMutate && (
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEdit(req)}
                    className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                    title="Edit Requirement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleOpenDelete(req)}
                      className="p-1.5 rounded-[2px] text-[#99958F] hover:text-[#A61C1C] hover:bg-[#FCF2F2] transition-colors"
                      title="Delete Requirement"
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

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        category="New Specification"
        title="Add Requirement Specification"
        subtitle="Define functional or non-functional requirement details and MoSCoW priority."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Target System <span className="text-[#A61C1C]">*</span></label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select System</option>
              {projects.map((p) => (
                <option key={p.projectId || p.id} value={p.projectId || p.id}>
                  {p.projectName || p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Requirement Title <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={formData.requirementName}
              onChange={(e) => setFormData({ ...formData, requirementName: e.target.value })}
              placeholder="e.g. Distributed Rate Limiting &amp; Token Bucket Algorithm"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Specification / Acceptance Criteria (Markdown supported)</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide functional details, user stories, or acceptance criteria..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">MoSCoW Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="MUST_HAVE">MUST_HAVE</option>
                <option value="SHOULD_HAVE">SHOULD_HAVE</option>
                <option value="COULD_HAVE">COULD_HAVE</option>
                <option value="WONT_HAVE">WONT_HAVE</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Lifecycle Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="IMPLEMENTED">IMPLEMENTED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Traceability Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Security, Performance, API, Compliance"
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
              {submitting ? 'Creating...' : 'Add Requirement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        category="Edit Specification"
        title={`Edit Requirement REQ-${selectedReq?.requirementId}`}
        subtitle="Modify requirement specifications, priority, or tags."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Requirement Title <span className="text-[#A61C1C]">*</span></label>
            <input
              type="text"
              required
              value={formData.requirementName}
              onChange={(e) => setFormData({ ...formData, requirementName: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Specification Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">MoSCoW Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="MUST_HAVE">MUST_HAVE</option>
                <option value="SHOULD_HAVE">SHOULD_HAVE</option>
                <option value="COULD_HAVE">COULD_HAVE</option>
                <option value="WONT_HAVE">WONT_HAVE</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Lifecycle Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="IMPLEMENTED">IMPLEMENTED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
        title="Delete Requirement"
        message={`Are you sure you want to delete "${selectedReq?.requirementName}"?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={submitting}
      />
    </div>
  );
};

export default RequirementsPage;

