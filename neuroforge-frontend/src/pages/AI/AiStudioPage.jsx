import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiApi } from '../../api/aiApi';
import { projectApi } from '../../api/projectApi';
import { sprintApi } from '../../api/sprintApi';
import { requirementApi } from '../../api/requirementApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Zap,
  History,
} from 'lucide-react';

const GENERATION_PRESETS = [
  {
    type: 'USER_STORY',
    title: 'BDD User Story',
    desc: 'Synthesizes complete user stories with Given/When/Then acceptance criteria.',
    samplePrompt: 'As a financial analyst, I need real-time portfolio rebalancing so that risk exposure is minimized during volatile market conditions.',
    icon: FileCode,
  },
  {
    type: 'TEST_CASE',
    title: 'QA Test Matrix',
    desc: 'Generates boundary value test cases, edge cases, and automated test assertions.',
    samplePrompt: 'Verify JWT expiration handling when token has expired 5 minutes ago and refresh token is revoked.',
    icon: CheckCircle2,
  },
  {
    type: 'SPRINT_RISK',
    title: 'Sprint Risk Analysis',
    desc: 'Evaluates sprint scope, developer workload distribution, and blocker risks.',
    samplePrompt: 'Sprint 2 has 38 committed story points with 4 backend tasks in IN_PROGRESS state and 1 critical bug pending review.',
    icon: AlertTriangle,
  },
  {
    type: 'CODE_REVIEW',
    title: 'Architecture Review',
    desc: 'Analyzes design patterns, concurrency safety, and SQL query optimizations.',
    samplePrompt: 'Review JPA composite key mapping and transactional isolation level for the DeploymentLog and TaskLabel entity associations.',
    icon: BrainCircuit,
  },
];

export const AiStudioPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const [historySuggestions, setHistorySuggestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [prompt, setPrompt] = useState('');
  const [genType, setGenType] = useState('USER_STORY');
  const [projectId, setProjectId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [requirementId, setRequirementId] = useState('');

  // Result state
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedAssistant?.id) {
      fetchAssistantHistory(selectedAssistant.id);
    }
  }, [selectedAssistant]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aiRes, projRes, sprintRes, reqRes] = await Promise.all([
        aiApi.getAssistants(),
        projectApi.getAll(),
        sprintApi.getAll().catch(() => ({ data: [] })),
        requirementApi.getAll().catch(() => ({ data: [] })),
      ]);

      const items = aiRes.data || [];
      setAssistants(items);
      setProjects(projRes.data || []);
      setSprints(sprintRes.data || []);
      setRequirements(reqRes.data || []);

      if (items.length > 0 && !selectedAssistant) {
        setSelectedAssistant(items[0]);
      }
    } catch (err) {
      console.error('Failed to load AI Studio data:', err);
      setError(err.response?.data?.message || 'Failed to connect to NeuroForge AI Hub');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssistantHistory = async (aiId) => {
    setHistoryLoading(true);
    try {
      const res = await aiApi.getSuggestionsByAssistant(aiId);
      setHistorySuggestions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assistant history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const payload = {
        prompt: prompt.trim(),
        type: genType,
        projectId: projectId ? Number(projectId) : null,
        sprintId: sprintId ? Number(sprintId) : null,
        requirementId: requirementId ? Number(requirementId) : null,
      };

      const res = await aiApi.generate(payload);
      toast.success('AI synthesis completed successfully');
      setGeneratedResult(res.data);

      if (selectedAssistant?.id) {
        fetchAssistantHistory(selectedAssistant.id);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error(err.response?.data?.message || 'AI Generation encountered an issue');
    } finally {
      setGenerating(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setGenType(preset.type);
    setPrompt(preset.samplePrompt);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        category="INTELLIGENCE & AI HUB"
        title="Engineering Intelligence Studio"
        description="Domain AI agents for BDD User Stories, Test Matrices, Sprint Risk, and Architecture Reviews."
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-4 border-b border-[#ECEAE5]">
        <KpiCard
          label="DOMAIN AI AGENTS"
          value={assistants.length || 4}
          subtext="Specialized model personas"
        />
        <KpiCard
          label="SYNTHESIZED ARTIFACTS"
          value={historySuggestions.length}
          subtext="Logged suggestions"
        />
        <KpiCard
          label="INFERENCE ENGINE"
          value="Heuristic v1.0"
          subtext="Zero external dependency"
        />
        <KpiCard
          label="AVERAGE LATENCY"
          value="< 250ms"
          subtext="Deterministic synthesis"
        />
      </div>

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
          {/* Left Column: AI Assistant Persona Selector & Prompt Workspace */}
          <div className="lg:col-span-6 space-y-6">
            {/* Assistant Selector */}
            <div className="p-6 rounded-[3px] bg-[#F7F6F2] border border-[#ECEAE5] space-y-3">
              <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] block">
                SELECT DOMAIN ASSISTANT
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {assistants.map((assistant) => {
                  const isSelected = selectedAssistant?.id === assistant.id;
                  return (
                    <div
                      key={assistant.id}
                      onClick={() => setSelectedAssistant(assistant)}
                      className={`p-3.5 rounded-[3px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFFFF] border-[#151515]'
                          : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#151515] text-[#FFFFFF] flex items-center justify-center font-mono text-[9px]">
                          AI
                        </div>
                        <h4 className="font-serif text-sm font-normal text-[#151515] truncate">
                          {assistant.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#99958F] mt-1 truncate">
                        {assistant.specialty || 'SDLC Intelligence'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prompt Workspace */}
            <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE5]">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                  PROMPT STUDIO
                </span>
                <span className="text-[10px] font-mono text-[#99958F]">
                  Model: {selectedAssistant?.modelName || 'Heuristic-v1'}
                </span>
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-medium text-[#66635F]">
                  Preset Templates:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {GENERATION_PRESETS.map((preset) => {
                    const isSelected = genType === preset.type;
                    return (
                      <button
                        key={preset.type}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2.5 rounded-[3px] text-left border transition-colors ${
                          isSelected
                            ? 'bg-[#F7F6F2] border-[#151515] text-[#151515]'
                            : 'bg-[#FFFFFF] border-[#ECEAE5] hover:border-[#DEDCD6] text-[#66635F]'
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{preset.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                      Context Project
                    </label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
                    >
                      <option value="">None (Global)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                      Target Sprint
                    </label>
                    <select
                      value={sprintId}
                      onChange={(e) => setSprintId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
                    >
                      <option value="">None</option>
                      {sprints.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-[#66635F] mb-1.5">
                    Prompt Input &amp; Specification <span className="text-[#A61C1C]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the business scenario, user story, architecture decision, or code snippet..."
                    className="w-full px-3 py-2 rounded-[3px] bg-[#FFFFFF] border border-[#DEDCD6] text-xs text-[#151515] placeholder-[#99958F] focus:outline-none focus:border-[#151515] font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#99958F] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#151515]" />
                    Offline Heuristic Engine Active
                  </span>

                  <button
                    type="submit"
                    disabled={generating || !prompt.trim()}
                    className="px-5 py-2 rounded-[3px] bg-[#151515] hover:bg-[#2A2A2A] disabled:opacity-50 text-xs font-medium tracking-wide uppercase text-white transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3 h-3" />
                    <span>{generating ? 'Synthesizing...' : 'Synthesize Insights'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Generated AI Response & Historical Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Generated Output Card */}
            <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE5]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F]">
                    SYNTHESIS OUTPUT
                  </span>
                </div>

                {generatedResult?.suggestionText && (
                  <button
                    onClick={() => handleCopy(generatedResult.suggestionText)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#F7F6F2] hover:bg-[#ECEAE5] border border-[#DEDCD6] text-xs font-medium text-[#151515] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-[#151515]" />
                        <span className="text-[#151515]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#66635F]" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {generating ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-6 h-6 rounded-full border-2 border-[#151515] border-t-transparent animate-spin mx-auto"></div>
                  <p className="text-xs text-[#99958F]">
                    Synthesizing domain intelligence...
                  </p>
                </div>
              ) : generatedResult?.suggestionText ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#99958F] bg-[#F7F6F2] p-2.5 rounded-[2px] border border-[#ECEAE5]">
                    <span>Type: <span className="text-[#151515] font-semibold">{generatedResult.suggestionType || genType}</span></span>
                    <span>Tokens: <span className="text-[#151515] font-semibold">~184</span></span>
                    <span>Status: <span className="text-[#151515] font-semibold">SUCCESS</span></span>
                  </div>

                  <div className="prose prose-neutral max-w-none text-[#151515] text-xs leading-relaxed font-sans font-light space-y-3 bg-[#F7F6F2] p-5 rounded-[2px] border border-[#ECEAE5]">
                    <ReactMarkdown>{generatedResult.suggestionText}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#F7F6F2] text-[#151515] border border-[#ECEAE5] flex items-center justify-center mx-auto">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-normal text-[#151515]">Awaiting Prompt Execution</h4>
                  <p className="text-xs text-[#99958F] max-w-sm mx-auto">
                    Select a domain assistant, apply a preset prompt or type custom criteria to generate SDLC insights.
                  </p>
                </div>
              )}
            </div>

            {/* Historical Suggestions Feed */}
            {historySuggestions.length > 0 && (
              <div className="p-6 rounded-[3px] bg-[#FFFFFF] border border-[#ECEAE5] space-y-3">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#99958F] block">
                  RECENT SUGGESTIONS &bull; {selectedAssistant?.name || 'ASSISTANT'}
                </span>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {historySuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => setGeneratedResult(sug)}
                      className="p-3 rounded-[2px] bg-[#F7F6F2] border border-[#ECEAE5] hover:border-[#DEDCD6] transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-medium text-[#151515] uppercase font-mono">
                          {sug.suggestionType || 'INSIGHT'}
                        </span>
                        <span className="text-[#99958F] font-mono text-[9px]">
                          {sug.createdAt ? new Date(sug.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-[#66635F] line-clamp-2">
                        {sug.suggestionText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiStudioPage;
