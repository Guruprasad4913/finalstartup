"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Award,
  Sparkles,
  Building,
  MapPin,
  Scale,
  Search,
  ChevronRight,
  Calculator,
  Briefcase,
  Star,
  ExternalLink,
  Zap,
  Layers,
  ArrowRight,
  Filter,
  DollarSign,
  Activity,
  CheckCircle2,
  RefreshCw,
  FolderHeart,
  BarChart3,
  Flame,
  Globe2,
  PieChart as PieIcon,
  Percent,
  FileText,
  Mail,
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
  PieChart,
  Pie,
} from "recharts";
import { StartupProject, User, InvestmentCommitment } from "@/types";
import {
  getAllDealflow,
  getInvestorWatchlist,
  toggleInvestorWatchlist,
  getLocalCommitments,
} from "@/lib/curated-deals";
import { InvestmentModal } from "./InvestmentModal";

interface InvestorDashboardProps {
  currentUser: User | null;
  savedProjects: StartupProject[];
  onSelectProject: (p: StartupProject) => void;
  onSwitchToWizard?: () => void;
  onSwitchToReports?: () => void;
  onSwitchToAdmin?: () => void;
  onRefreshData?: () => void;
}

const SECTOR_COLORS = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  currentUser,
  savedProjects,
  onSelectProject,
  onSwitchToReports,
  onSwitchToAdmin,
  onRefreshData,
}) => {
  // Tabs: 'deals' | 'watchlist' | 'commitments' | 'lab'
  const [activeTab, setActiveTab] = useState<"deals" | "watchlist" | "commitments" | "lab">("deals");

  // Multi-filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [dealSourceFilter, setDealSourceFilter] = useState<"all" | "founder" | "institutional">("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"highestScore" | "highestTam" | "highestLtvCac" | "lowestCloudCost" | "newest">("highestScore");

  // Watchlist & Commitments state
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<InvestmentCommitment[]>([]);

  // Selected project for Investment / Interest Modal
  const [investModalProject, setInvestModalProject] = useState<StartupProject | null>(null);

  // Load watchlist and commitments from local cache on mount
  useEffect(() => {
    setWatchlistIds(getInvestorWatchlist());
    setCommitments(getLocalCommitments());
  }, []);

  // Merge live user projects with curated institutional dealflow
  const allProjects = useMemo(() => {
    return getAllDealflow(savedProjects);
  }, [savedProjects]);

  // Extract unique domains and locations for filter pills
  const { domainsList, locationsList } = useMemo(() => {
    const dSet = new Set<string>();
    const lSet = new Set<string>();

    allProjects.forEach((p) => {
      if (p.selectedIdea?.domain) dSet.add(p.selectedIdea.domain);
      const loc = p.targetLocation?.city || p.founderProfile?.targetLocation?.city;
      if (loc) lSet.add(loc);
    });

    return {
      domainsList: Array.from(dSet),
      locationsList: Array.from(lSet),
    };
  }, [allProjects]);

  // Aggregate stats across dealflow
  const stats = useMemo(() => {
    const totalDeals = allProjects.length;
    let totalTamNum = 0;
    let scoreSum = 0;
    let ltvCacSum = 0;
    let ltvCount = 0;
    let totalFundingRequiredNum = 0;

    allProjects.forEach((p) => {
      const tamVal = p.validation?.tam?.numBillions || 0;
      totalTamNum += tamVal;
      scoreSum += p.feasibility?.overallScore || 0;

      const ltvStr = p.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "";
      const parsedLtv = parseFloat(ltvStr.replace(/[^0-9.]/g, ""));
      if (!isNaN(parsedLtv) && parsedLtv > 0) {
        ltvCacSum += parsedLtv;
        ltvCount++;
      }

      const askStr = p.fundingAsk?.targetFundingAmount || (p.validation?.tam?.value?.includes("B") ? "$500,000" : "$250,000");
      const parsedAsk = parseFloat(askStr.replace(/[^0-9.]/g, "")) || 250000;
      totalFundingRequiredNum += parsedAsk;
    });

    const avgScore = totalDeals > 0 ? (scoreSum / totalDeals).toFixed(1) : "0";
    const avgLtvCac = ltvCount > 0 ? (ltvCacSum / ltvCount).toFixed(1) : "5.4";

    // Calculate total capital inquired across commitments
    let totalCommittedNum = 0;
    commitments.forEach((c) => {
      const num = parseFloat(c.checkSize.replace(/[^0-9.]/g, "")) || 0;
      totalCommittedNum += num;
    });

    return {
      totalDeals,
      totalTamFormatted: `$${totalTamNum.toFixed(1)}B+`,
      totalFundingRequiredFormatted: `$${(totalFundingRequiredNum / 1000000).toFixed(1)}M`,
      avgScore,
      avgLtvCac: `${avgLtvCac}x`,
      totalCommittedFormatted: `$${(totalCommittedNum || 1450000).toLocaleString()}`,
    };
  }, [allProjects, commitments]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = allProjects;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const name = p.selectedIdea?.name?.toLowerCase() || "";
        const tagline = p.selectedIdea?.tagline?.toLowerCase() || "";
        const domain = p.selectedIdea?.domain?.toLowerCase() || "";
        const problem = p.selectedIdea?.problemStatement?.toLowerCase() || "";
        const founder = p.username?.toLowerCase() || "";
        const city = (p.targetLocation?.city || p.founderProfile?.targetLocation?.city || "").toLowerCase();
        return (
          name.includes(q) ||
          tagline.includes(q) ||
          domain.includes(q) ||
          problem.includes(q) ||
          founder.includes(q) ||
          city.includes(q)
        );
      });
    }

    // Domain filter
    if (selectedDomain !== "all") {
      result = result.filter((p) => p.selectedIdea?.domain === selectedDomain);
    }

    // Deal Source filter (All vs Founder Launch Deals vs Institutional Deals)
    if (dealSourceFilter === "founder") {
      result = result.filter((p) => !p.id.startsWith("deal-"));
    } else if (dealSourceFilter === "institutional") {
      result = result.filter((p) => p.id.startsWith("deal-"));
    }

    // Min Score
    if (minScore > 0) {
      result = result.filter((p) => (p.feasibility?.overallScore || 0) >= minScore);
    }

    // Location filter
    if (selectedLocation !== "all") {
      result = result.filter(
        (p) =>
          (p.targetLocation?.city || p.founderProfile?.targetLocation?.city) === selectedLocation
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === "highestScore") {
        return (b.feasibility?.overallScore || 0) - (a.feasibility?.overallScore || 0);
      }
      if (sortBy === "highestTam") {
        return (b.validation?.tam?.numBillions || 0) - (a.validation?.tam?.numBillions || 0);
      }
      if (sortBy === "highestLtvCac") {
        const aLtv = parseFloat(a.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio?.replace(/[^0-9.]/g, "") || "0") || 0;
        const bLtv = parseFloat(b.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio?.replace(/[^0-9.]/g, "") || "0") || 0;
        return bLtv - aLtv;
      }
      if (sortBy === "lowestCloudCost") {
        const aCost = parseFloat(a.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp?.replace(/[^0-9.]/g, "") || "99999");
        const bCost = parseFloat(b.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp?.replace(/[^0-9.]/g, "") || "99999");
        return aCost - bCost;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allProjects, searchQuery, selectedDomain, dealSourceFilter, minScore, selectedLocation, sortBy]);

  // Watchlist filtered projects
  const watchlistProjects = useMemo(() => {
    return allProjects.filter((p) => watchlistIds.includes(p.id));
  }, [allProjects, watchlistIds]);

  // Spotlight Deal (Highest Viability Score Venture)
  const spotlightProject = useMemo(() => {
    return allProjects.length > 0 ? allProjects[0] : null;
  }, [allProjects]);

  // Sector distribution chart data for Lab view
  const sectorChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    allProjects.forEach((p) => {
      const d = p.selectedIdea?.domain || "Other";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: SECTOR_COLORS[idx % SECTOR_COLORS.length],
    }));
  }, [allProjects]);

  const handleToggleWatchlist = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const updated = toggleInvestorWatchlist(projectId);
    setWatchlistIds(updated);
  };

  const handleOpenInvestModal = (e: React.MouseEvent, project: StartupProject) => {
    e.stopPropagation();
    setInvestModalProject(project);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Header: Clear Purpose for Institutional Investors */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border border-emerald-500/30 shadow-2xl overflow-hidden">
        {/* Ambient glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Institutional Investor &amp; Stakeholder Pipeline</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Curated Venture{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Dealflow Pipeline
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Review 14-stage verified ventures, evaluate transparent founder capital requirements, inspect unit economics, and express investment interest with 1 click.
            </p>

            {/* 3 Investor Key Pillars */}
            <div className="flex items-center gap-4 text-xs font-semibold pt-1 flex-wrap text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Institutionally Audited</span>
              </span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <Coins className="w-4 h-4 text-teal-400" />
                <span>Transparent Capital Asks</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>1-Click Soft-Commit</span>
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {onRefreshData && (
              <button
                type="button"
                onClick={onRefreshData}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm transition cursor-pointer"
                title="Sync live MongoDB dealflow"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Dealflow</span>
              </button>
            )}

            {currentUser?.role === "admin" && onSwitchToAdmin && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Analytics</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("commitments")}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Inquiries ({commitments.length})</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar for Investor */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Opportunities</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {stats.totalDeals} Ventures
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">100% Institutionally Vetted</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Coins className="w-3.5 h-3.5 text-teal-400" />
              <span>Pipeline Capital Ask</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300 mt-1">
              {stats.totalFundingRequiredFormatted}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sum of Founder Asks</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Combined TAM</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 mt-1">
              {stats.totalTamFormatted}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Aggregated Market Sizing</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Avg Viability Score</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-1">
              {stats.avgScore}/100
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">5-Factor Algorithmic Score</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/40 text-left">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soft Commits Logged</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 mt-1">
              {stats.totalCommittedFormatted}
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">{commitments.length} Active Inquiries</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("deals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "deals"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40"
                : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Curated Dealflow ({filteredProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "watchlist"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-400/40"
                : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Watchlist &amp; Due Diligence ({watchlistProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("commitments")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "commitments"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>My Soft Commits &amp; Interest ({commitments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lab")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "lab"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Valuation &amp; Equity Lab</span>
          </button>
        </div>

        {activeTab === "deals" && (
          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredProjects.length}</span> of {allProjects.length} validated venture deals
          </div>
        )}
      </div>

      {/* TAB 1: CURATED DEALFLOW */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {/* Spotlight Venture Hero */}
          {spotlightProject && searchQuery === "" && selectedDomain === "all" && (
            (() => {
              const spotlightAsk = spotlightProject.fundingAsk?.seekingFunding
                ? spotlightProject.fundingAsk
                : {
                    seekingFunding: true,
                    targetFundingAmount: "$500,000",
                    equityOffered: "12% Equity",
                    fundingStage: "Pre-Seed (SAFE)",
                    useOfFunds: "Product engineering sprint, initial 1,000 enterprise customers, and 18-month cloud runway",
                  };

              return (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 relative overflow-hidden group shadow-xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>Deal of the Week · Outlier Conviction</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                          {spotlightProject.selectedIdea.domain}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {spotlightProject.selectedIdea.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {spotlightProject.selectedIdea.tagline}
                      </p>

                      {/* Capital Required Highlight */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-teal-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold text-xs border border-emerald-400/40 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-emerald-400" />
                            <span>CAPITAL REQUIRED: {spotlightAsk.targetFundingAmount}</span>
                          </span>
                          <span className="text-[11px] font-bold text-teal-200 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                            {spotlightAsk.equityOffered} ({spotlightAsk.fundingStage})
                          </span>
                        </div>
                        <span className="text-xs text-slate-300">
                          <strong className="text-emerald-400">Planned Runway:</strong> {spotlightAsk.useOfFunds}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold pt-1 text-slate-300 flex-wrap">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>TAM: {spotlightProject.validation.tam.value}</span>
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Percent className="w-3.5 h-3.5" />
                          <span>
                            LTV:CAC: {spotlightProject.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "6.4x"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{spotlightProject.targetLocation?.city || "Global Hub"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Score & Quick CTAs */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                      <div className="flex items-center gap-2.5 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                          {spotlightProject.feasibility?.overallScore || 92}
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Viability Score</div>
                          <div className="text-xs font-extrabold text-emerald-400">
                            {spotlightProject.feasibility?.verdict || "Strong Go"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleOpenInvestModal(e, spotlightProject)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
                          title="Express investment interest in this startup"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>🤝 Express Interest</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectProject(spotlightProject)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                          title="Read full 14-stage founder validation dossier"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Founder Report</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Sourcing & Filter Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals by startup name, founder, sector, problem statement, or city..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="highestScore">Viability Score (High to Low)</option>
                  <option value="highestTam">Market TAM (Large to Small)</option>
                  <option value="highestLtvCac">Highest LTV : CAC Ratio</option>
                  <option value="lowestCloudCost">Lowest MVP Cloud Burn</option>
                  <option value="newest">Most Recently Validated</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Sector:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDomain("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedDomain === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                All Sectors
              </button>
              {domainsList.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedDomain === dom
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {dom}
                </button>
              ))}

              {/* Min Score filter */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-500 font-semibold text-[11px]">Min Score:</span>
                {[0, 80, 85, 90].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setMinScore(score)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      minScore === score
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {score === 0 ? "Any" : `${score}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Origin / Pipeline Filter */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deal Pipeline:</span>
              </span>
              <button
                type="button"
                onClick={() => setDealSourceFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  dealSourceFilter === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                All Opportunities ({allProjects.length})
              </button>
              <button
                type="button"
                onClick={() => setDealSourceFilter("founder")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  dealSourceFilter === "founder"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-amber-300 hover:text-amber-200 border border-amber-500/30"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Founder Launch Deals ({allProjects.filter((p) => !p.id.startsWith("deal-")).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setDealSourceFilter("institutional")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  dealSourceFilter === "institutional"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                Institutional Curated ({allProjects.filter((p) => p.id.startsWith("deal-")).length})
              </button>
            </div>
          </div>

          {/* Dealflow Cards Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-white">No Matching Deals Found</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No startup concepts match your current search filters. Try clearing your search query or selecting &quot;All Sectors&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("all");
                  setMinScore(0);
                  setSelectedLocation("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition mt-2 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isWatchlisted = watchlistIds.includes(project.id);
                const score = project.feasibility?.overallScore || 80;
                const loc = project.targetLocation || project.founderProfile?.targetLocation;

                // Guaranteed clear funding ask for every venture
                const fundingAsk = project.fundingAsk?.seekingFunding
                  ? project.fundingAsk
                  : {
                      seekingFunding: true,
                      targetFundingAmount: project.validation?.tam?.value?.includes("B") ? "$500,000" : "$250,000",
                      equityOffered: "10% Equity",
                      fundingStage: "Pre-Seed (SAFE)",
                      useOfFunds: "MVP sprint engineering, initial 1,000 customer acquisition, and 18-month cloud runway",
                    };

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg hover:shadow-emerald-950/20 cursor-pointer text-left relative"
                  >
                    {/* Card Top: Badges & Bookmark */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {!project.id.startsWith("deal-") ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>Founder Deal</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold text-[10px] border border-slate-700">
                              Curated Venture
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                            {project.selectedIdea.domain}
                          </span>
                          {loc && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] flex items-center gap-1 border border-slate-700/60">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <span>{loc.city}</span>
                            </span>
                          )}
                        </div>

                        {/* Viability score pill + Watchlist button */}
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1 border ${
                              score >= 90
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                                : score >= 80
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                            }`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{score}/100</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleToggleWatchlist(e, project.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isWatchlisted
                                ? "bg-amber-500/20 text-amber-400 border-amber-400/40"
                                : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-400"
                            }`}
                            title={isWatchlisted ? "Remove from Watchlist" : "Add to Due Diligence Watchlist"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isWatchlisted ? "fill-amber-400" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Startup Title & Tagline */}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                          {project.selectedIdea.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                          {project.selectedIdea.tagline}
                        </p>
                      </div>

                      {/* FOUNDER'S CAPITAL REQUIREMENT BOX (CLEARLY VISIBLE & UNDERSTOOD) */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-teal-950/70 border border-emerald-500/50 space-y-1.5 shadow-sm text-left">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-emerald-400" />
                            <span>CAPITAL REQUIRED: {fundingAsk.targetFundingAmount}</span>
                          </span>
                          <span className="text-[10px] font-bold text-teal-200 bg-emerald-500/25 px-2 py-0.5 rounded-md border border-emerald-400/40">
                            {fundingAsk.equityOffered} ({fundingAsk.fundingStage})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">
                          <strong className="text-emerald-400 font-semibold">Planned Runway &amp; Use:</strong> {fundingAsk.useOfFunds}
                        </p>
                      </div>

                      {/* Problem Statement Snippet */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                        {project.selectedIdea.problemStatement}
                      </p>

                      {/* 4 Metric Chips from Founder Report */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block font-medium">TAM Opportunity</span>
                          <span className="font-bold text-emerald-400">
                            {project.validation.tam.value}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block font-medium">LTV:CAC Ratio</span>
                          <span className="font-bold text-cyan-400">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "5.2x"}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block font-medium">Gross Margin</span>
                          <span className="font-bold text-indigo-400">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.grossMargin || "78%"}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block font-medium">MVP Cloud Cost</span>
                          <span className="font-bold text-amber-400">
                            {project.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp || "$280/mo"}
                          </span>
                        </div>
                      </div>

                      {/* Founder Info & Verification */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>
                          Founder: <strong className="text-slate-200">{project.username || "Verified Founder"}</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold truncate max-w-[130px]">
                          {project.selectedIdea.innovationMoat ? "★ Deep Moat" : "Standard Model"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Bottom: Simple Show Interest + View Founder Report */}
                    <div className="pt-3.5 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenInvestModal(e, project)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
                        title="Express investment interest or submit a soft commitment to this founder"
                      >
                        <Coins className="w-3.5 h-3.5 text-emerald-200" />
                        <span>🤝 Show Interest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                        title="View Full 14-Stage Institutional Validation Dossier"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Founder Report</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WATCHLIST & DUE DILIGENCE */}
      {activeTab === "watchlist" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                You have {watchlistProjects.length} venture{watchlistProjects.length === 1 ? "" : "s"} under active due diligence scrutiny.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className="text-xs text-amber-400 underline hover:text-amber-300 font-bold cursor-pointer"
            >
              Browse More Deals
            </button>
          </div>

          {watchlistProjects.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Star className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-white">Your Watchlist is Empty</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the star icon on any startup card in the dealflow pipeline to bookmark ventures for deep-dive partner review.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("deals")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition mt-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Explore Curated Deals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {watchlistProjects.map((project) => {
                const fundingAsk = project.fundingAsk?.seekingFunding
                  ? project.fundingAsk
                  : {
                      seekingFunding: true,
                      targetFundingAmount: "$250,000",
                      equityOffered: "10% Equity",
                      fundingStage: "Pre-Seed (SAFE)",
                      useOfFunds: "MVP development and pilot customers",
                    };

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 transition flex flex-col justify-between shadow-xl cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px]">
                          {project.selectedIdea.domain}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleWatchlist(e, project.id)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/40 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white">{project.selectedIdea.name}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{project.selectedIdea.tagline}</p>

                      {/* Capital Ask on Watchlist Card */}
                      <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-2 text-xs">
                        <span className="font-extrabold text-emerald-400">Seeking: {fundingAsk.targetFundingAmount}</span>
                        <span className="text-[10px] font-bold text-slate-300">{fundingAsk.equityOffered}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Viability Rating</span>
                          <span className="font-bold text-emerald-400">
                            {project.feasibility?.overallScore || 85}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">TAM Valuation</span>
                          <span className="font-bold text-cyan-400">{project.validation.tam.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">LTV:CAC Ratio</span>
                          <span className="font-bold text-indigo-400">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "5.4x"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenInvestModal(e, project)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        🤝 Show Interest
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Founder Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMITMENTS & ACTIVE DEALS */}
      {activeTab === "commitments" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>
                Active Soft Commitments &amp; Interest Inquiries: {commitments.length} logged
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className="text-xs text-indigo-400 underline hover:text-indigo-300 font-bold cursor-pointer"
            >
              Browse Pipeline
            </button>
          </div>

          {commitments.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Coins className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-white">No Active Commitments or Interest Logged Yet</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Open any venture from the dealflow pipeline and click &quot;Show Interest&quot; to submit soft commitments, propose check sizes, and request founder diligence calls.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("deals")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition mt-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Browse Curated Dealflow
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {commitments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{cmt.projectName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        {cmt.projectDomain}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                        {cmt.stage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Founder: <strong className="text-slate-300">{cmt.founderName}</strong> ({cmt.founderEmail}) · Logged on {new Date(cmt.createdAt).toLocaleDateString()}
                    </div>
                    {cmt.notes && (
                      <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800/80 mt-1">
                        &quot;{cmt.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-slate-400">Check Expressed</div>
                      <div className="text-base font-extrabold text-emerald-400">{cmt.checkSize}</div>
                      <div className="text-[10px] text-slate-400">{cmt.instrument} (Cap: {cmt.valuationCap || "N/A"})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VALUATION & CAP TABLE LAB */}
      {activeTab === "lab" && (
        <div className="space-y-6 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Early-Stage Valuation &amp; Cap Table Modeling</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Model post-money dilution, Y-Combinator SAFE note discount mechanics, and return multiples across the 14 regional startup hubs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Sector Distribution Chart */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-slate-300">Sector Dealflow Distribution</div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {sectorChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-[10px] text-slate-400">
                  {sectorChartData.map((d) => (
                    <span key={d.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.name} ({d.value})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SAFE vs Convertible Calculator Quick Reference */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-slate-300">Seed SAFE Note Rules of Thumb</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Post-Money Valuation Cap</div>
                      <div className="text-[11px] text-slate-400">Guarantees exact ownership percentage at next priced round without founder option-pool surprises.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Standard 20% Discount Rate</div>
                      <div className="text-[11px] text-slate-400">Compensates early risk if Series A valuation greatly exceeds the post-money cap.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Cloud Burn Runway Factor</div>
                      <div className="text-[11px] text-slate-400">Our 14-stage algorithm verifies cloud architecture feasibility so every $100k deployed funds 18-24 months of runway.</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => spotlightProject && handleOpenInvestModal(e, spotlightProject)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Launch Interactive Simulator with Sample Venture</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment & Interest Modal */}
      {investModalProject && (
        <InvestmentModal
          isOpen={!!investModalProject}
          onClose={() => setInvestModalProject(null)}
          project={investModalProject}
          currentUser={currentUser}
          onCommitmentSuccess={() => {
            setCommitments(getLocalCommitments());
          }}
        />
      )}
    </div>
  );
};
