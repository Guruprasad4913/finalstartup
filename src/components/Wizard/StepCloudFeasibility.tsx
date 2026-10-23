"use client";

import React, { useState, useEffect } from "react";
import {
  Cloud,
  Cpu,
  Database,
  Server,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Activity,
  Layers,
  Sparkles,
  FileCheck,
  TrendingUp,
  Award,
  Sliders,
  ShieldAlert,
  HelpCircle,
  Check,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { StartupIdea, FeasibilityReport, ScoringFactor } from "@/types";

interface StepCloudFeasibilityProps {
  idea: StartupIdea;
  feasibility: FeasibilityReport;
  onNext: () => void;
  onBack: () => void;
}

export const StepCloudFeasibility: React.FC<StepCloudFeasibilityProps> = ({
  idea,
  feasibility,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"scoring" | "cloud" | "revenue" | "risks">("scoring");

  // Interactive Scoring Engine State
  const defaultFactors = feasibility.scoringEngine?.factors || [
    { id: "tech", name: "Technical Feasibility", score: 86, weight: 20, impact: "Positive", rationale: "Serverless cloud primitives and verified API (Application Programming Interface) models ensure rapid buildability." },
    { id: "market", name: "Market Demand & Timing", score: 84, weight: 25, impact: "Positive", rationale: "Strong sector CAGR (Compound Annual Growth Rate) and acute customer urgency create an open commercial window." },
    { id: "financial", name: "Unit Economics & Monetization", score: 85, weight: 25, impact: "Positive", rationale: "High gross software margin (84%+) and 11.3x LTV : CAC (Lifetime Value to Customer Acquisition Cost Ratio) ensure capital efficiency." },
    { id: "regulatory", name: "Regulatory & Compliance Moat", score: 76, weight: 15, impact: "Neutral", rationale: "Clear path through regional regulatory sandboxes with proactive data privacy." },
    { id: "execution", name: "Speed to MVP (Minimum Viable Product) Velocity", score: 80, weight: 15, impact: "Positive", rationale: "4-week rapid sprint roadmap utilizing low-code accelerators enables fast time-to-market." },
  ];

  const [factors, setFactors] = useState<ScoringFactor[]>(defaultFactors);

  // Dynamic calculated score based on interactive weights
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const calculatedViabilityScore = Math.round(
    factors.reduce((sum, f) => sum + (f.score * f.weight), 0) / (totalWeight || 1)
  );

  // Dynamic Runway Calculator State
  const [blendedPrice, setBlendedPrice] = useState<number>(89);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(25);

  const calculateProjectedRunway = () => {
    let users = 40;
    const months = ["M1", "M2", "M3", "M4", "M6", "M8", "M10", "M12"];
    return months.map((m) => {
      const revenue = Math.round(users * blendedPrice);
      const cost = Math.round(400 + users * 8 + (revenue * 0.12));
      const margin = revenue > cost ? Math.round(((revenue - cost) / revenue) * 100) : 0;
      users = Math.round(users * (1 + monthlyGrowthRate / 100));
      return { month: m, users, revenue, cost, margin };
    });
  };

  const dynamicRunway = calculateProjectedRunway();

  const handleWeightChange = (id: string, newWeight: number) => {
    setFactors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, weight: Math.max(5, Math.min(60, newWeight)) } : f))
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#243d78] text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            Step 4 of 6: Feasibility, Revenue & AI Scoring Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Viability Blueprint for <span className="text-[#243d78]">{idea.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Algorithmic viability scoring, cloud topology blueprints, unit economics simulator, and 2x2 risk matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs sm:text-sm font-semibold shadow-sm border border-[#12224d] transition flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to MVP &amp; Business Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Prominent Viability Gauge & Verdict Banner (82/100) */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 bg-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Circular Viability Speedometer / Gauge */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90 relative" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gaugeGradient)"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * calculatedViabilityScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#243d78" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {calculatedViabilityScore}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                / 100 SCORE
              </span>
            </div>
          </div>

          <div className="space-y-2.5 max-w-lg">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                Institutional Viability Index
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                {feasibility.verdict}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#243d78] border border-blue-200">
                Top Decile Venture
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {feasibility.verdictSummary}
            </p>
          </div>
        </div>

        {/* 5-Factor Quick Score Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2.5 w-full md:w-auto">
          {factors.map((f) => (
            <div key={f.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center hover:border-slate-300 transition shadow-sm">
              <div className="text-xs text-slate-600 truncate font-semibold">{f.name.split(" ")[0]}</div>
              <div className="text-base font-extrabold text-[#243d78] font-mono mt-0.5">{f.score}%</div>
              <div className="text-[10px] text-slate-500 font-mono">Weight: {f.weight}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plain Language Explainer */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-white text-[#243d78] border border-blue-200 mt-0.5 flex-shrink-0 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-900 block text-sm">Understanding Your Viability Score ({calculatedViabilityScore}/100)</span>
          <p className="text-slate-600 leading-relaxed">
            A score above 75 indicates high commercial viability. This evaluation combines 5 weighted factors: Market Demand, Execution Complexity, Defensibility (Moat), Unit Economics, and Operational Risk. Explore the tabs below for cloud hosting cost estimates, unit economics simulation, and risk mitigation.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("scoring")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "scoring"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4 text-[#243d78]" />
          1. AI Scoring Engine ({calculatedViabilityScore}/100)
        </button>
        <button
          onClick={() => setActiveTab("cloud")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "cloud"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Cloud className="w-4 h-4 text-[#243d78]" />
          {idea.businessType && idea.businessType !== "Tech & Software"
            ? "2. Operations & Systems Blueprint"
            : "2. Technical Feasibility & Cloud Blueprint"}
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "revenue"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <IndianRupee className="w-4 h-4 text-[#243d78]" />
          3. Revenue Model &amp; Runway Simulator
        </button>
        <button
          onClick={() => setActiveTab("risks")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "risks"
              ? "border-[#243d78] text-[#243d78]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          4. 2x2 Risk Analysis Matrix
        </button>
      </div>

      {/* Tab 1: AI Scoring Engine Breakdown */}
      {activeTab === "scoring" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#243d78]" />
                Algorithmic Scoring Engine &amp; Multi-Factor Weights
              </h3>
              <p className="text-xs text-slate-600">
                Adjust sliders to model customized founder risk preferences and see instant score re-calculation.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Active Viability Index: {calculatedViabilityScore}/100
            </span>
          </div>

          <div className="space-y-3">
            {factors.map((factor) => (
              <div
                key={factor.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-[#243d78] font-extrabold flex items-center justify-center text-xs font-mono shadow-sm">
                      {factor.score}%
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">{factor.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{factor.rationale}</p>
                    </div>
                  </div>

                  {/* Weight Slider Control */}
                  <div className="flex items-center gap-3 self-end sm:self-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium">
                      Weight: <strong className="text-[#243d78] font-mono">{factor.weight}%</strong>
                    </span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={factor.weight}
                      onChange={(e) => handleWeightChange(factor.id, parseInt(e.target.value))}
                      className="w-24 accent-[#243d78] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-[#243d78] h-full rounded-full transition-all duration-500"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart Summary Cards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Scoring Engine Institutional Synthesis
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              With a composite viability score of <strong className="text-emerald-700 font-bold">{calculatedViabilityScore}/100</strong>, this startup idea exceeds the top-quartile viability benchmark (Minimum institutional hurdle: 75/100). The combination of healthy operating unit economics, practical operational deployability, and favorable market window qualifies this venture as an institutional <span className="text-emerald-800 font-semibold">&quot;Strong Go&quot;</span>.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Technical Feasibility & Cloud Architecture */}
      {activeTab === "cloud" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Provider & Estimated Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                {idea.businessType && idea.businessType !== "Tech & Software"
                  ? "Operational & Systems Core"
                  : "Recommended Cloud Provider"}
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#243d78]" />
                {feasibility.cloudArchitecture.recommendedProvider}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                {idea.businessType && idea.businessType !== "Tech & Software"
                  ? "MVP Ops & Setup Cost"
                  : "MVP Monthly Cloud Cost"}
              </span>
              <div className="text-base sm:text-lg font-bold text-emerald-700 mt-1.5 font-mono">
                {feasibility.cloudArchitecture.estimatedMonthlyCloudCost.mvp}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Growth Stage (10k Users)
              </span>
              <div className="text-base sm:text-lg font-bold text-[#243d78] mt-1.5 font-mono">
                {feasibility.cloudArchitecture.estimatedMonthlyCloudCost.growth}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Scale Stage (100k+ Users)
              </span>
              <div className="text-base sm:text-lg font-bold text-blue-900 mt-1.5 font-mono">
                {feasibility.cloudArchitecture.estimatedMonthlyCloudCost.scale}
              </div>
            </div>
          </div>

          {/* Interactive Cloud Architecture Diagram Visualizer */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#243d78]" />
              {idea.businessType && idea.businessType !== "Tech & Software"
                ? "Operational & Systems Architecture Blueprint (5 Tiers)"
                : "Cloud Infrastructure Topology Blueprint (5 Tiers)"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {feasibility.cloudArchitecture.diagramComponents.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all duration-200 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-[#243d78] uppercase tracking-wider font-mono">
                      {comp.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{comp.name}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{comp.details}</p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Tier 0{idx + 1}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#243d78]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third-Party APIs Integrated */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#243d78]" />
              Essential Third-Party APIs &amp; Integration Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feasibility.cloudArchitecture.thirdPartyAPIs.map((api, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{api.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{api.purpose}</div>
                  </div>
                  <span className="text-[11px] text-blue-900 font-mono font-medium px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 whitespace-nowrap">
                    {api.costTier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Revenue Model & Interactive Runway Simulator */}
      {activeTab === "revenue" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Unit Economics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                CAC (Customer Acquisition Cost)
              </span>
              <div className="text-base sm:text-lg font-bold text-amber-700 mt-1 font-mono">
                {feasibility.revenueModel.keyUnitEconomics.cacEstimate}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                LTV (Customer Lifetime Value)
              </span>
              <div className="text-base sm:text-lg font-bold text-emerald-700 mt-1 font-mono">
                {feasibility.revenueModel.keyUnitEconomics.ltvEstimate}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                LTV : CAC Ratio
              </span>
              <div className="text-base sm:text-lg font-bold text-[#243d78] mt-1 font-mono">
                {feasibility.revenueModel.keyUnitEconomics.ltvCacRatio}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Gross Software Margin
              </span>
              <div className="text-base sm:text-lg font-bold text-blue-900 mt-1 font-mono">
                {feasibility.revenueModel.keyUnitEconomics.grossMargin}
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Recommended Commercial Pricing Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feasibility.revenueModel.pricingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                    tier.highlighted
                      ? "bg-white border-2 border-[#243d78] shadow-md ring-1 ring-[#243d78]/20 -translate-y-1"
                      : "bg-white border border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {tier.tier}
                      </span>
                      {tier.highlighted && (
                        <span className="text-[10px] bg-[#243d78] text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-slate-900 font-mono">{tier.price}</span>
                      <span className="text-xs text-slate-500">{tier.billing}</span>
                    </div>
                    <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Financial Runway Simulator */}
          <div className="space-y-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#243d78]" />
                  Interactive 12-Month Runway &amp; ARR Simulator
                </h4>
                <p className="text-xs text-slate-600">
                  Simulate dynamic subscriber growth and average revenue per account.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Blended ARPU:</span>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={blendedPrice}
                    onChange={(e) => setBlendedPrice(parseInt(e.target.value) || 29)}
                    className="w-16 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-bold font-mono text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Growth:</span>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={monthlyGrowthRate}
                    onChange={(e) => setMonthlyGrowthRate(parseInt(e.target.value) || 15)}
                    className="w-14 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-[#243d78] font-bold font-mono text-xs focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-slate-500 font-mono">% MoM</span>
                </div>
              </div>
            </div>

            {/* Visual Runway Comparison Chart: Projected Revenue vs Operating Cost */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#243d78]" />
                  Monthly Revenue vs Operating Cost Trajectory
                </span>
                <span className="text-[10px] text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Breakeven &amp; Scaling Curves
                </span>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicRunway} margin={{ top: 10, right: 15, left: -5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#243d78" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#243d78" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `$${Number(val).toLocaleString()}`,
                        name === "revenue" ? "Projected Revenue" : "Operating Cost",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                        color: "#0f172a",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
                      formatter={(value) => (
                        <span className="text-slate-700 font-medium">
                          {value === "revenue" ? "Projected Revenue ($)" : "Estimated Operating & Cloud Cost ($)"}
                        </span>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#243d78"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#costGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Simulated Timeline Projection Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 pt-2">
              {dynamicRunway.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 hover:border-slate-300 transition shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block font-mono">{item.month}</span>
                  <div className="text-xs font-bold text-emerald-700 font-mono">${item.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.users} Accts</div>
                  <div className="text-[9px] text-[#243d78] font-semibold font-mono">{item.margin}% Margin</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 2x2 Risk Matrix & Mitigation Blueprint */}
      {activeTab === "risks" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Visual 2x2 Risk Matrix Grid */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Visual 2x2 Risk Assessment Matrix (Severity vs Probability)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* High Severity / High Probability */}
              <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-rose-800 uppercase tracking-wider">
                  <span>High Severity · High Probability</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-semibold border border-rose-200">Critical Priority</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Competitor Duplication &amp; Incumbent Speed</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-rose-800">Mitigation:</strong> Accelerate proprietary workflow integrations and private enterprise data lock-in that creates high switching barriers.
                </p>
              </div>

              {/* High Severity / Low Probability */}
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <span>High Severity · Low Probability</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-semibold border border-amber-200">Containment Plan</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Model Hallucination &amp; Erroneous Automated Actions</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-amber-800">Mitigation:</strong> Enforce deterministic ground-truth verification loops with human-in-the-loop approval thresholds on irreversible mutations.
                </p>
              </div>

              {/* Low Severity / High Probability */}
              <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-[#243d78] uppercase tracking-wider">
                  <span>Medium Severity · High Probability</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#243d78] text-[10px] font-mono font-semibold border border-blue-200">Operational Guardrail</span>
                </div>
                <p className="text-xs font-bold text-slate-900">API Rate Limiting &amp; Latency Bottlenecks</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-[#243d78]">Mitigation:</strong> Deploy Redis semantic caching layer with asynchronous background queue workers.
                </p>
              </div>

              {/* Low Severity / Low Probability */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <span>Low Severity · Low Probability</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-200">Standard Monitoring</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Cloud Infrastructure Cost Runaway</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  <strong className="text-emerald-800">Mitigation:</strong> Serverless pay-as-you-go architecture with hard spend limits and automated billing anomaly alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Mitigations Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Comprehensive Risk Mitigation Strategy Table
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Identified Risk Factor</th>
                    <th className="px-4 py-3.5 font-semibold">Probability</th>
                    <th className="px-4 py-3.5 font-semibold">Severity</th>
                    <th className="px-4 py-3.5 font-semibold text-[#243d78]">Concrete Mitigation Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {feasibility.risksAndMitigations.map((risk, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{risk.risk}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {risk.probability}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                            risk.severity === "High"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {risk.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 leading-relaxed">{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
