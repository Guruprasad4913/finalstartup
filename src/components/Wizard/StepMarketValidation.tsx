"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Globe,
  Radio,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Users,
  Building2,
  Sparkles,
  BarChart3,
  Check,
  X,
  Target,
  Clock,
  Compass,
  IndianRupee,
  Zap,
  MapPin,
  HelpCircle,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Flame,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { StartupIdea, MarketValidation } from "@/types";

interface StepMarketValidationProps {
  idea: StartupIdea;
  validation: MarketValidation;
  onNext: () => void;
  onBack: () => void;
  isEvaluatingCloud: boolean;
}

export const StepMarketValidation: React.FC<StepMarketValidationProps> = ({
  idea,
  validation,
  onNext,
  onBack,
  isEvaluatingCloud,
}) => {
  const [activeTab, setActiveTab] = useState<"market" | "competitors" | "users">("market");
  const [showJargonGuide, setShowJargonGuide] = useState(false);
  const [competitorFilter, setCompetitorFilter] = useState<"all" | "Direct" | "Indirect">("all");
  const [battlecardView, setBattlecardView] = useState<"both" | "chart" | "table">("both");

  const {
    competitorComparisonMatrix,
    targetUserAnalysis,
    regionalMarketDynamics,
    targetSegments,
  } = validation;

  // Filtered competitors for tab 2
  const displayedCompetitors = validation.competitors.filter((c) => {
    if (competitorFilter === "all") return true;
    return c.type === competitorFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Step 3 of 6: Market, Competitor &amp; Target User Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Market &amp; Customer Intelligence for <span className="text-[#243d78]">{idea.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Understand your total market demand, how you beat existing alternatives, and exactly who will buy your product first.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowJargonGuide(!showJargonGuide)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              showJargonGuide
                ? "bg-blue-50 text-[#243d78] border-blue-200"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
            title="Toggle plain English explanations for startup terms"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#243d78]" />
            <span>{showJargonGuide ? "Hide Terminology Guide" : "Plain English Guide"}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isEvaluatingCloud}
            className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs sm:text-sm font-semibold shadow-sm border border-[#12224d] transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isEvaluatingCloud ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating Feasibility &amp; AI Engine...</span>
              </>
            ) : (
              <>
                <span>Continue to Feasibility &amp; Scoring</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Beginner-Friendly Jargon Buster / Plain English Dictionary (Collapsible) */}
      {showJargonGuide && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#243d78] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Startup &amp; Venture Terminology: In Plain English</span>
            </div>
            <span className="text-[11px] text-slate-500">Everything you need to know in 1 minute</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#243d78]" /> TAM (Total Addressable Market)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The entire universe of possible revenue if 100% of potential customers worldwide bought your solution.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> SAM (Serviceable Addressable Market)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The portion of the market your product and business model can realistically serve today given geography and technology.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> SOM (Serviceable Obtainable Market / 3-Year Target)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Your realistic 3-year revenue target. Capturing just 1% to 3% of SAM represents your immediate business size.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> CAGR (Compound Annual Growth Rate)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                How fast customer demand in this industry grows year over year. Anything above 15% represents strong startup tailwinds.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rose-600" /> CAC (Customer Acquisition Cost)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The marketing &amp; sales expense to gain 1 paying customer. Lower is better, and customer lifetime value should be 3x CAC.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Innovation Moat (Defensibility)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Your unfair strategic advantage (proprietary AI, workflow lock-in, data network) that prevents competitors from copying you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Executive 60-Second Market Briefing (High-level glance for busy users) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 3-Year Opportunity */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-800">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> 3-Year Target — SOM
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-medium">₹ INR</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{validation.som.value}</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Realistic achievable revenue if you capture your beachhead market segment over 36 months.
          </p>
        </div>

        {/* Card 2: Industry Growth Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-800">
              <TrendingUp className="w-4 h-4 text-[#243d78]" /> Growth Velocity — CAGR
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-mono font-medium">Annual</span>
          </div>
          <div className="text-2xl font-black text-[#243d78]">{validation.cagr}</div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Annual industry expansion rate. High velocity signals strong buyer urgency and expanding budgets.
          </p>
        </div>

        {/* Card 3: Top Competitor & Edge */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Your Unfair Moat
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-medium">Moat</span>
          </div>
          <div className="text-sm font-bold text-slate-900 line-clamp-2">
            {idea.innovationMoat || validation.competitors[0]?.ourDifferentiation || "AI & Cloud Architecture"}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Primary strategic reason why buyers will choose you over {validation.competitors[0]?.name || "incumbents"}.
          </p>
        </div>

        {/* Card 4: Primary Buyer & Channel */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Users className="w-4 h-4 text-sky-600" /> Primary Buyer Persona
            </span>
            <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-medium">Buyer</span>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {targetUserAnalysis?.personaName || idea.targetPersona.title}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            Budget: {targetUserAnalysis?.willingnessToPayRange || idea.targetPersona.willingnessToPay}
          </div>
          <p className="text-[10px] text-slate-500 truncate">
            Best Channel: {targetUserAnalysis?.acquisitionChannels[0]?.channel || "Direct Outbound"}
          </p>
        </div>
      </div>

      {/* Sub-Tabs Navigation for Market, Competitors, and Target Users */}
      <div className="flex border-b border-slate-200 gap-3 sm:gap-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("market")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === "market"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4 text-[#243d78]" />
          <span>1. Market Sizing &amp; Live Trends</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#243d78] border border-blue-200 font-mono font-medium">
            TAM / SAM / SOM
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("competitors")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === "competitors"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#243d78]" />
          <span>2. Competitor Battlecard &amp; Moat</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">
            {validation.competitors.length} Rivals
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === "users"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4 text-[#243d78]" />
          <span>3. Target Customer &amp; Buying Journey</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">
            Persona &amp; CAC
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MARKET ANALYSIS & SIZING */}
      {/* ========================================================================= */}
      {activeTab === "market" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Visual Market Sizing Funnel & Growth Speed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#243d78]" />
                  Visual Market Sizing Funnel: From Global Universe to Your 3-Year Goal
                </h3>
                <p className="text-xs text-slate-600">
                  How big is this industry overall, how much is reachable right now, and what can you realistically achieve?
                </p>
              </div>
            </div>

            {/* Stepped Sizing Hierarchy Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Level 1: TAM */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-300 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#243d78]" /> Level 1 · Universe
                    </span>
                    <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      TAM
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{validation.tam.value}</div>
                  <div className="text-xs font-semibold text-[#243d78]">Total Addressable Market</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validation.tam.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>The 100% boundary of all global spend for this problem category.</span>
                </div>
              </div>

              {/* Level 2: SAM */}
              <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-blue-300 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-600" /> Level 2 · Reachable
                    </span>
                    <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      SAM
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#243d78]">{validation.sam.value}</div>
                  <div className="text-xs font-semibold text-blue-900">Serviceable Addressable Market</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{validation.sam.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-blue-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Customers who fit your specific geographic and tech profile.</span>
                </div>
              </div>

              {/* Level 3: SOM */}
              <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-emerald-600 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Level 3 · Realistic 3-Year Target
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      SOM Target
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">{validation.som.value}</div>
                  <div className="text-xs font-semibold text-emerald-800">Serviceable Obtainable Market (36 Months)</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{validation.som.description}</p>
                </div>
                <div className="pt-3 border-t border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 stroke-[3]" />
                  <span>Your concrete business revenue goal if you capture 1-3% market share.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segments Priority Breakdown */}
          {targetSegments && targetSegments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#243d78]" />
                    Target Customer Segments &amp; Sales Velocity
                  </h3>
                  <p className="text-xs text-slate-600">
                    Who should you sell to first? Start with segments that have Critical urgency and fast sales cycles.
                  </p>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {targetSegments.length} Segments Profiled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Segment {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{seg.segment}</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            seg.urgency === "Critical"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : seg.urgency === "High"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {seg.urgency} Urgency
                        </span>
                        <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {seg.sizeShare} Share
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Sales Cycle Duration:</span>
                        <span className="font-semibold text-slate-800">{seg.salesCycle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Founder Strategy:</span>
                        <span className="font-medium text-emerald-700">
                          {seg.urgency === "Critical" || seg.salesCycle.includes("week")
                            ? "🎯 Target First (Beachhead)"
                            : "Scale After Launch"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regional & Strategic Market Dynamics */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Strategic Market Forces &amp; Regional Location Intelligence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strategic Summary */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Market Dynamics &amp; Tailwinds</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {validation.marketSummary}
                </p>
              </div>

              {/* Regional Dynamics (if present) */}
              {regionalMarketDynamics ? (
                <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#243d78]">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Regional Ecosystem Intelligence</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {regionalMarketDynamics}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#243d78]">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Global Industry Expansion</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Demand is scaling rapidly across modern cloud native teams and technology enterprises seeking automated efficiency.
                  </p>
                </div>
              )}
            </div>

            {/* Tavily Web Intelligence (if present) */}
            {validation.tavilyResearchSummary && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-3 shadow-sm">
                <Globe className="w-5 h-5 text-[#243d78] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-[#243d78]">Tavily Live Web Intelligence Synthesis</strong>
                    <span className="text-[10px] bg-white text-blue-800 px-2 py-0.5 rounded font-semibold border border-blue-200">
                      Real-Time Web Evidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{validation.tavilyResearchSummary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Real-Time API Market Trends & Signals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Live Industry Trends &amp; Research Citations
              </h3>
              <div className="flex items-center gap-2">
                {validation.usedTavily && (
                  <span className="text-[11px] text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1 font-semibold">
                    <Globe className="w-3 h-3 text-blue-600" />
                    Tavily Verified
                  </span>
                )}
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
                  Signals Connected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {validation.realTimeTrends.map((trend, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {trend.source}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          trend.sentiment === "Bullish"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {trend.sentiment}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 leading-snug">
                      {trend.headline}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-medium">{trend.growthSignal}</span>
                    {trend.url && (
                      <a
                        href={trend.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#243d78] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation Footer Helper */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setActiveTab("competitors");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#243d78] border border-slate-300 shadow-sm hover:border-[#243d78] transition text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Explore Competitor Battlecard &amp; Moat</span>
              <ChevronRight className="w-4 h-4 text-[#243d78]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPETITOR ANALYSIS & FEATURE BATTLECARD */}
      {/* ========================================================================= */}
      {activeTab === "competitors" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Unfair Moat Highlight Banner */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#243d78] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#243d78] tracking-wider">
                  Core Moat &amp; Defensibility Strategy
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  Why Customers Will Pick {idea.name} Over Incumbents
                </h4>
                <p className="text-xs text-slate-600 max-w-2xl">
                  {idea.innovationMoat || "Combining automated real-time intelligence with modular cloud architectures."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCompetitorFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  competitorFilter === "all"
                    ? "bg-[#243d78] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                All Rivals ({validation.competitors.length})
              </button>
              <button
                type="button"
                onClick={() => setCompetitorFilter("Direct")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  competitorFilter === "Direct"
                    ? "bg-rose-700 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                Direct Threats
              </button>
              <button
                type="button"
                onClick={() => setCompetitorFilter("Indirect")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  competitorFilter === "Indirect"
                    ? "bg-[#243d78] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                Indirect Alternatives
              </button>
            </div>
          </div>

          {/* Competitor Cards Grid (Easy to scan side-by-side) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#243d78]" />
              Competitor Weaknesses vs. Your Strategic Superpower
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedCompetitors.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Name + Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{comp.name}</h4>
                        <span className="text-[11px] text-slate-500 block">{comp.fundingOrScale}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          comp.type === "Direct"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {comp.type} Rival
                      </span>
                    </div>

                    {/* Competitor Strength (if available) */}
                    {comp.strengths && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">
                          💪 Their Current Strength
                        </span>
                        <p className="text-slate-700">{comp.strengths}</p>
                      </div>
                    )}

                    {/* Competitor Vulnerability */}
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                      <span className="text-[10px] uppercase font-bold text-rose-700 block mb-0.5">
                        ⚠️ Their Vulnerability / Weakness
                      </span>
                      <p className="text-slate-800">{comp.weaknesses}</p>
                    </div>

                    {/* Our Advantage */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">
                        🚀 Your Unfair Advantage
                      </span>
                      <p className="text-emerald-900 font-medium">{comp.ourDifferentiation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Positioning Battlecard #{idx + 1}</span>
                    <span className="text-[#243d78] font-semibold">Ready for Pitch Deck</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Feature Comparison Matrix (Battlecard) & Visual Comparison Chart */}
          {competitorComparisonMatrix && (() => {
            const totalFeatures = competitorComparisonMatrix.features.length || 1;
            const competitorChartData = [
              {
                name: `${idea.name} (Our Product)`,
                coverage: 100,
                supportedCount: totalFeatures,
                total: totalFeatures,
                isOurProduct: true,
                color: "#243d78",
              },
              ...competitorComparisonMatrix.competitors.map((c, cIdx) => {
                let count = 0;
                competitorComparisonMatrix.features.forEach((feat) => {
                  const val = c.scores[feat];
                  if (val === true) count += 1;
                  else if (typeof val === "string" && val.toLowerCase() !== "false" && val.toLowerCase() !== "no") count += 0.5;
                });
                const pct = Math.min(100, Math.round((count / totalFeatures) * 100));
                const colors = ["#475569", "#64748b", "#0284c7", "#d97706"];
                return {
                  name: c.name.split("(")[0].trim(),
                  coverage: pct,
                  supportedCount: Math.round(count * 10) / 10,
                  total: totalFeatures,
                  isOurProduct: false,
                  color: colors[cIdx % colors.length],
                };
              }),
            ];

            return (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#243d78]" />
                      Product Capability &amp; Architecture Comparison Battlecard
                    </h3>
                    <p className="text-xs text-slate-600">
                      Visual comparison chart and feature-by-feature proof demonstrating your technology moat.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-slate-100 border border-slate-200 p-0.5 rounded-xl flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setBattlecardView("both")}
                        className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                          battlecardView === "both"
                            ? "bg-[#243d78] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Both
                      </button>
                      <button
                        type="button"
                        onClick={() => setBattlecardView("chart")}
                        className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                          battlecardView === "chart"
                            ? "bg-[#243d78] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <BarChart3 className="w-3 h-3 text-slate-300" />
                        <span>Moat Chart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBattlecardView("table")}
                        className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                          battlecardView === "table"
                            ? "bg-[#243d78] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Matrix Table
                      </button>
                    </div>

                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ✨ 100% Core Moat Advantage
                    </span>
                  </div>
                </div>

                {/* Visual Competitive Capability Moat Chart */}
                {(battlecardView === "both" || battlecardView === "chart") && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#243d78]" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Competitive Capability Coverage &amp; Moat Index
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Coverage % (Native Capabilities)
                      </span>
                    </div>

                    <div className="h-56 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={competitorChartData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            stroke="#94a3b8"
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fill: "#64748b", fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#94a3b8"
                            width={160}
                            tick={{ fill: "#334155", fontSize: 11 }}
                          />
                          <Tooltip
                            formatter={(val: any, _name: any, item: any) => [
                              `${val}% (${item.payload.supportedCount}/${item.payload.total} capabilities supported)`,
                              "Native Architecture Advantage",
                            ]}
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              borderColor: "#cbd5e1",
                              borderRadius: "0.75rem",
                              fontSize: "12px",
                              color: "#0f172a",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Bar dataKey="coverage" radius={[0, 8, 8, 0]} maxBarSize={28}>
                            {competitorChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.isOurProduct ? "#12224d" : undefined}
                                strokeWidth={entry.isOurProduct ? 1.5 : 0}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Table Matrix */}
                {(battlecardView === "both" || battlecardView === "table") && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Key Capability / Architecture</th>
                          <th className="px-4 py-3 font-bold text-[#243d78] bg-blue-50/70 border-x border-blue-200">
                            {idea.name} (Our Product)
                          </th>
                          {competitorComparisonMatrix.competitors.map((c, i) => (
                            <th key={i} className="px-4 py-3 font-semibold text-slate-600">
                              {c.name.split("(")[0].trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {competitorComparisonMatrix.features.map((feat, fIdx) => (
                          <tr key={fIdx} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-medium text-slate-900">{feat}</td>
                            <td className="px-4 py-3 font-bold text-emerald-800 bg-emerald-50/30 border-x border-slate-200">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Native Support
                              </span>
                            </td>
                            {competitorComparisonMatrix.competitors.map((c, cIdx) => {
                              const val = c.scores[feat];
                              return (
                                <td key={cIdx} className="px-4 py-3 text-slate-600">
                                  {typeof val === "boolean" ? (
                                    val ? (
                                      <span className="inline-flex items-center text-emerald-700 gap-1 font-semibold">
                                        <Check className="w-3.5 h-3.5" /> Yes
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center text-rose-600 gap-1 font-semibold">
                                        <X className="w-3.5 h-3.5" /> No
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                                      {val}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Tab Navigation Footer Helper */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab("market");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Market Sizing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("users");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#243d78] border border-slate-300 hover:border-[#243d78] shadow-sm transition text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Understand Target Customers &amp; Buying Journey</span>
              <ChevronRight className="w-4 h-4 text-[#243d78]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TARGET USER ANALYSIS & BUYING JOURNEY */}
      {/* ========================================================================= */}
      {activeTab === "users" && targetUserAnalysis && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Persona Header Dossier Card */}
          <div className="rounded-2xl p-6 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#243d78] text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xl">
                {targetUserAnalysis.personaName.charAt(0) || "P"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#243d78] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Primary Buyer Persona
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600">{targetUserAnalysis.organizationType}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{targetUserAnalysis.personaName}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {targetUserAnalysis.roleTitle}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center flex-shrink-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Target Willingness to Pay
              </span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">
                {targetUserAnalysis.willingnessToPayRange}
              </span>
              <span className="text-[10px] text-emerald-800 font-medium">Budget Confirmed</span>
            </div>
          </div>

          {/* Customer Pain Points vs Buying Catalysts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: What Hurts (Pain Points) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-600" /> Acute Daily Frustrations &amp; Pain Points
                </h4>
                <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-medium">
                  Why They Need You
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {targetUserAnalysis.acutePainPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✕
                    </span>
                    <span className="text-slate-800">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What Triggers Purchase (Buying Catalysts) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" /> Purchase Catalysts (When They Buy)
                </h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                  High Conversion Moments
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {targetUserAnalysis.buyingTriggerMoments.map((trigger, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-800">{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Adoption Friction & Counter-Strategy (if present) */}
          {targetUserAnalysis.adoptionFriction && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-slate-800 leading-relaxed flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-amber-900 block">Anticipated Adoption Friction &amp; Objections:</strong>
                <p className="text-slate-700">{targetUserAnalysis.adoptionFriction}</p>
                <div className="text-[11px] text-[#243d78] pt-1 font-medium">
                  💡 <em>Recommendation: Provide zero-friction 1-click cloud sandbox setups and automated onboarding tours to dissolve this hesitation.</em>
                </div>
              </div>
            </div>
          )}

          {/* Customer Acquisition Channels with Plain-English CAC */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#243d78]" />
                  Customer Acquisition Channels &amp; Target CAC
                </h4>
                <p className="text-xs text-slate-600">
                  How you reach this buyer, expected cost per acquisition (CAC), and channel effectiveness.
                </p>
              </div>
              <span className="text-[11px] text-slate-500">
                Healthy benchmark: LTV should exceed 3x CAC
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {targetUserAnalysis.acquisitionChannels.map((channel, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Channel #{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          channel.effectiveness === "High"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : channel.effectiveness === "Medium"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {channel.effectiveness} ROI
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">{channel.channel}</p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Est. CAC:</span>
                    <span className="text-emerald-700 font-bold font-mono">{channel.estimatedCac}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Makers & Retention Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Buying Decision Makers */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#243d78] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Buying Decision Makers &amp; Stakeholders
                </span>
                <span className="text-[10px] text-slate-500">Sign-off Team</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                People who influence or have veto power over adopting this product:
              </p>
              <ul className="space-y-1.5 text-slate-700">
                {targetUserAnalysis.decisionMakers.map((dm, i) => (
                  <li key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#243d78]" />
                    <span className="font-medium text-slate-800">{dm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retention Drivers */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" /> Long-Term Retention &amp; Negative Churn
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Sticky Product</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Why users keep renewing and never switch to competitors:
              </p>
              <ul className="space-y-1.5 text-slate-700">
                {targetUserAnalysis.retentionDrivers.map((rd, i) => (
                  <li key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span className="font-medium text-slate-800">{rd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Action Helper */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab("competitors");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Competitors</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={isEvaluatingCloud}
              className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs sm:text-sm font-bold shadow-sm border border-[#12224d] transition flex items-center gap-2 cursor-pointer"
            >
              <span>Ready! Proceed to Cloud Feasibility &amp; Scoring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
