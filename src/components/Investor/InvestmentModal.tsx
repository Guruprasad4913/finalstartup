"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Coins,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  Calculator,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  FileText,
  Copy,
  Clock,
  Briefcase,
  Zap,
} from "lucide-react";
import { StartupProject, InvestmentCommitment, User } from "@/types";
import { saveLocalCommitment } from "@/lib/curated-deals";
import { saveFounderNotification } from "@/lib/notifications";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StartupProject | null;
  currentUser?: User | null;
  onCommitmentSuccess?: (commitment: InvestmentCommitment) => void;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onCommitmentSuccess,
}) => {
  // Default directly to Express Interest / Commit so the investor can act immediately
  const [activeTab, setActiveTab] = useState<"commit" | "calculator">("commit");

  // Check size & valuation
  const [checkSizeNum, setCheckSizeNum] = useState<number>(50000);
  const [preMoneyValuationNum, setPreMoneyValuationNum] = useState<number>(5000000);
  const [instrument, setInstrument] = useState<
    "SAFE Note" | "Convertible Note" | "Priced Preferred Round" | "Revenue Share / Debt"
  >("SAFE Note");

  // Commitment Form inputs
  const [investorName, setInvestorName] = useState("");
  const [investorEmail, setInvestorEmail] = useState("");
  const [investorFirm, setInvestorFirm] = useState("");
  const [investorStage, setInvestorStage] = useState<
    "Screening" | "Due Diligence" | "Partner Meeting" | "Term Sheet Issued" | "Committed / Signed"
  >("Due Diligence");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCommitment, setSubmittedCommitment] = useState<InvestmentCommitment | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize and synchronize check size with founder's target ask & investor info
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name || currentUser.username) {
        setInvestorName(currentUser.name || currentUser.username);
      }
      if (currentUser.email) {
        setInvestorEmail(currentUser.email);
      }
      if (currentUser.investorProfile?.firmOrSyndicate) {
        setInvestorFirm(currentUser.investorProfile.firmOrSyndicate);
      } else if (currentUser.investorProfile?.investorType) {
        setInvestorFirm(currentUser.investorProfile.investorType);
      }
    } else {
      setInvestorName("Devon Vance");
      setInvestorEmail("devon.vance@angelventures.io");
      setInvestorFirm("Vance Angel Syndicate");
    }

    if (project?.fundingAsk?.targetFundingAmount) {
      const parsed = parseFloat(project.fundingAsk.targetFundingAmount.replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) {
        setCheckSizeNum(parsed >= 25000 ? Math.min(parsed, 100000) : parsed);
      }
    }

    if (project?.fundingAsk?.pitchNotes) {
      setNotes(`Interested in founder ask: "${project.fundingAsk.pitchNotes}". Would like to schedule an intro discussion.`);
    } else {
      setNotes("Interested in your 14-stage validation report, unit economics, and discussing seed participation.");
    }
  }, [project, currentUser]);

  // Derived financial computations
  const math = useMemo(() => {
    const postMoney = preMoneyValuationNum + checkSizeNum;
    const ownershipPct = postMoney > 0 ? (checkSizeNum / postMoney) * 100 : 0;
    const returnAt5x = checkSizeNum * 5;
    const returnAt10x = checkSizeNum * 10;
    const postDilutionOwnership = ownershipPct * 0.85;

    // Estimated monthly burn of MVP
    const mvpCostStr = project?.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp || "$300";
    const mvpCostNum = parseFloat(mvpCostStr.replace(/[^0-9.]/g, "")) || 400;
    const monthsOfRunwayFunded = Math.min(Math.round(checkSizeNum / (mvpCostNum * 4)), 36);

    return {
      postMoney,
      ownershipPct: ownershipPct.toFixed(2),
      returnAt5x,
      returnAt10x,
      postDilutionOwnership: postDilutionOwnership.toFixed(2),
      monthsOfRunwayFunded,
    };
  }, [checkSizeNum, preMoneyValuationNum, project]);

  if (!isOpen || !project) return null;

  // Founder's funding ask (fallback to realistic institutional seed if not set)
  const fundingAsk = project.fundingAsk?.seekingFunding
    ? project.fundingAsk
    : {
        seekingFunding: true,
        targetFundingAmount: "$250,000",
        equityOffered: "10% Equity",
        fundingStage: "Pre-Seed (SAFE)",
        useOfFunds: "MVP engineering, initial 1,000 customer acquisition, and 18-month cloud runway",
        pitchNotes: "Seeking institutional pre-seed backing to launch MVP sprint",
      };

  const founderTargetNum = parseFloat(fundingAsk.targetFundingAmount.replace(/[^0-9.]/g, "")) || 250000;

  const handleCommitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !investorEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const commitment: InvestmentCommitment = {
        id: `cmt-${Date.now()}`,
        projectId: project.id,
        projectName: project.selectedIdea.name,
        projectDomain: project.selectedIdea.domain,
        founderName: project.username || "Founder",
        founderEmail: project.founderProfile?.founderEmail || "founder@startupgen.ai",
        investorName: investorName.trim(),
        investorEmail: investorEmail.trim(),
        investorFirm: investorFirm.trim() || "Accredited Investor",
        checkSize: `$${checkSizeNum.toLocaleString()}`,
        instrument,
        valuationCap: `$${preMoneyValuationNum.toLocaleString()}`,
        stage: investorStage,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      saveLocalCommitment(commitment);

      // Create instant notification for the startup's founder
      saveFounderNotification({
        projectId: project.id,
        projectName: project.selectedIdea.name,
        projectDomain: project.selectedIdea.domain,
        founderUsername: project.username || "Guruprasad",
        founderEmail: project.founderProfile?.founderEmail,
        investorName: investorName.trim(),
        investorEmail: investorEmail.trim(),
        investorFirm: investorFirm.trim() || "Accredited Investor",
        checkSize: `$${checkSizeNum.toLocaleString()}`,
        instrument,
        valuationCap: `$${preMoneyValuationNum.toLocaleString()}`,
        notes: notes.trim(),
      });

      setSubmittedCommitment(commitment);
      if (onCommitmentSuccess) {
        onCommitmentSuccess(commitment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySummary = () => {
    if (!submittedCommitment) return;
    const text = `Investment Interest for ${submittedCommitment.projectName}:
Check Size: ${submittedCommitment.checkSize}
Instrument: ${submittedCommitment.instrument} (Cap: ${submittedCommitment.valuationCap})
Investor: ${submittedCommitment.investorName} (${submittedCommitment.investorFirm})
Email: ${submittedCommitment.investorEmail}
Status: ${submittedCommitment.stage}
Notes: ${submittedCommitment.notes}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {project.selectedIdea.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {project.selectedIdea.domain}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                Founder: <strong className="text-white">{project.username || "Verified Founder"}</strong> · Viability Score:{" "}
                <span className="text-emerald-400 font-bold">
                  {project.feasibility?.overallScore || 85}/100 ({project.feasibility?.verdict || "Strong Go"})
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {!submittedCommitment && (
          <div className="px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("commit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "commit"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Express Interest / Soft Commit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "calculator"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Valuation &amp; Equity Simulator</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Prominent Founder Capital Requirement Card */}
          {!submittedCommitment && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-teal-950/70 border border-emerald-500/50 text-left space-y-2.5 shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs uppercase font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  FOUNDER&apos;S CAPITAL REQUIREMENT
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 text-xs font-black border border-emerald-400/40">
                  Target Ask: {fundingAsk.targetFundingAmount} ({fundingAsk.equityOffered})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1.5 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Funding Round:</span>
                  <span className="text-white font-bold">{fundingAsk.fundingStage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Use of Funds:</span>
                  <span className="text-slate-200 font-medium line-clamp-1">{fundingAsk.useOfFunds}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Direct Founder Contact:</span>
                  <span className="text-emerald-300 font-mono font-medium">{project.founderProfile?.founderEmail || "founder@startupgen.ai"}</span>
                </div>
              </div>
            </div>
          )}

          {submittedCommitment ? (
            /* Confirmation State */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Investment Interest Registered!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your soft commitment of <strong className="text-emerald-300 font-bold">{submittedCommitment.checkSize}</strong> for{" "}
                  <strong className="text-white">{submittedCommitment.projectName}</strong> has been logged and shared.
                </p>
              </div>

              {/* Summary Receipt Box */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-left space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Startup Venture</span>
                  <span className="font-bold text-white">{submittedCommitment.projectName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Proposed Check Size</span>
                  <span className="font-bold text-emerald-400">{submittedCommitment.checkSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Instrument &amp; Cap</span>
                  <span className="font-semibold text-slate-200">
                    {submittedCommitment.instrument} (Cap: {submittedCommitment.valuationCap})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Investor Representative</span>
                  <span className="font-semibold text-slate-200">
                    {submittedCommitment.investorName} ({submittedCommitment.investorFirm})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Pipeline Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-400/30">
                    {submittedCommitment.stage}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={copySummary}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied Terms!" : "Copy Summary"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  Return to Dealflow
                </button>
              </div>
            </div>
          ) : activeTab === "commit" ? (
            /* Streamlined Express Interest Form */
            <form onSubmit={handleCommitSubmit} className="space-y-4 text-left">
              {/* Check Size Quick Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Investment Check Size</span>
                  </label>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    ${checkSizeNum.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[25000, 50000, 100000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCheckSizeNum(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        checkSizeNum === amt
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400"
                          : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      ${amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCheckSizeNum(founderTargetNum)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      checkSizeNum === founderTargetNum
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-300 shadow-md"
                        : "bg-slate-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30"
                    }`}
                  >
                    Full Founder Target (${founderTargetNum >= 1000 ? `${founderTargetNum / 1000}k` : founderTargetNum})
                  </button>
                </div>
              </div>

              {/* Instrument & Pre-Money Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Investment Vehicle / Instrument
                  </label>
                  <select
                    value={instrument}
                    onChange={(e: any) => setInstrument(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="SAFE Note">SAFE Note (Post-Money Valuation Cap)</option>
                    <option value="Convertible Note">Convertible Note (20% Discount)</option>
                    <option value="Priced Preferred Round">Priced Preferred Equity Round</option>
                    <option value="Revenue Share / Debt">Revenue Share / Venture Debt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pipeline Status / Stage
                  </label>
                  <select
                    value={investorStage}
                    onChange={(e: any) => setInvestorStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Due Diligence">1. Due Diligence / Request Meeting</option>
                    <option value="Screening">2. Initial Screening Review</option>
                    <option value="Partner Meeting">3. Partner Pitch Call</option>
                    <option value="Term Sheet Issued">4. Issue Preliminary Term Sheet</option>
                    <option value="Committed / Signed">5. Full Soft Commitment</option>
                  </select>
                </div>
              </div>

              {/* Investor Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="Devon Vance"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="devon@vancecapital.io"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Syndicate / Fund
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={investorFirm}
                      onChange={(e) => setInvestorFirm(e.target.value)}
                      placeholder="Vance Angel Syndicate"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Note to Founder */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message / Value-Add Note for Founder
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the founder about your syndicate, check size interest, and relevant domain expertise..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidential Due Diligence Telemetry</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Interest...</span>
                      </>
                    ) : (
                      <>
                        <span>🤝 Submit Interest to Founder</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Valuation & Equity Calculator View */
            <div className="space-y-5 text-left">
              {/* Sliders & Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                {/* Check Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">Investment Check Size</label>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ${checkSizeNum.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={500000}
                    step={5000}
                    value={checkSizeNum}
                    onChange={(e) => setCheckSizeNum(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$10k Angel</span>
                    <span>$100k Seed</span>
                    <span>$500k Syndicate</span>
                  </div>
                </div>

                {/* Pre-Money Valuation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">Pre-Money Valuation Cap</label>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      ${preMoneyValuationNum.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={25000000}
                    step={250000}
                    value={preMoneyValuationNum}
                    onChange={(e) => setPreMoneyValuationNum(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$1M Early</span>
                    <span>$5M Normal</span>
                    <span>$25M Series A</span>
                  </div>
                </div>
              </div>

              {/* Key Output Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 text-left">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Equity Stake
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {math.ownershipPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Post-money: ${(math.postMoney / 1000000).toFixed(2)}M
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/30 text-left">
                  <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    5x Exit Yield
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    ${(math.returnAt5x / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">5.0x MOIC Multiple</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/30 text-left">
                  <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                    10x Exit Return
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    ${(math.returnAt10x / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">10.0x Return on Capital</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/30 text-left">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Founder Runway
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    +{math.monthsOfRunwayFunded} Mo
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Funded from Check</div>
                </div>
              </div>

              {/* Action to switch to commit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("commit")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply Terms &amp; Submit Interest →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
