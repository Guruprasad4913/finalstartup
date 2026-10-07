"use client";

import React, { useState } from "react";
import {
  X,
  Coins,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Globe,
  Lock,
  Mail,
  Zap,
} from "lucide-react";
import { StartupProject, User, InvestmentFundingAsk } from "@/types";
import { saveProjectToVault } from "@/lib/storage";

interface SeekFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StartupProject | null;
  currentUser?: User | null;
  onProjectUpdated?: (updatedProject: StartupProject) => void;
}

export const SeekFundingModal: React.FC<SeekFundingModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onProjectUpdated,
}) => {
  const [seekingFunding, setSeekingFunding] = useState<boolean>(
    project?.isPublishedForInvestors ?? project?.fundingAsk?.seekingFunding ?? true
  );

  const [targetAmount, setTargetAmount] = useState<string>(
    project?.fundingAsk?.targetFundingAmount ||
      (project?.founderProfile?.budget ? project.founderProfile.budget.split(" ")[0] : "$50,000")
  );

  const [equityOffered, setEquityOffered] = useState<string>(
    project?.fundingAsk?.equityOffered || "7.5% Equity (SAFE Note)"
  );

  const [fundingStage, setFundingStage] = useState<"Pre-Seed" | "Angel Seed" | "Early Venture" | "Growth">(
    project?.fundingAsk?.fundingStage || "Pre-Seed"
  );

  const [useOfFunds, setUseOfFunds] = useState<string>(
    project?.fundingAsk?.useOfFunds ||
      "Develop 4-week MoSCoW MVP, deploy cloud architecture on " +
        (project?.feasibility?.cloudArchitecture?.recommendedProvider || "AWS") +
        ", and execute customer pilot."
  );

  const [pitchNotes, setPitchNotes] = useState<string>(
    project?.fundingAsk?.pitchNotes ||
      "Validated with " +
        (project?.feasibility?.overallScore || 85) +
        "/100 institutional score and " +
        (project?.validation?.tam?.value || "$10B+") +
        " addressable market. Seeking value-add angel or syndicate lead."
  );

  const [contactEmail, setContactEmail] = useState<string>(
    project?.fundingAsk?.contactEmail ||
      project?.founderProfile?.founderEmail ||
      currentUser?.email ||
      ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen || !project) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const fundingAsk: InvestmentFundingAsk = {
        seekingFunding,
        targetFundingAmount: targetAmount.trim() || "$50,000",
        equityOffered: equityOffered.trim() || "7.5% Equity",
        fundingStage,
        useOfFunds: useOfFunds.trim(),
        pitchNotes: pitchNotes.trim(),
        contactEmail: contactEmail.trim(),
        publishedAt: seekingFunding ? new Date().toISOString() : undefined,
      };

      const updatedProject: StartupProject = {
        ...project,
        isPublishedForInvestors: seekingFunding,
        fundingAsk,
      };

      await saveProjectToVault(updatedProject, currentUser);

      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to save funding ask", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Launch Funding &amp; Investor Visibility
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Investor Hub
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Venture: <strong className="text-white">{project.selectedIdea.name}</strong> · Founder:{" "}
                <span className="text-slate-200">{project.username || currentUser?.username}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5 text-left">
          {/* Permission Toggle: Allow on Investor Page */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              seekingFunding
                ? "bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                : "bg-slate-950 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    Display on Investor Dealflow Page
                  </span>
                  {seekingFunding ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>Live for Investors</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Private (Only You)</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  Allow angel investors and venture stakeholders to view this validated startup idea and propose investment term sheets.
                </p>
              </div>

              {/* Styled Switch */}
              <button
                type="button"
                onClick={() => setSeekingFunding(!seekingFunding)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  seekingFunding ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    seekingFunding ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {seekingFunding ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Target Funding Amount & Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Target Funding Needed to Launch *
                  </label>
                  <span className="text-[11px] text-slate-400">Choose preset or enter custom amount</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. $50,000 or ₹25,00,000"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {["$25,000", "$50,000", "$100,000", "$250,000", "₹15,00,000", "₹25,00,000", "₹50,00,000"].map(
                    (amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTargetAmount(amt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          targetAmount === amt
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                        }`}
                      >
                        {amt}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Equity Offered & Target Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Equity Offered / Instrument *
                  </label>
                  <input
                    type="text"
                    required
                    value={equityOffered}
                    onChange={(e) => setEquityOffered(e.target.value)}
                    placeholder="e.g. 7.5% Equity or SAFE Note ($4M Cap)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {["5% Equity", "7.5% Equity", "10% Equity", "SAFE Note"].map((eq) => (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => setEquityOffered(eq)}
                        className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Funding Stage
                  </label>
                  <select
                    value={fundingStage}
                    onChange={(e: any) => setFundingStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pre-Seed">Pre-Seed (Idea / MVP Launch)</option>
                    <option value="Angel Seed">Angel Seed (Pilot &amp; Traction)</option>
                    <option value="Early Venture">Early Venture (Go-to-Market Scale)</option>
                    <option value="Growth">Growth (Expansion)</option>
                  </select>
                </div>
              </div>

              {/* Primary Use of Funds */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  How will you use this funding to launch? *
                </label>
                <textarea
                  rows={2}
                  required
                  value={useOfFunds}
                  onChange={(e) => setUseOfFunds(e.target.value)}
                  placeholder="e.g., Develop 4-week MoSCoW MVP, deploy cloud architecture on AWS, and execute customer pilot."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Founder Pitch Message to Investors */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Founder Pitch Note / Strategic Ask
                </label>
                <textarea
                  rows={2}
                  value={pitchNotes}
                  onChange={(e) => setPitchNotes(e.target.value)}
                  placeholder="Highlight your moat, why now catalyst, or what strategic value-add you seek from an investor..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Founder Direct Contact Email (for Term Sheets)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="founder@startupgen.ai"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live Preview of Investor Card Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Investor Dealflow Preview:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Seeking {targetAmount} · {equityOffered} ({fundingStage})
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Viability: <strong className="text-white">{project.feasibility?.overallScore || 85}/100</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Lock className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-bold text-slate-300">Idea is Set to Private</div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                This startup concept will remain strictly confidential in your personal vault. Outside angel investors and venture funds will not see it in the dealflow pipeline.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full founder control at all times</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving Settings...</span>
                ) : (
                  <>
                    <span>{seekingFunding ? "Save & Publish to Investors" : "Save as Private"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
