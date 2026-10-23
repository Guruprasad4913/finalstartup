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
  IndianRupee,
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

export const formatRupees = (num: number) => "₹" + num.toLocaleString("en-IN");
export const formatRupeesCompact = (num: number) => {
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const l = num / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(0)}k`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
};

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

  // Check size & valuation in Indian Rupees (₹)
  const [checkSizeNum, setCheckSizeNum] = useState<number>(2500000);
  const [preMoneyValuationNum, setPreMoneyValuationNum] = useState<number>(50000000);
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
        setCheckSizeNum(parsed >= 500000 ? Math.min(parsed, 10000000) : parsed);
      }
    }

    if (project?.fundingAsk?.pitchNotes) {
      setNotes(`Interested in founder ask: "${project.fundingAsk.pitchNotes}". Would like to schedule an intro discussion.`);
    } else {
      setNotes("Interested in your 14-stage validation report, unit economics, and discussing seed participation in rupees.");
    }
  }, [project, currentUser]);

  // Derived financial computations in Rupees
  const math = useMemo(() => {
    const postMoney = preMoneyValuationNum + checkSizeNum;
    const ownershipPct = postMoney > 0 ? (checkSizeNum / postMoney) * 100 : 0;
    const returnAt5x = checkSizeNum * 5;
    const returnAt10x = checkSizeNum * 10;
    const postDilutionOwnership = ownershipPct * 0.85;

    // Estimated monthly burn of MVP
    const mvpCostStr = project?.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp || "₹25,000";
    const mvpCostNum = parseFloat(mvpCostStr.replace(/[^0-9.]/g, "")) || 25000;
    const monthsOfRunwayFunded = Math.min(Math.round(checkSizeNum / (mvpCostNum * 3)), 36);

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

  // Founder's funding ask (fallback to realistic institutional seed in Rupees if not set)
  const fundingAsk = project.fundingAsk?.seekingFunding
    ? project.fundingAsk
    : {
        seekingFunding: true,
        targetFundingAmount: "₹50,00,000",
        equityOffered: "10% Equity",
        fundingStage: "Pre-Seed (SAFE)",
        useOfFunds: "MVP engineering, initial 1,000 customer acquisition, and 18-month cloud runway",
        pitchNotes: "Seeking institutional pre-seed backing to launch MVP sprint",
      };

  const founderTargetNum = parseFloat(fundingAsk.targetFundingAmount.replace(/[^0-9.]/g, "")) || 5000000;

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
        checkSize: formatRupees(checkSizeNum),
        instrument,
        valuationCap: formatRupees(preMoneyValuationNum),
        stage: investorStage,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      saveLocalCommitment(commitment);

      // Create instant notification for the startup's founder in Rupees
      saveFounderNotification({
        projectId: project.id,
        projectName: project.selectedIdea.name,
        projectDomain: project.selectedIdea.domain,
        founderUsername: project.username || "Guruprasad",
        founderEmail: project.founderProfile?.founderEmail,
        investorName: investorName.trim(),
        investorEmail: investorEmail.trim(),
        investorFirm: investorFirm.trim() || "Accredited Investor",
        checkSize: formatRupees(checkSizeNum),
        instrument,
        valuationCap: formatRupees(preMoneyValuationNum),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header (Karnataka Royal Blue Banner) */}
        <div className="p-5 sm:p-6 border-b border-[#1b2f5d] bg-gradient-to-b from-[#4d669a] via-[#243d78] to-[#12224d] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-sm">
              <Coins className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {project.selectedIdea.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                  {project.selectedIdea.domain}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 line-clamp-1">
                Founder: <strong className="text-white">{project.username || "Verified Founder"}</strong> · Viability Score:{" "}
                <span className="text-emerald-300 font-bold">
                  {project.feasibility?.overallScore || 85}/100 ({project.feasibility?.verdict || "Strong Go"})
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {!submittedCommitment && (
          <div className="px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("commit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
                activeTab === "commit"
                  ? "bg-[#243d78] text-white border border-[#12224d]"
                  : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Express Interest / Soft Commit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
                activeTab === "calculator"
                  ? "bg-[#243d78] text-white border border-[#12224d]"
                  : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs uppercase font-extrabold text-[#243d78] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#243d78] fill-[#243d78]" />
                  FOUNDER&apos;S CAPITAL REQUIREMENT
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#243d78] text-xs font-black border border-blue-200">
                  Target Ask: {fundingAsk.targetFundingAmount} ({fundingAsk.equityOffered})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1.5 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Funding Round:</span>
                  <span className="text-slate-900 font-bold">{fundingAsk.fundingStage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Use of Funds:</span>
                  <span className="text-slate-700 font-medium line-clamp-1">{fundingAsk.useOfFunds}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Direct Founder Contact:</span>
                  <span className="text-[#243d78] font-mono font-medium">{project.founderProfile?.founderEmail || "founder@startupgen.ai"}</span>
                </div>
              </div>
            </div>
          )}

          {submittedCommitment ? (
            /* Confirmation State */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Investment Interest Registered!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your soft commitment of <strong className="text-emerald-700 font-bold">{submittedCommitment.checkSize}</strong> for{" "}
                  <strong className="text-slate-900">{submittedCommitment.projectName}</strong> has been logged and shared.
                </p>
              </div>

              {/* Summary Receipt Box */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Startup Venture</span>
                  <span className="font-bold text-slate-900">{submittedCommitment.projectName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Proposed Check Size</span>
                  <span className="font-bold text-emerald-700">{submittedCommitment.checkSize}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Instrument &amp; Cap</span>
                  <span className="font-semibold text-slate-800">
                    {submittedCommitment.instrument} (Cap: {submittedCommitment.valuationCap})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Investor Representative</span>
                  <span className="font-semibold text-slate-800">
                    {submittedCommitment.investorName} ({submittedCommitment.investorFirm})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pipeline Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#243d78] font-bold text-[10px] border border-blue-200">
                    {submittedCommitment.stage}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={copySummary}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied Terms!" : "Copy Summary"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-bold shadow-sm border border-[#12224d] transition cursor-pointer"
                >
                  Return to Dealflow
                </button>
              </div>
            </div>
          ) : activeTab === "commit" ? (
            /* Streamlined Express Interest Form */
            <form onSubmit={handleCommitSubmit} className="space-y-4 text-left">
              {/* Check Size Quick Chips (Indian Rupees) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select Investment Check Size (in ₹ Rupees)</span>
                  </label>
                  <span className="font-mono font-extrabold text-emerald-700 text-sm">
                    {formatRupees(checkSizeNum)}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCheckSizeNum(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                        checkSizeNum === amt
                          ? "bg-[#243d78] text-white border border-[#12224d]"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {formatRupeesCompact(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCheckSizeNum(founderTargetNum)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                      checkSizeNum === founderTargetNum
                        ? "bg-[#243d78] text-white border border-[#12224d]"
                        : "bg-blue-50 border border-blue-200 text-[#243d78] hover:bg-blue-100"
                    }`}
                  >
                    Full Founder Target ({formatRupeesCompact(founderTargetNum)})
                  </button>
                </div>
              </div>

              {/* Instrument & Pre-Money Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Investment Vehicle / Instrument
                  </label>
                  <select
                    value={instrument}
                    onChange={(e: any) => setInstrument(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
                  >
                    <option value="SAFE Note">SAFE Note (Post-Money Valuation Cap)</option>
                    <option value="Convertible Note">Convertible Note (20% Discount)</option>
                    <option value="Priced Preferred Round">Priced Preferred Equity Round</option>
                    <option value="Revenue Share / Debt">Revenue Share / Venture Debt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pipeline Status / Stage
                  </label>
                  <select
                    value={investorStage}
                    onChange={(e: any) => setInvestorStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="Devon Vance"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="devon@vancecapital.io"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Syndicate / Fund
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={investorFirm}
                      onChange={(e) => setInvestorFirm(e.target.value)}
                      placeholder="Vance Angel Syndicate"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Note to Founder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message / Value-Add Note for Founder
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the founder about your syndicate, check size interest, and relevant domain expertise..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] transition resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confidential Due Diligence Telemetry</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-bold text-xs shadow-sm border border-[#12224d] transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                {/* Check Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Investment Check Size (in ₹)</label>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {formatRupees(checkSizeNum)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={25000000}
                    step={250000}
                    value={checkSizeNum}
                    onChange={(e) => setCheckSizeNum(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#243d78]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹5L Angel</span>
                    <span>₹50L Seed</span>
                    <span>₹2.5 Cr Syndicate</span>
                  </div>
                </div>

                {/* Pre-Money Valuation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Pre-Money Valuation Cap (in ₹)</label>
                    <span className="font-mono font-bold text-[#243d78] text-sm">
                      {formatRupees(preMoneyValuationNum)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000000}
                    max={250000000}
                    step={2500000}
                    value={preMoneyValuationNum}
                    onChange={(e) => setPreMoneyValuationNum(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#243d78]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹1 Cr Early</span>
                    <span>₹5 Cr Normal</span>
                    <span>₹25 Cr Series A</span>
                  </div>
                </div>
              </div>

              {/* Key Output Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Equity Stake
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {math.ownershipPct}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Post-money: {formatRupeesCompact(math.postMoney)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-[#243d78] tracking-wider">
                    5x Exit Yield
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {formatRupeesCompact(math.returnAt5x)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">5.0x MOIC Multiple</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                    10x Exit Return
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {formatRupeesCompact(math.returnAt10x)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">10.0x Return on Capital</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    Founder Runway
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    +{math.monthsOfRunwayFunded} Mo
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Funded from Check</div>
                </div>
              </div>

              {/* Action to switch to commit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("commit")}
                  className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-bold text-xs shadow-sm border border-[#12224d] transition flex items-center gap-2 cursor-pointer"
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
