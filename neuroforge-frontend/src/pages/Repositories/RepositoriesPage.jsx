import React, { useState, useEffect } from 'react';
import { repositoryApi } from '../../api/repositoryApi';
import { projectApi } from '../../api/projectApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  GitBranch,
  GitCommit,
  FolderGit2,
  Users,
  Plus,
  ExternalLink,
  Calendar,
  User,
} from 'lucide-react';

export const RepositoriesPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [repositories, setRepositories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [commits, setCommits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  // Modals
  const [isCreateRepoOpen, setIsCreateRepoOpen] = useState(false);
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);
  const [isRecordCommitOpen, setIsRecordCommitOpen] = useState(false);

  // Form states
  const [repoForm, setRepoForm] = useState({
    projectId: '',
    repoName: '',
    repoUrl: '',
    defaultBranch: 'main',
  });

  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');

  const [commitForm, setCommitForm] = useState({
    commitHash: '',
    authorId: '',
    commitMessage: '',
    branchName: 'main',
    linesAdded: 24,
    linesDeleted: 6,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const repoId = selectedRepo?.repositoryId || selectedRepo?.id;
    if (repoId) {
      fetchCommits(repoId);
    }
  }, [selectedRepo]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repoRes, projRes, userRes] = await Promise.all([
        repositoryApi.getAll(),
        projectApi.getAll(),
        userApi.getAll().catch(() => ({ data: [] })),
      ]);

      const repos = repoRes.data || [];
      setRepositories(repos);
      setProjects(projRes.data || []);
      setUsersList(userRes.data || []);

      if (repos.length > 0 && !selectedRepo) {
        setSelectedRepo(repos[0]);
      }
    } catch (err) {
      console.error('Failed to load repositories:', err);
      setError(err.response?.data?.message || 'Failed to connect to Git Repository service');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommits = async (repoId) => {
    setCommitsLoading(true);
    try {
      const res = await repositoryApi.getCommits(repoId);
      setCommits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch commits:', err);
      toast.error('Failed to fetch commit history for this repository');
    } finally {
      setCommitsLoading(false);
    }
  };

  const handleCreateRepo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(repoForm.projectId),
        repoName: repoForm.repoName.trim(),
        repoUrl: repoForm.repoUrl.trim() || `https://github.com/neuroforge/${repoForm.repoName.toLowerCase().replace(/\s+/g, '-')}`,
        defaultBranch: repoForm.defaultBranch.trim() || 'main',
      };

      const res = await repositoryApi.create(payload);
      toast.success('Repository created successfully');
      setIsCreateRepoOpen(false);
      setRepoForm({ projectId: '', repoName: '', repoUrl: '', defaultBranch: 'main' });

      // Refresh list
      const repoRes = await repositoryApi.getAll();
      setRepositories(repoRes.data || []);
      if (res.data) {
        setSelectedRepo(res.data);
      }
    } catch (err) {
      console.error('Create repo error:', err);
      toast.error(err.response?.data?.message || 'Failed to create repository');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    const repoId = selectedRepo?.repositoryId || selectedRepo?.id;
    if (!repoId || !selectedCollaboratorId) return;

    setSubmitting(true);
    try {
      await repositoryApi.addCollaborator(repoId, Number(selectedCollaboratorId));
      toast.success('Collaborator assigned to repository');
      setIsAddCollaboratorOpen(false);
      setSelectedCollaboratorId('');

      // Refresh repo details
      const repoRes = await repositoryApi.getAll();
      setRepositories(repoRes.data || []);
      const updated = (repoRes.data || []).find((r) => (r.repositoryId || r.id) === repoId);
      if (updated) setSelectedRepo(updated);
    } catch (err) {
      console.error('Add collaborator error:', err);
      toast.error(err.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordCommit = async (e) => {
    e.preventDefault();
    const repoId = selectedRepo?.repositoryId || selectedRepo?.id;
    if (!repoId) return;

    setSubmitting(true);
    try {
      const generatedHash = commitForm.commitHash.trim() || Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
      const payload = {
        repositoryId: repoId,
        commitHash: generatedHash,
        authorId: Number(commitForm.authorId || user?.id || 6),
        commitMessage: commitForm.commitMessage.trim(),
        branchName: commitForm.branchName.trim() || selectedRepo.defaultBranch || 'main',
        linesAdded: Number(commitForm.linesAdded || 0),
        linesDeleted: Number(commitForm.linesDeleted || 0),
      };

      await repositoryApi.recordCommit(payload);
      toast.success('Commit recorded successfully');
      setIsRecordCommitOpen(false);
      setCommitForm({
        commitHash: '',
        authorId: '',
        commitMessage: '',
        branchName: selectedRepo.defaultBranch || 'main',
        linesAdded: 24,
        linesDeleted: 6,
      });

      // Refresh commit list
      fetchCommits(repoId);
    } catch (err) {
      console.error('Record commit error:', err);
      toast.error(err.response?.data?.message || 'Failed to record commit');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Repositories
  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      (repo.repoName || '').toLowerCase().includes(search.toLowerCase()) ||
      (repo.repoUrl || '').toLowerCase().includes(search.toLowerCase()) ||
      (repo.projectName || '').toLowerCase().includes(search.toLowerCase());
    const matchesProject = !projectFilter || String(repo.projectId) === String(projectFilter);
    return matchesSearch && matchesProject;
  });

  const totalCommitsCount = commits.length;
  const totalAdditions = commits.reduce((acc, c) => acc + (c.linesAdded || 0), 0);
  const totalDeletions = commits.reduce((acc, c) => acc + (c.linesDeleted || 0), 0);

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="CODE & ARTIFACTS"
        title="Repositories & Version Control"
        description="Manage Git repositories, branch topologies, contributor access permissions, and versioned commit histories."
        actions={
          <button
            onClick={() => setIsCreateRepoOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] rounded-[3px] text-xs font-medium tracking-wide uppercase transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Repository</span>
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="CONNECTED REPOSITORIES"
          value={repositories.length}
          subtext="Active Git code trees"
        />
        <KpiCard
          label="COMMITS IN STREAM"
          value={totalCommitsCount}
          subtext={`Branch: ${selectedRepo?.defaultBranch || 'main'}`}
        />
        <KpiCard
          label="LINES INSERTED"
          value={`+${totalAdditions}`}
          subtext="Across selected history"
        />
        <KpiCard
          label="LINES REFACTORED"
          value={`-${totalDeletions}`}
          subtext="Pruned & updated code"
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
        <ErrorState message={error} onRetry={fetchInitialData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Repositories List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                  REPOSITORIES ({filteredRepos.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Filter by name..."
                />
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

            {filteredRepos.length === 0 ? (
              <EmptyState
                icon={FolderGit2}
                title="No repositories found"
                description="Try refining your search filter or create a new Git repository."
                actionText="Create Repository"
                onAction={() => setIsCreateRepoOpen(true)}
              />
            ) : (
              <div className="space-y-2.5">
                {filteredRepos.map((repo) => {
                  const isSelected = (selectedRepo?.repositoryId || selectedRepo?.id) === (repo.repositoryId || repo.id);
                  return (
                    <div
                      key={repo.repositoryId || repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className={`p-4 rounded-[3px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F2] border-[#151515]'
                          : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6] hover:bg-[#F7F6F2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base font-normal text-[#151515] truncate">
                              {repo.repoName}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase bg-[#FFFFFF] text-[#66635F] border border-[#ECEAE5] flex items-center gap-1">
                              <GitBranch className="w-2.5 h-2.5 text-[#151515]" />
                              {repo.defaultBranch || 'main'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#99958F] truncate mt-1 font-mono">
                            {repo.repoUrl}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-medium uppercase tracking-wider bg-[#FFFFFF] text-[#66635F] border border-[#ECEAE5] shrink-0">
                          {repo.projectName || `PROJ-${repo.projectId}`}
                        </span>
                      </div>

                      {/* Collaborators Count / Action */}
                      <div className="mt-3 pt-2.5 border-t border-[#ECEAE5] flex items-center justify-between text-xs text-[#66635F]">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Users className="w-3 h-3 text-[#99958F]" />
                          <span>{repo.collaborators?.length || 0} Collaborators</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-medium text-[#151515] flex items-center gap-1">
                          View History &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Repository Detail & Commit Stream */}
          <div className="lg:col-span-7 space-y-6">
            {selectedRepo ? (
              <>
                {/* Active Repo Header Card */}
                <div className="p-6 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-normal text-[#151515]">{selectedRepo.repoName}</h3>
                        <a
                          href={selectedRepo.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-[2px] bg-[#FFFFFF] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515]"
                          title="Open Git Remote"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-[#99958F] font-mono mt-1">{selectedRepo.repoUrl}</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setIsAddCollaboratorOpen(true)}
                        className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] text-xs font-medium text-[#151515] border border-[#DEDCD6] flex items-center gap-1.5 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Add Collaborator</span>
                      </button>
                      <button
                        onClick={() => setIsRecordCommitOpen(true)}
                        className="px-3.5 py-1.5 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-xs font-medium tracking-wide uppercase text-white flex items-center gap-1.5 transition-colors"
                      >
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Record Commit</span>
                      </button>
                    </div>
                  </div>

                  {/* Collaborators Chips */}
                  {selectedRepo.collaborators && selectedRepo.collaborators.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#ECEAE5] flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-[#99958F] flex items-center gap-1">
                        <Users className="w-3 h-3" /> Team Access:
                      </span>
                      {selectedRepo.collaborators.map((c) => (
                        <span
                          key={c.id || c.userId || c.username}
                          className="px-2 py-0.5 rounded-[2px] text-xs bg-[#FFFFFF] border border-[#DEDCD6] text-[#151515] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#151515]"></span>
                          {c.fullName || c.username || `User #${c.userId}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Commit History Timeline */}
                <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE5]">
                    <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                      COMMIT STREAM ({commits.length})
                    </span>
                    <span className="text-xs text-[#66635F] font-mono">
                      Branch: <span className="text-[#151515] font-semibold">{selectedRepo.defaultBranch || 'main'}</span>
                    </span>
                  </div>

                  {commitsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </div>
                  ) : commits.length === 0 ? (
                    <EmptyState
                      icon={GitCommit}
                      title="No commits recorded yet"
                      description="Record the first simulated git commit for this repository."
                      actionText="Record Commit"
                      onAction={() => setIsRecordCommitOpen(true)}
                    />
                  ) : (
                    <div className="space-y-3 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#ECEAE5]">
                      {commits.map((commit) => (
                        <div
                          key={commit.id || commit.commitHash}
                          className="relative pl-6 group"
                        >
                          <div className="absolute left-1.5 top-2.5 w-2 h-2 rounded-full bg-[#151515] group-hover:scale-125 transition-transform"></div>

                          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs font-medium text-[#151515] leading-relaxed">
                                {commit.commitMessage}
                              </p>
                              <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#FFFFFF] text-[#66635F] border border-[#DEDCD6] shrink-0">
                                {commit.commitHash?.substring(0, 8) || 'commit'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#66635F] pt-2 border-t border-[#ECEAE5]">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[#151515] font-medium">
                                  <User className="w-3 h-3 text-[#99958F]" />
                                  {commit.authorName || `Author #${commit.authorId || 'dev'}`}
                                </span>
                                <span className="flex items-center gap-1 font-mono text-[#99958F]">
                                  <GitBranch className="w-3 h-3" />
                                  {commit.branchName || 'main'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 font-mono text-[10px]">
                                <span className="text-[#151515]">
                                  +{commit.linesAdded || 0}
                                </span>
                                <span className="text-[#99958F]">
                                  -{commit.linesDeleted || 0}
                                </span>
                                {commit.committedAt && (
                                  <span className="flex items-center gap-1 text-[#99958F]">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(commit.committedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                icon={FolderGit2}
                title="Select a repository"
                description="Choose a repository from the left column to view its commit history and collaborator permissions."
              />
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Repository */}
      <Modal
        isOpen={isCreateRepoOpen}
        onClose={() => setIsCreateRepoOpen(false)}
        title="Create Git Repository"
        subtitle="Initialize a new code repository and associate it with an active project."
      >
        <form onSubmit={handleCreateRepo} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Associated Project <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={repoForm.projectId}
              onChange={(e) => setRepoForm({ ...repoForm, projectId: e.target.value })}
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
              Repository Name <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={repoForm.repoName}
              onChange={(e) => setRepoForm({ ...repoForm, repoName: e.target.value })}
              placeholder="e.g., neurocloud-backend-service"
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Repository URL
            </label>
            <input
              type="url"
              value={repoForm.repoUrl}
              onChange={(e) => setRepoForm({ ...repoForm, repoUrl: e.target.value })}
              placeholder="https://github.com/neuroforge/repo-name"
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Default Branch
            </label>
            <input
              type="text"
              value={repoForm.defaultBranch}
              onChange={(e) => setRepoForm({ ...repoForm, defaultBranch: e.target.value })}
              placeholder="main"
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515] font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsCreateRepoOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Repository'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Collaborator */}
      <Modal
        isOpen={isAddCollaboratorOpen}
        onClose={() => setIsAddCollaboratorOpen(false)}
        title={`Add Collaborator`}
        subtitle={`Grant team permissions on ${selectedRepo?.repoName || 'repository'}.`}
      >
        <form onSubmit={handleAddCollaborator} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Select User / Engineer <span className="text-[#A61C1C]">*</span>
            </label>
            <select
              required
              value={selectedCollaboratorId}
              onChange={(e) => setSelectedCollaboratorId(e.target.value)}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">Select Team Member</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.roleDisplayName || u.role}) - {u.email}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs text-[#66635F] leading-relaxed">
            Assigned collaborators receive read, write, and pull request commit privileges on this repository tree.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsAddCollaboratorOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedCollaboratorId}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Assigning...' : 'Assign Collaborator'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Commit */}
      <Modal
        isOpen={isRecordCommitOpen}
        onClose={() => setIsRecordCommitOpen(false)}
        title={`Record Code Commit`}
        subtitle={`Log a simulated version control commit on ${selectedRepo?.repoName || 'repository'}.`}
      >
        <form onSubmit={handleRecordCommit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Commit Message <span className="text-[#A61C1C]">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={commitForm.commitMessage}
              onChange={(e) => setCommitForm({ ...commitForm, commitMessage: e.target.value })}
              placeholder="feat(core): implement secure OAuth2 token exchange with caching"
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Branch Name</label>
              <input
                type="text"
                value={commitForm.branchName}
                onChange={(e) => setCommitForm({ ...commitForm, branchName: e.target.value })}
                placeholder="main"
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515] font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Author</label>
              <select
                value={commitForm.authorId}
                onChange={(e) => setCommitForm({ ...commitForm, authorId: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                <option value="">Current User ({user?.fullName || 'Self'})</option>
                {usersList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Lines Added (+)</label>
              <input
                type="number"
                min="0"
                value={commitForm.linesAdded}
                onChange={(e) => setCommitForm({ ...commitForm, linesAdded: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] font-mono focus:outline-none focus:border-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Lines Deleted (-)</label>
              <input
                type="number"
                min="0"
                value={commitForm.linesDeleted}
                onChange={(e) => setCommitForm({ ...commitForm, linesDeleted: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] font-mono focus:outline-none focus:border-[#151515]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsRecordCommitOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Commit Code'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RepositoriesPage;
