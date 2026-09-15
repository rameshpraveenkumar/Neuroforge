import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { ChevronDown, Check, UserCircle } from 'lucide-react';

export const PersonaSwitcher = () => {
  const { user, role, demoSwitch, demoPersonas } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef(null);

  const currentRoleConfig = ROLES[role] || {
    name: role || 'Unknown',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (targetRole) => {
    if (targetRole === role || switching) return;
    setSwitching(true);
    try {
      await demoSwitch(targetRole);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to switch role persona:', err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#DEDCD6] text-xs transition-colors duration-100 focus:outline-none"
        title="Switch Active Persona"
      >
        <span className="w-2 h-2 rounded-full bg-[#151515]"></span>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-[0.14em] font-medium text-[#99958F]">Role</span>
          <span className="text-xs font-medium text-[#151515] flex items-center gap-1">
            {currentRoleConfig.name}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-[#99958F] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-50 animate-in fade-in duration-100">
          <div className="px-3 py-2 border-b border-[#ECEAE5] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
              Select Role Persona
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {Object.keys(ROLES).map((roleKey) => {
              const r = ROLES[roleKey];
              const isSelected = roleKey === role;
              const persona = demoPersonas?.find((p) => p.role === roleKey);

              return (
                <button
                  key={roleKey}
                  onClick={() => handleSwitch(roleKey)}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#F7F6F2] transition-colors ${
                    isSelected ? 'bg-[#F7F6F2]' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isSelected ? 'text-[#151515] font-semibold' : 'text-[#66635F] font-normal'}`}>
                        {r.name}
                      </span>
                    </div>
                    {persona && (
                      <p className="text-[11px] text-[#99958F] truncate font-mono mt-0.5">
                        {persona.fullName} &middot; {persona.email}
                      </p>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#151515] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSwitcher;

