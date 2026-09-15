import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#151515] flex flex-col font-sans selection:bg-[#151515] selection:text-[#FFFFFF]">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 w-full">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-[#ECEAE5] bg-[#FFFFFF] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#99958F]">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-[#151515] tracking-widest text-[11px] uppercase">
              NeuroForge
            </span>
            <span>&middot;</span>
            <span className="text-[11px] tracking-wide">Enterprise SDLC Platform</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] tracking-[0.06em] uppercase">
            <Link to="/documentation/adrs" className="hover:text-[#151515] transition-colors">
              Architecture
            </Link>
            <Link to="/ai-studio" className="hover:text-[#151515] transition-colors">
              Intelligence
            </Link>
            <Link to="/admin/audit-logs" className="hover:text-[#151515] transition-colors">
              Audit Stream
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;

