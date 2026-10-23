"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, ArrowRight, Check, Zap, Target, Shield, Clock, TrendingUp, PenTool, X, Plus, RefreshCw, Lightbulb } from "lucide-react";
import { StartupIdea } from "@/types";

interface StepIdeaSelectionProps {
  ideas: StartupIdea[];
  onSelectIdea: (idea: StartupIdea) => void;
  onBack: () => void;
  isValidating: boolean;
  onGenerateMore?: () => Promise<void>;
  isGeneratingMore?: boolean;
}

export const StepIdeaSelection: React.FC<StepIdeaSelectionProps> = ({
  ideas: initialIdeas,
  onSelectIdea,
  onBack,
  isValidating,
  onGenerateMore,
  isGeneratingMore = false,
}) => {
  const [ideas, setIdeas] = useState<StartupIdea[]>(initialIdeas);
  const [selectedId, setSelectedId] = useState<string>(initialIdeas[0]?.id || "");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state whenever parent updates initialIdeas (e.g. after generating more plans)
  useEffect(() => {
    if (initialIdeas && initialIdeas.length > 0) {
      setIdeas(initialIdeas);
      // If newly added plans exist, select the first fresh plan and show feedback banner
      const newlyAdded = initialIdeas.find((i) => i.isNew);
      if (newlyAdded && newlyAdded.id !== selectedId) {
        setSelectedId(newlyAdded.id);
        setNotification(`✨ Generated 3 new startup plans! Now showing ${initialIdeas.length} plans.`);
        const timer = setTimeout(() => setNotification(null), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [initialIdeas]);

  // Custom concept form state
  const [customName, setCustomName] = useState("");
  const [customTagline, setCustomTagline] = useState("");
  const [customDomain, setCustomDomain] = useState(initialIdeas[0]?.domain || "Commercial Venture");
  const [customProblem, setCustomProblem] = useState("");
  const [customSolution, setCustomSolution] = useState("");
  const [customPersona, setCustomPersona] = useState("Target Customer & Buyer");

  const currentSelectedIdea = ideas.find((i) => i.id === selectedId) || ideas[0];

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customProblem.trim()) return;

    const domain = customDomain.trim() || initialIdeas[0]?.domain || "Commercial Venture";

    const newIdea: StartupIdea = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      tagline: customTagline.trim() || `Specialized Operational Venture for ${domain}`,
      domain: domain,
      problemStatement: customProblem.trim(),
      solution: customSolution.trim() || `A focused operational solution delivering turnkey value and solving: ${customProblem.substring(0, 75)}...`,
      targetPersona: {
        title: customPersona.trim() || "Target Buyers & Operational Decision Makers",
        painPoints: ["High operational overhead", "Lack of transparent alternatives", "Inconsistent supplier quality"],
        willingnessToPay: "₹5,000 - ₹35,000 / month or per order",
      },
      whyNow: "Changing industry dynamics and rising customer preference for direct, verified, and specialized service delivery.",
      innovationMoat: "Agile localized execution and specialized domain expertise.",
      tags: [domain, "Custom Plan", "High Impact"],
      initialFeasibilityScore: 92,
    };

    setIdeas([newIdea, ...ideas]);
    setSelectedId(newIdea.id);
    setIsCustomModalOpen(false);
    // Reset fields
    setCustomName("");
    setCustomTagline("");
    setCustomProblem("");
    setCustomSolution("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Step 2 of 6: AI Concept Selection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Select Your Startup Concept to Validate
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our AI engine generated {ideas.length} tailored opportunities. Choose one to perform deep real-time API market scans &amp; cloud blueprinting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {onGenerateMore && (
            <button
              id="btn-generate-more-plans-header"
              type="button"
              onClick={() => onGenerateMore()}
              disabled={isGeneratingMore || isValidating}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition text-xs font-bold flex items-center gap-2 shadow-sm border border-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingMore ? "animate-spin text-white" : "group-hover:rotate-180 transition-transform duration-500 text-white"}`} />
              <span>{isGeneratingMore ? "Generating More Plans..." : "Generate More Plans"}</span>
            </button>
          )}

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white transition text-xs font-bold flex items-center gap-1.5 shadow-sm border border-[#12224d] cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>+ Enter Custom Idea</span>
          </button>

          <button
            onClick={onBack}
            disabled={isValidating}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Adjust Inputs</span>
          </button>
        </div>
      </div>

      {/* Explainer / How It Works Banner (Clean White Card) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 mt-0.5 flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-500" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-900 block text-sm">How to Choose Your Concept</span>
          <p className="text-slate-600 leading-relaxed">
            Click any idea card below to review its problem statement, proposed solution, and initial viability score. The selected idea will be deep-validated across live market APIs, competitor battlecards, and cloud infrastructure.
          </p>
        </div>
      </div>

      {/* Toast Notification for new ideas */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-emerald-100 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Idea Grid (Clean White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ideas.map((idea) => {
          const isSelected = idea.id === selectedId;
          return (
            <div
              key={idea.id}
              onClick={() => setSelectedId(idea.id)}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20 -translate-y-1"
                  : "bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-3.5 right-5 px-3 py-1 rounded-full bg-[#243d78] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected Concept
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                      {idea.domain}
                    </span>
                    {idea.businessType && (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {idea.businessType}
                      </span>
                    )}
                    {idea.isNew && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        Fresh Plan
                      </span>
                    )}
                  </div>
                  {idea.initialFeasibilityScore && (
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      {idea.initialFeasibilityScore}/100
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition">
                    {idea.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed line-clamp-2">
                    {idea.tagline}
                  </p>
                </div>

                {/* Problem & Solution Mini */}
                <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-blue-700 font-bold block text-[10px] uppercase tracking-wider">Problem</span>
                    <p className="text-slate-800 line-clamp-2 mt-0.5 leading-relaxed">{idea.problemStatement}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-cyan-800 font-bold block text-[10px] uppercase tracking-wider">Solution Strategy</span>
                    <p className="text-slate-800 line-clamp-2 mt-0.5 leading-relaxed">{idea.solution}</p>
                  </div>
                </div>

                {/* Target persona preview */}
                <div className="pt-2 border-t border-slate-200 text-xs flex items-center gap-2 text-slate-500">
                  <Target className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate font-medium text-slate-800">{idea.targetPersona.title}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-1.5">
                {idea.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* "Need Different Plans?" CTA Banner */}
      {onGenerateMore && (
        <div className="rounded-3xl p-6 sm:p-7 border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700 shadow-sm mt-0.5">
              <Lightbulb className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  Alternative Angles &amp; Niches
                </span>
                <span className="text-xs text-slate-500">
                  {ideas.length} plans available
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Need a different plan than the {ideas.length <= 3 ? "3" : ideas.length} mentioned?
              </h4>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Looking for another angle, different target audience, or alternative business model? Click below to generate 3 more diverse plans tailored to your profile.
              </p>
            </div>
          </div>

          <button
            id="btn-generate-more-plans-cta"
            type="button"
            onClick={() => onGenerateMore()}
            disabled={isGeneratingMore || isValidating}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md border border-emerald-700 transition flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingMore ? "animate-spin text-white" : ""}`} />
            <span>{isGeneratingMore ? "Generating 3 More Plans..." : "Generate 3 More Plans"}</span>
          </button>
        </div>
      )}

      {/* Selected Idea Detailed Preview Drawer */}
      {currentSelectedIdea && (
        <div className="rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5 bg-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" /> Concept Blueprint Selected
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{currentSelectedIdea.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{currentSelectedIdea.tagline}</p>
            </div>
            <button
              onClick={() => onSelectIdea(currentSelectedIdea)}
              disabled={isValidating}
              className="px-7 py-3.5 rounded-2xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-bold text-xs sm:text-sm shadow-md border border-[#12224d] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validating Market &amp; Cloud Blueprint...</span>
                </>
              ) : (
                <>
                  <span>Deep Validate This Concept</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Target Buyer Persona
              </span>
              <p className="text-slate-900 font-semibold text-sm">{currentSelectedIdea.targetPersona.title}</p>
              <div className="text-slate-500 pt-1 border-t border-slate-200">
                Willingness to Pay: <strong className="text-emerald-700 font-mono">{currentSelectedIdea.targetPersona.willingnessToPay}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Why Now / Timing Catalyst
              </span>
              <p className="text-slate-700 leading-relaxed">{currentSelectedIdea.whyNow}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" /> Innovation Moat
              </span>
              <p className="text-slate-700 leading-relaxed">{currentSelectedIdea.innovationMoat}</p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Custom Concept Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 bg-white shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Enter Custom Startup Concept</h3>
                  <p className="text-[11px] text-slate-500">Add your bespoke venture idea into the AI validation funnel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomIdea} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">Startup Name *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. LedgerPulse AI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 shadow-sm transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">Domain / Vertical</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. Food & Beverage, D2C, Farming, Healthcare, SaaS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 shadow-sm transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Tagline / One-Liner</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Specialty single-origin roastery, or sustainable bamboo packaging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 shadow-sm transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Customer Problem Statement *</label>
                <textarea
                  rows={2}
                  required
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  placeholder="What acute customer or market problem are you solving?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 shadow-sm transition resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Business &amp; Value Solution *</label>
                <textarea
                  rows={2}
                  value={customSolution}
                  onChange={(e) => setCustomSolution(e.target.value)}
                  placeholder="How does your product, service, or business model operate?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 shadow-sm transition resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-semibold shadow-md border border-[#12224d] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Concept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
