import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFilteredSections } from '../../utils/rolePermissions';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  KanbanSquare,
  ListTodo,
  Layers,
  CheckSquare,
  Bug,
  GitBranch,
  Workflow,
  Server,
  Sparkles,
  Users,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  FolderGit2,
  FileText,
  KanbanSquare,
  ListTodo,
  Layers,
  CheckSquare,
  Bug,
  GitBranch,
  Workflow,
  Server,
  Sparkles,
  Users,
  ShieldAlert,
};

export const Sidebar = () => {
  const { role, user } = useAuth();
  const sections = getFilteredSections(role);

  return (
    <aside className="w-60 bg-[#FFFFFF] border-r border-[#E6E6E3] flex flex-col h-screen shrink-0 sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-[#E6E6E3]">
        <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-xs tracking-tight text-[#111111] flex items-center gap-1">
            NEURO<span className="text-[#635BFF]">FORGE</span>
          </h1>
          <p className="text-[10px] text-[#888888] truncate">Enterprise SDLC &amp; DevOps</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 pb-1 text-[10px] font-semibold text-[#888888] tracking-wider uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors duration-100 ${
                        isActive
                          ? 'bg-[#F0EFFF] text-[#635BFF] font-semibold'
                          : 'text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F1] font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-[#635BFF]' : 'text-[#888888]'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Persona Footer */}
      <div className="p-3 border-t border-[#E6E6E3] bg-[#FAFAF8]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FFFFFF] border border-[#E6E6E3]">
          <div className="w-7 h-7 rounded-md bg-[#F0EFFF] text-[#635BFF] flex items-center justify-center text-xs font-bold shrink-0">
            {role ? role.slice(0, 2) : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#111111] truncate">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-[#888888] truncate">{user?.roleDisplayName || role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
