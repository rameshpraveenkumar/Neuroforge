import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessDenied = ({
  title = 'Access Restricted',
  message,
}) => {
  const { role, user } = useAuth();

  return (
    <div className="p-10 md:p-14 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] text-center flex flex-col items-center justify-center max-w-md mx-auto my-12 space-y-4">
      <div className="w-10 h-10 rounded-[2px] bg-[#FCF2F2] text-[#A61C1C] flex items-center justify-center border border-[#F4D2D2]">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#151515] tracking-tight">{title}</h2>
      <p className="text-xs text-[#66635F] leading-relaxed max-w-sm font-sans font-light">
        {message || (
          <>
            Your current persona role <span className="text-[#151515] font-semibold">{user?.roleDisplayName || role}</span> is not authorized to access this module under governance policies.
          </>
        )}
      </p>

      <div className="pt-2 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Overview</span>
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;

