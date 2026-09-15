import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PersonaSwitcher } from './PersonaSwitcher';
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Search,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const engineeringLinks = [
    { label: 'Sprint Board', to: '/sprints/board', desc: '4-Column Drag & Drop Kanban' },
    { label: 'Backlog & Tasks', to: '/tasks/backlog', desc: 'Prioritized Work Items' },
    { label: 'Repositories', to: '/repositories', desc: 'Git Branches & Commits' },
    { label: 'Architecture & ADRs', to: '/documentation/adrs', desc: 'Architectural Decision Records' },
  ];

  const qualityLinks = [
    { label: 'QA Test Center', to: '/qa/test-suites', desc: 'Test Suites & Assertions' },
    { label: 'Bug Tracker', to: '/bugs', desc: 'Defect Triage & Resolution' },
  ];

  const devopsLinks = [
    { label: 'CI/CD Pipelines', to: '/devops/pipelines', desc: '6-Stage Build Simulator' },
    { label: 'Deployments', to: '/devops/deployments', desc: 'Multi-Environment Releases' },
  ];

  const governanceLinks = [
    { label: 'User Directory', to: '/admin/users', desc: 'Team & Role Governance' },
    { label: 'Audit Logs', to: '/admin/audit-logs', desc: 'Security Event Stream' },
  ];

  const isEngineeringActive = ['/sprints/board', '/tasks/backlog', '/repositories', '/documentation/adrs'].some((p) =>
    location.pathname.startsWith(p)
  );
  const isQualityActive = ['/qa/test-suites', '/bugs'].some((p) => location.pathname.startsWith(p));
  const isDevopsActive = ['/devops/pipelines', '/devops/deployments'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <header
      ref={navRef}
      className="h-[74px] bg-[#FFFFFF] border-b border-[#ECEAE5] sticky top-0 z-40 select-none"
    >
      <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="w-5 h-5 border border-[#151515] flex items-center justify-center text-[10px] font-serif font-bold text-[#151515] transition-transform group-hover:scale-105">
              N
            </span>
            <span className="font-serif tracking-[0.2em] text-sm sm:text-base font-semibold text-[#151515] uppercase">
              NeuroForge
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.08em] uppercase text-[#66635F]">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `transition-colors hover:text-[#151515] py-1 ${
                  isActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`
              }
            >
              Overview
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `transition-colors hover:text-[#151515] py-1 ${
                  isActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="/requirements"
              className={({ isActive }) =>
                `transition-colors hover:text-[#151515] py-1 ${
                  isActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`
              }
            >
              Requirements
            </NavLink>

            {/* Engineering Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'eng' ? null : 'eng')}
                className={`flex items-center gap-1 hover:text-[#151515] py-1 transition-colors ${
                  isEngineeringActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`}
              >
                <span>Engineering</span>
                <ChevronDown className="w-3 h-3 text-[#99958F]" />
              </button>

              {openDropdown === 'eng' && (
                <div className="absolute left-0 mt-2.5 w-60 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-2 z-50 animate-in fade-in duration-100">
                  {engineeringLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 hover:bg-[#F7F6F2] transition-colors"
                    >
                      <p className="text-xs font-medium text-[#151515]">{item.label}</p>
                      <p className="text-[10px] text-[#99958F] font-normal normal-case">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'quality' ? null : 'quality')}
                className={`flex items-center gap-1 hover:text-[#151515] py-1 transition-colors ${
                  isQualityActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`}
              >
                <span>Quality</span>
                <ChevronDown className="w-3 h-3 text-[#99958F]" />
              </button>

              {openDropdown === 'quality' && (
                <div className="absolute left-0 mt-2.5 w-56 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-2 z-50 animate-in fade-in duration-100">
                  {qualityLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 hover:bg-[#F7F6F2] transition-colors"
                    >
                      <p className="text-xs font-medium text-[#151515]">{item.label}</p>
                      <p className="text-[10px] text-[#99958F] font-normal normal-case">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* DevOps Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'devops' ? null : 'devops')}
                className={`flex items-center gap-1 hover:text-[#151515] py-1 transition-colors ${
                  isDevopsActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`}
              >
                <span>DevOps</span>
                <ChevronDown className="w-3 h-3 text-[#99958F]" />
              </button>

              {openDropdown === 'devops' && (
                <div className="absolute left-0 mt-2.5 w-56 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-2 z-50 animate-in fade-in duration-100">
                  {devopsLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 hover:bg-[#F7F6F2] transition-colors"
                    >
                      <p className="text-xs font-medium text-[#151515]">{item.label}</p>
                      <p className="text-[10px] text-[#99958F] font-normal normal-case">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/ai-studio"
              className={({ isActive }) =>
                `transition-colors hover:text-[#151515] py-1 ${
                  isActive ? 'text-[#151515] font-semibold border-b border-[#151515]' : ''
                }`
              }
            >
              Intelligence
            </NavLink>
          </nav>
        </div>

        {/* Right: Persona Switcher & Profile Actions */}
        <div className="flex items-center gap-4">
          {/* Persona Switcher */}
          <PersonaSwitcher />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-[2px] bg-[#F7F6F2] hover:bg-[#F2F0EA] border border-[#DEDCD6] text-xs font-serif font-bold text-[#151515] flex items-center justify-center transition-colors focus:outline-none"
            >
              {user?.fullName?.slice(0, 2).toUpperCase() || 'NF'}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-2 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2.5 border-b border-[#ECEAE5]">
                  <p className="text-xs font-medium text-[#151515]">{user?.fullName}</p>
                  <p className="text-[11px] text-[#99958F] truncate font-mono">{user?.email}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#66635F] mt-1 font-medium">
                    {user?.roleDisplayName || user?.role}
                  </p>
                </div>

                <div className="py-1 border-b border-[#ECEAE5]">
                  <p className="px-4 pt-1.5 pb-1 text-[9px] uppercase tracking-[0.14em] text-[#99958F] font-medium">
                    Governance
                  </p>
                  <Link
                    to="/admin/users"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-1.5 text-xs text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                  >
                    User Directory
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-1.5 text-xs text-[#151515] hover:bg-[#F7F6F2] transition-colors"
                  >
                    Security Audit Logs
                  </Link>
                </div>

                <div className="pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-[#151515] hover:bg-[#F7F6F2] flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#99958F]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#151515] hover:text-[#66635F] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#ECEAE5] px-6 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wider text-[#151515]">
            <Link to="/dashboard" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Overview</Link>
            <Link to="/projects" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Projects</Link>
            <Link to="/requirements" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Requirements</Link>
            <Link to="/sprints/board" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Sprint Board</Link>
            <Link to="/tasks/backlog" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Tasks</Link>
            <Link to="/qa/test-suites" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">QA Suites</Link>
            <Link to="/bugs" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Bug Tracker</Link>
            <Link to="/repositories" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Repositories</Link>
            <Link to="/devops/pipelines" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">CI/CD</Link>
            <Link to="/devops/deployments" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Deployments</Link>
            <Link to="/ai-studio" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">AI Studio</Link>
            <Link to="/documentation/adrs" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Architecture</Link>
            <Link to="/admin/users" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Users</Link>
            <Link to="/admin/audit-logs" className="p-2 hover:bg-[#F7F6F2] rounded-[2px]">Audit Logs</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
