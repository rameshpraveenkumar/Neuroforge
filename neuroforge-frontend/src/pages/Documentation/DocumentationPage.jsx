import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { documentationApi } from '../../api/documentationApi';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Layers,
  FileText,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Calendar,
  FolderGit2,
  Copy,
  Check,
} from 'lucide-react';

const DOC_TYPES = ['ADR', 'TECH_SPEC', 'RFC', 'API_SPEC', 'RUNBOOK', 'SECURITY_GUIDE'];

const SAMPLE_TEMPLATES = {
  ADR: `# Architecture Decision Record (ADR)
## Status
**ACCEPTED** - Approved for production rollout.

## Context
The NeuroForge platform requires high-throughput asynchronous task processing with distributed consensus and minimal latency overhead.

## Decision
We will implement an event-driven micro-kernel architecture with real-time WebSocket state propagation and optimistic concurrency controls on the client.

## Consequences
- **Positive**: Sub-50ms UI updates, isolated execution context per module, full audit traceability.
- **Negative**: Increased complexity in rollback handlers and eventual consistency synchronization.`,
  TECH_SPEC: `# Technical Specification
## Executive Summary
Specification for zero-trust RBAC token verification across distributed REST endpoints and background job runners.

## Architecture & Data Flow
1. Client issues Bearer JWT with embedded role claims.
2. Filter chain decrypts and verifies signature against public RSA key.
3. Access Decision Manager enforces granular method-level @PreAuthorize rules.`,
};

export const DocumentationPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [docs, setDocs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Forms
  const [form, setForm] = useState({
    projectId: '',
    documentVersion: 1,
    title: '',
    documentType: 'ADR',
    content: '',
  });

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, projsRes] = await Promise.all([
        documentationApi.getAll(),
        projectApi.getAll(),
      ]);

      const items = docsRes.data || [];
      setDocs(items);
      setProjects(projsRes.data || []);

      if (items.length > 0 && !selectedDoc) {
        setSelectedDoc(items[0]);
      }
    } catch (err) {
      console.error('Failed to load documentation:', err);
      setError(err.response?.data?.message || 'Failed to load architecture documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(form.projectId),
        documentVersion: Number(form.documentVersion || 1),
        title: form.title.trim(),
        documentType: form.documentType,
      };

      const res = await documentationApi.create(payload);
      toast.success('Architecture document published successfully');
      setIsCreateOpen(false);
      setForm({ projectId: '', documentVersion: 1, title: '', documentType: 'ADR', content: '' });

      const refreshRes = await documentationApi.getAll();
      setDocs(refreshRes.data || []);
      if (res.data) setSelectedDoc(res.data);
    } catch (err) {
      console.error('Create documentation error:', err);
      toast.error(err.response?.data?.message || 'Failed to publish document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(selectedDoc.projectId),
        documentVersion: Number(selectedDoc.documentVersion),
        title: form.title.trim(),
        documentType: form.documentType,
      };

      const res = await documentationApi.update(selectedDoc.projectId, selectedDoc.documentVersion, payload);
      toast.success('Architecture document updated successfully');
      setIsEditOpen(false);

      const refreshRes = await documentationApi.getAll();
      setDocs(refreshRes.data || []);
      if (res.data) setSelectedDoc(res.data);
    } catch (err) {
      console.error('Update documentation error:', err);
      toast.error(err.response?.data?.message || 'Failed to update document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      await documentationApi.delete(deleteTarget.projectId, deleteTarget.documentVersion);
      toast.success('Document deleted successfully');
      setDeleteTarget(null);

      const refreshRes = await documentationApi.getAll();
      const updatedList = refreshRes.data || [];
      setDocs(updatedList);
      if (selectedDoc?.projectId === deleteTarget.projectId && selectedDoc?.documentVersion === deleteTarget.documentVersion) {
        setSelectedDoc(updatedList.length > 0 ? updatedList[0] : null);
      }
    } catch (err) {
      console.error('Delete document error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered documents
  const filteredDocs = docs.filter((doc) => {
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.projectName || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || doc.documentType === typeFilter;
    const matchesProject = !projectFilter || String(doc.projectId) === String(projectFilter);
    return matchesSearch && matchesType && matchesProject;
  });

  const totalAdrs = docs.filter((d) => d.documentType === 'ADR').length;
  const totalSpecs = docs.filter((d) => d.documentType === 'TECH_SPEC').length;

  const activeDocContent =
    SAMPLE_TEMPLATES[selectedDoc?.documentType] ||
    `# ${selectedDoc?.title || 'Architecture Specification'}
## Metadata
- **Project**: ${selectedDoc?.projectName || `Project #${selectedDoc?.projectId}`}
- **Version**: v${selectedDoc?.documentVersion}.0
- **Type**: ${selectedDoc?.documentType || 'ADR'}
- **Date**: ${selectedDoc?.createdDate ? new Date(selectedDoc.createdDate).toLocaleDateString() : 'Active'}

## Architectural Intent
This document details the engineering specifications, non-functional constraints, and technical design patterns governing this domain capability.

### Non-Functional Requirements
1. **Zero-Trust RBAC**: All operations validated at the database layer.
2. **Deterministic Response**: P99 API latency < 150ms.
3. **Observability**: Distributed tracing on all message queues.`;

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="ARCHITECTURE & SPECIFICATIONS"
        title="Decision Records & Design Specs"
        description="Catalog, author, and review Architectural Decision Records (ADRs), system design specifications, and RFCs."
        actions={
          <button
            onClick={() => {
              setForm({ projectId: '', documentVersion: 1, title: '', documentType: 'ADR', content: '' });
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] rounded-[3px] text-xs font-medium tracking-wide uppercase transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Specification</span>
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="PUBLISHED SPECIFICATIONS"
          value={docs.length}
          subtext="Architecture blueprints"
        />
        <KpiCard
          label="ACCEPTED ADRS"
          value={totalAdrs}
          subtext="Recorded architectural decisions"
        />
        <KpiCard
          label="TECHNICAL SPECIFICATIONS"
          value={totalSpecs}
          subtext="Component design docs"
        />
        <KpiCard
          label="DOCUMENTED SYSTEMS"
          value={projects.length}
          subtext="Active solution domains"
        />
      </div>

      {/* Main Content Layout */}
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
          {/* Left Column: Documents List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                  SPECIFICATIONS ({filteredDocs.length})
                </span>
              </div>

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search doc title or project..."
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
                >
                  <option value="">All Document Types</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.projectId || p.id} value={p.projectId || p.id}>
                      {p.projectName || p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No specifications found"
                description="Try changing the search filter or publish a new ADR/Tech Spec."
                actionText="Publish Spec"
                onAction={() => setIsCreateOpen(true)}
              />
            ) : (
              <div className="space-y-2.5">
                {filteredDocs.map((doc) => {
                  const isSelected =
                    selectedDoc?.projectId === doc.projectId &&
                    selectedDoc?.documentVersion === doc.documentVersion;
                  return (
                    <div
                      key={`${doc.projectId}-${doc.documentVersion}`}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-4 rounded-[3px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F2] border-[#151515]'
                          : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6] hover:bg-[#F7F6F2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-medium uppercase tracking-wider bg-[#FFFFFF] text-[#151515] border border-[#ECEAE5]">
                              {doc.documentType || 'ADR'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] text-[#66635F] bg-[#FFFFFF] border border-[#ECEAE5]">
                              v{doc.documentVersion}.0
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-normal text-[#151515] truncate mt-1.5">
                            {doc.title}
                          </h4>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#99958F] shrink-0 font-medium">
                          {doc.projectName || `PROJ-${doc.projectId}`}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#ECEAE5] flex items-center justify-between text-xs text-[#66635F]">
                        <span className="flex items-center gap-1 text-[11px] text-[#99958F]">
                          <Calendar className="w-3 h-3 text-[#99958F]" />
                          {doc.createdDate ? new Date(doc.createdDate).toLocaleDateString() : 'Current'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-medium text-[#151515]">
                          Read Document &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Markdown Reader / Details */}
          <div className="lg:col-span-7 space-y-4">
            {selectedDoc ? (
              <div className="p-8 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECEAE5]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-medium uppercase tracking-wider bg-[#F7F6F2] text-[#151515] border border-[#ECEAE5]">
                        {selectedDoc.documentType || 'ADR'}
                      </span>
                      <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] text-[#66635F] bg-[#F7F6F2] border border-[#ECEAE5]">
                        Version {selectedDoc.documentVersion}.0
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-normal text-[#151515]">{selectedDoc.title}</h2>
                    <p className="text-xs text-[#99958F] mt-1 font-sans">
                      Associated Project:{' '}
                      <span className="text-[#151515] font-medium">
                        {selectedDoc.projectName || `Project #${selectedDoc.projectId}`}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activeDocContent)}
                      className="p-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515] transition-colors"
                      title="Copy Markdown"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#151515]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setForm({
                          projectId: selectedDoc.projectId,
                          documentVersion: selectedDoc.documentVersion,
                          title: selectedDoc.title,
                          documentType: selectedDoc.documentType || 'ADR',
                          content: activeDocContent,
                        });
                        setIsEditOpen(true);
                      }}
                      className="p-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515] transition-colors"
                      title="Edit Document"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(selectedDoc)}
                      className="p-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#FFF0F0] text-[#99958F] hover:text-[#A61C1C] border border-[#DEDCD6] hover:border-[#F2D6D6] transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rendered Markdown Body */}
                <div className="prose prose-neutral max-w-none text-[#151515] text-xs leading-relaxed space-y-4 font-sans font-light">
                  <ReactMarkdown>{activeDocContent}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Select a document"
                description="Choose an architectural specification from the list on the left to read its full design blueprint."
              />
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Document */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Publish Architecture Document / ADR"
        subtitle="Catalog formal technical specifications and architectural decision records."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Associated Project <span className="text-[#A61C1C]">*</span>
              </label>
              <select
                required
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.projectId || p.id} value={p.projectId || p.id}>
                    {p.projectName || p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Document Type <span className="text-[#A61C1C]">*</span>
              </label>
              <select
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Document Title <span className="text-[#A61C1C]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., ADR-003: Micro-kernel Event Broker for High Throughput"
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Version</label>
              <input
                type="number"
                min="1"
                required
                value={form.documentVersion}
                onChange={(e) => setForm({ ...form, documentVersion: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515] font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs text-[#66635F] leading-relaxed">
            Publishing architectural documents provides permanent auditability and synchronizes with the Engineering Matrix.
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
              {submitting ? 'Publishing...' : 'Publish Document'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Document */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Architecture Document"
        subtitle="Modify title or classification type for this specification."
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Document Title <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Document Type <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
              {submitting ? 'Updating...' : 'Update Document'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Architecture Document"
        message={`Are you sure you want to delete "${deleteTarget?.title}" (v${deleteTarget?.documentVersion}.0)? This action cannot be undone.`}
        confirmText="Delete Document"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default DocumentationPage;
