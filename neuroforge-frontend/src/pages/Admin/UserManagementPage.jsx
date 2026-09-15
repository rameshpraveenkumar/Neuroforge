import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
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
  Users,
  Edit2,
  Trash2,
  Phone,
} from 'lucide-react';

const ROLE_OPTIONS = [
  'SYSTEM_ADMIN',
  'PROJECT_MANAGER',
  'PRODUCT_OWNER',
  'BUSINESS_ANALYST',
  'SOFTWARE_ARCHITECT',
  'DEVELOPER',
  'QA_ENGINEER',
  'DEVOPS_ENGINEER',
  'CLIENT',
];

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'DEVELOPER',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to connect to User Governance service');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (targetUser) => {
    setSelectedUser(targetUser);
    setEditForm({
      name: targetUser.fullName || '',
      email: targetUser.email || '',
      role: targetUser.role || 'DEVELOPER',
      phone: targetUser.phone || (targetUser.phoneNumbers?.[0] || ''),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        phone: editForm.phone.trim(),
      };

      const targetId = selectedUser.id || selectedUser.userId;
      await userApi.update(targetId, payload);
      toast.success(`User ${editForm.name} updated successfully`);
      setIsEditModalOpen(false);

      // Refresh list
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Update user error:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      const targetId = deleteTarget.id || deleteTarget.userId;
      await userApi.delete(targetId);
      toast.success(`User ${deleteTarget.fullName || deleteTarget.username} deleted successfully`);
      setDeleteTarget(null);

      // Refresh list
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'SYSTEM_ADMIN').length;
  const devCount = users.filter((u) => u.role === 'DEVELOPER').length;
  const qaCount = users.filter((u) => u.role === 'QA_ENGINEER').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="GOVERNANCE & DIRECTORY"
        title="Enterprise User Governance"
        description="Manage identities, role assignments, contact numbers, and security credentials across the enterprise."
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="DIRECTORY MEMBERS"
          value={totalUsers}
          subtext="Active platform accounts"
        />
        <KpiCard
          label="SYSTEM ADMINISTRATORS"
          value={adminCount}
          subtext="Full platform root access"
        />
        <KpiCard
          label="ENGINEERS & DEVS"
          value={devCount}
          subtext="Active contributors"
        />
        <KpiCard
          label="QA SPECIALISTS"
          value={qaCount}
          subtext="Verification engineers"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 px-4 bg-[#F7F6F2] rounded-[3px] border border-[#ECEAE5]">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search user name or email..."
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            >
              <option value="">All Roles</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try modifying your search keywords or role filter criteria."
          />
        ) : (
          <div className="overflow-x-auto border border-[#ECEAE5] rounded-[3px] bg-[#FFFFFF]">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#ECEAE5] bg-[#F7F6F2]">
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">User</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Role &amp; Permissions</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Email</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Phone Numbers</th>
                  <th className="py-3 px-4 text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE5]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F6F2] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#F7F6F2] border border-[#DEDCD6] flex items-center justify-center font-mono text-[10px] text-[#151515]">
                          {u.fullName ? u.fullName.slice(0, 2).toUpperCase() : u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-normal text-[#151515]">{u.fullName || u.username}</p>
                          <p className="text-[11px] text-[#99958F] font-mono">@{u.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-medium uppercase tracking-wider bg-[#FFFFFF] border border-[#ECEAE5] text-[#151515]">
                        {u.roleDisplayName || u.role?.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[#66635F]">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4 text-[#66635F]">
                      {u.phoneNumbers && u.phoneNumbers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {u.phoneNumbers.map((phone, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#F7F6F2] border border-[#ECEAE5] text-[#66635F] flex items-center gap-1"
                            >
                              <Phone className="w-2.5 h-2.5 text-[#99958F]" />
                              {phone}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#99958F] font-mono text-[11px]">--</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-[#66635F] hover:text-[#151515] transition-colors"
                          title="Edit User Role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={u.username === 'admin'}
                          className="p-1 rounded-[2px] bg-[#FFFFFF] hover:bg-[#FFF0F0] disabled:opacity-30 text-[#99958F] hover:text-[#A61C1C] border border-[#DEDCD6] hover:border-[#F2D6D6] transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Edit User */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit User & Role`}
        subtitle={`Update attributes for @${selectedUser?.username || ''}`}
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Full Name <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
              Email Address <span className="text-[#A61C1C]">*</span>
            </label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                Assigned Role <span className="text-[#A61C1C]">*</span>
              </label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515] font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] text-xs text-[#66635F] leading-relaxed">
            Modifying role grants immediate updated permissions across the REST security filter chain upon next JWT authentication.
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#ECEAE5]">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user account "${deleteTarget?.fullName || deleteTarget?.username}"? All associated role bindings will be revoked.`}
        confirmText="Delete User"
        confirmVariant="danger"
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default UserManagementPage;
