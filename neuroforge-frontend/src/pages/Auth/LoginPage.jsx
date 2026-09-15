import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, demoSwitch, demoPersonas, error } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('dev@neuroforge.io');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError('');

    const res = await login(usernameOrEmail, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message);
    }
    setSubmitting(false);
  };

  const handleQuickLogin = async (roleKey) => {
    setSubmitting(true);
    setLocalError('');
    const res = await demoSwitch(roleKey);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#151515] flex flex-col justify-between py-12 px-6 sm:px-10 lg:px-16 selection:bg-[#151515] selection:text-[#FFFFFF]">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[#ECEAE5] pb-6">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border border-[#151515] flex items-center justify-center text-[10px] font-serif font-bold text-[#151515]">
            N
          </span>
          <span className="font-serif tracking-[0.2em] text-sm font-semibold uppercase text-[#151515]">
            NEUROFORGE
          </span>
        </div>
        <span className="text-[10px] tracking-[0.14em] uppercase text-[#99958F] font-medium hidden sm:inline">
          Enterprise SDLC &middot; Release 2026.4
        </span>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Editorial Headline & Value */}
        <div className="lg:col-span-6 space-y-6">
          <p className="text-[10px] tracking-[0.16em] uppercase font-medium text-[#99958F]">
            The Engineering Operating System
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#151515] leading-[1.1] tracking-tight">
            One workspace. <br />
            Every stage.
          </h1>
          <p className="text-sm sm:text-base text-[#66635F] leading-relaxed max-w-lg font-sans font-light">
            Unify requirements, architecture decisions, automated testing, continuous integration, and multi-cloud release governance into a coherent architectural workflow.
          </p>

          <div className="pt-8 border-t border-[#ECEAE5] grid grid-cols-3 gap-6">
            <div>
              <p className="font-serif text-2xl text-[#151515]">15</p>
              <p className="text-[10px] uppercase tracking-wider text-[#99958F] mt-1 font-medium">Core Modules</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#151515]">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-[#99958F] mt-1 font-medium">Traceability</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#151515]">9</p>
              <p className="text-[10px] uppercase tracking-wider text-[#99958F] mt-1 font-medium">Role Personas</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In & Persona Selector */}
        <div className="lg:col-span-6 space-y-8">
          {/* Sign In Form */}
          <div className="p-8 border border-[#ECEAE5] rounded-[3px] bg-[#FFFFFF]">
            <p className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F] mb-1">
              Authentication
            </p>
            <h2 className="font-serif text-2xl text-[#151515] font-normal mb-6">
              Sign In to NeuroForge
            </h2>

            {(localError || error) && (
              <div className="mb-6 p-3 rounded-[2px] bg-[#FCF2F2] border border-[#F4D2D2] text-[#A61C1C] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                  Email Address / Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="dev@neuroforge.io"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#DEDCD6] rounded-[3px] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-xs font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Persona Direct Access Grid */}
          <div className="p-8 border border-[#ECEAE5] rounded-[3px] bg-[#F7F6F2]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.14em] uppercase font-medium text-[#99958F]">
                Direct Role Access
              </span>
              <span className="text-[10px] font-mono text-[#66635F]">
                9 Personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.keys(ROLES).map((roleKey, idx) => {
                const r = ROLES[roleKey];
                const persona = demoPersonas?.find((p) => p.role === roleKey);
                const numStr = String(idx + 1).padStart(2, '0');

                return (
                  <button
                    key={roleKey}
                    onClick={() => handleQuickLogin(roleKey)}
                    disabled={submitting}
                    className="text-left p-3 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F2F0EA] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors flex flex-col justify-between h-20 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[9px] text-[#99958F]">{numStr}</span>
                      <ArrowRight className="w-3 h-3 text-[#99958F] group-hover:text-[#151515] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#151515] group-hover:text-[#151515] truncate">
                        {r.name}
                      </p>
                      <p className="text-[10px] text-[#99958F] truncate font-mono">
                        {persona ? persona.fullName.split(' ')[0] : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ECEAE5] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#99958F] gap-2">
        <p>&copy; {new Date().getFullYear()} NeuroForge Systems Inc. All rights reserved.</p>
        <p className="font-mono">Security: TLS 1.3 &middot; JWT RBAC</p>
      </footer>
    </div>
  );
};

export default LoginPage;

