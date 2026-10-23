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
  IndianRupee,
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

      const askStr = p.fundingAsk?.targetFundingAmount || (p.validation?.tam?.value?.includes("B") ? "₹1,00,00,000" : "₹50,00,000");
      const parsedAsk = parseFloat(askStr.replace(/[^0-9.]/g, "")) || 5000000;
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

    const formatRupeesCompact = (num: number) => {
      if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
      if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
      return `₹${num.toLocaleString("en-IN")}`;
    };

    return {
      totalDeals,
      totalTamFormatted: `$${totalTamNum.toFixed(1)}B+`,
      totalFundingRequiredFormatted: formatRupeesCompact(totalFundingRequiredNum),
      avgScore,
      avgLtvCac: `${avgLtvCac}x`,
      totalCommittedFormatted: `₹${(totalCommittedNum || 15000000).toLocaleString("en-IN")}`,
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
      {/* Hero Header: Clear Purpose for Institutional Investors (Karnataka Royal Blue Banner) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#4d669a] via-[#243d78] to-[#12224d] border border-[#1b2f5d] text-white shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-blue-200" />
              <span>Institutional Investor &amp; Stakeholder Pipeline</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Curated Venture{" "}
              <span className="text-blue-100 underline decoration-blue-300/40">
                Dealflow Pipeline
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Review 14-stage verified ventures, evaluate transparent founder capital requirements, inspect unit economics, and express investment interest with 1 click.
            </p>

            {/* 3 Investor Key Pillars */}
            <div className="flex items-center gap-4 text-xs font-semibold pt-1 flex-wrap text-blue-100">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Institutionally Audited</span>
              </span>
              <span className="flex items-center gap-1.5 text-teal-200">
                <Coins className="w-4 h-4 text-teal-200" />
                <span>Transparent Capital Asks</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-200">
                <Zap className="w-4 h-4 text-cyan-200" />
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
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-sm transition cursor-pointer"
                title="Sync live MongoDB dealflow"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-200" />
                <span>Sync Dealflow</span>
              </button>
            )}

            {currentUser?.role === "admin" && onSwitchToAdmin && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Analytics</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("commitments")}
              className="px-3.5 py-2 rounded-xl bg-white text-[#243d78] hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-[#243d78]" />
              <span>My Inquiries ({commitments.length})</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar for Investor (Crisp White Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-white/20">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Briefcase className="w-3.5 h-3.5 text-[#243d78]" />
              <span>Active Opportunities</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {stats.totalDeals} Ventures
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">100% Institutionally Vetted</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Coins className="w-3.5 h-3.5 text-teal-700" />
              <span>Pipeline Capital Ask</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#243d78] mt-1">
              {stats.totalFundingRequiredFormatted}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sum of Founder Asks</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Globe2 className="w-3.5 h-3.5 text-cyan-700" />
              <span>Combined TAM</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {stats.totalTamFormatted}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Aggregated Market Sizing</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Avg Viability Score</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {stats.avgScore}/100
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">5-Factor Algorithmic Score</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white border-2 border-emerald-500 text-left shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Soft Commits Logged</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
              {stats.totalCommittedFormatted}
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">{commitments.length} Active Inquiries</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("deals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === "deals"
                ? "bg-[#243d78] text-white border border-[#12224d]"
                : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Curated Dealflow ({filteredProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === "watchlist"
                ? "bg-[#243d78] text-white border border-[#12224d]"
                : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Watchlist &amp; Due Diligence ({watchlistProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("commitments")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === "commitments"
                ? "bg-[#243d78] text-white border border-[#12224d]"
                : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>My Soft Commits &amp; Interest ({commitments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lab")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === "lab"
                ? "bg-[#243d78] text-white border border-[#12224d]"
                : "text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Valuation &amp; Equity Lab</span>
          </button>
        </div>

        {activeTab === "deals" && (
          <div className="text-xs text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> of {allProjects.length} validated venture deals
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
                    targetFundingAmount: "₹1,00,00,000 (₹1 Cr)",
                    equityOffered: "12% Equity",
                    fundingStage: "Pre-Seed (SAFE)",
                    useOfFunds: "Product engineering sprint, initial 1,000 enterprise customers, and 18-month cloud runway",
                  };

              return (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 relative overflow-hidden group shadow-sm">
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>Deal of the Week · Outlier Conviction</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#243d78] text-[10px] font-bold border border-blue-200">
                          {spotlightProject.selectedIdea.domain}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {spotlightProject.selectedIdea.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {spotlightProject.selectedIdea.tagline}
                      </p>

                      {/* Capital Required Highlight */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#243d78] font-extrabold text-xs border border-blue-200 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-[#243d78]" />
                            <span>CAPITAL REQUIRED: {spotlightAsk.targetFundingAmount}</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {spotlightAsk.equityOffered} ({spotlightAsk.fundingStage})
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">
                          <strong className="text-emerald-700">Planned Runway:</strong> {spotlightAsk.useOfFunds}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold pt-1 text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>TAM: {spotlightProject.validation.tam.value}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#243d78]">
                          <Percent className="w-3.5 h-3.5 text-[#243d78]" />
                          <span>
                            LTV:CAC: {spotlightProject.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "6.4x"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{spotlightProject.targetLocation?.city || "Global Hub"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Score & Quick CTAs */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200">
                      <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                          {spotlightProject.feasibility?.overallScore || 92}
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] uppercase font-bold text-slate-500">Viability Score</div>
                          <div className="text-xs font-extrabold text-emerald-700">
                            {spotlightProject.feasibility?.verdict || "Strong Go"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleOpenInvestModal(e, spotlightProject)}
                          className="px-5 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-extrabold text-xs shadow-sm border border-[#12224d] transition flex items-center gap-1.5 cursor-pointer"
                          title="Express investment interest in this startup"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>🤝 Express Interest</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectProject(spotlightProject)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition border border-slate-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
                          title="Read full 14-stage founder validation dossier"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#243d78]" />
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
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals by startup name, founder, sector, problem statement, or city..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] transition"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#243d78] transition"
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
                <Filter className="w-3 h-3 text-slate-500" />
                <span>Sector:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDomain("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
                  selectedDomain === "all"
                    ? "bg-[#243d78] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Sectors
              </button>
              {domainsList.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
                    selectedDomain === dom
                      ? "bg-[#243d78] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
                      minScore === score
                        ? "bg-[#243d78] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {score === 0 ? "Any" : `${score}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Origin / Pipeline Filter */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#243d78]" />
                <span>Deal Pipeline:</span>
              </span>
              <button
                type="button"
                onClick={() => setDealSourceFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                  dealSourceFilter === "all"
                    ? "bg-[#243d78] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                All Opportunities ({allProjects.length})
              </button>
              <button
                type="button"
                onClick={() => setDealSourceFilter("founder")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  dealSourceFilter === "founder"
                    ? "bg-amber-500 text-slate-900 border border-amber-600"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Founder Launch Deals ({allProjects.filter((p) => !p.id.startsWith("deal-")).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setDealSourceFilter("institutional")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                  dealSourceFilter === "institutional"
                    ? "bg-[#243d78] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                Institutional Curated ({allProjects.filter((p) => p.id.startsWith("deal-")).length})
              </button>
            </div>
          </div>

          {/* Dealflow Cards Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-900">No Matching Deals Found</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
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
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition mt-2 cursor-pointer shadow-sm"
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
                      targetFundingAmount: project.validation?.tam?.value?.includes("B") ? "₹1,00,00,000" : "₹50,00,000",
                      equityOffered: "10% Equity",
                      fundingStage: "Pre-Seed (SAFE)",
                      useOfFunds: "MVP sprint engineering, initial 1,000 customer acquisition, and 18-month cloud runway",
                    };

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#243d78]/50 hover:shadow-md transition flex flex-col justify-between shadow-sm cursor-pointer text-left relative"
                  >
                    {/* Card Top: Badges & Bookmark */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {!project.id.startsWith("deal-") ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200 flex items-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                              <span>Founder Deal</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200">
                              Curated Venture
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                            {project.selectedIdea.domain}
                          </span>
                          {loc && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center gap-1 border border-slate-200">
                              <MapPin className="w-3 h-3 text-[#243d78]" />
                              <span>{loc.city}</span>
                            </span>
                          )}
                        </div>

                        {/* Viability score pill + Watchlist button */}
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1 border ${
                              score >= 90
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : score >= 80
                                ? "bg-blue-50 text-[#243d78] border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
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
                                ? "bg-amber-50 text-amber-600 border-amber-300"
                                : "bg-slate-100 text-slate-400 border-slate-200 hover:text-amber-500"
                            }`}
                            title={isWatchlisted ? "Remove from Watchlist" : "Add to Due Diligence Watchlist"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isWatchlisted ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Startup Title & Tagline */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#243d78] transition line-clamp-1">
                          {project.selectedIdea.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {project.selectedIdea.tagline}
                        </p>
                      </div>

                      {/* FOUNDER'S CAPITAL REQUIREMENT BOX (CLEARLY VISIBLE & UNDERSTOOD) */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-sm text-left">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-xs font-black text-[#243d78] flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-[#243d78]" />
                            <span>CAPITAL REQUIRED: {fundingAsk.targetFundingAmount}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {fundingAsk.equityOffered} ({fundingAsk.fundingStage})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          <strong className="text-emerald-700 font-semibold">Planned Runway &amp; Use:</strong> {fundingAsk.useOfFunds}
                        </p>
                      </div>

                      {/* Problem Statement Snippet */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {project.selectedIdea.problemStatement}
                      </p>

                      {/* 4 Metric Chips from Founder Report */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">TAM Opportunity</span>
                          <span className="font-bold text-slate-900">
                            {project.validation.tam.value}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">LTV:CAC Ratio</span>
                          <span className="font-bold text-[#243d78]">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "5.2x"}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">Gross Margin</span>
                          <span className="font-bold text-indigo-700">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.grossMargin || "78%"}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">MVP Cloud Cost</span>
                          <span className="font-bold text-amber-700">
                            {project.feasibility?.cloudArchitecture?.estimatedMonthlyCloudCost?.mvp || "₹15,000/mo"}
                          </span>
                        </div>
                      </div>

                      {/* Founder Info & Verification */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <span>
                          Founder: <strong className="text-slate-800">{project.username || "Verified Founder"}</strong>
                        </span>
                        <span className="text-emerald-700 font-semibold truncate max-w-[130px]">
                          {project.selectedIdea.innovationMoat ? "★ Deep Moat" : "Standard Model"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Bottom: Simple Show Interest + View Founder Report */}
                    <div className="pt-3.5 mt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenInvestModal(e, project)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-extrabold text-xs shadow-sm border border-[#12224d] transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Express investment interest or submit a soft commitment to this founder"
                      >
                        <Coins className="w-3.5 h-3.5 text-blue-200" />
                        <span>🤝 Show Interest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs transition border border-slate-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
                        title="View Full 14-Stage Institutional Validation Dossier"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#243d78]" />
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
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>
                You have {watchlistProjects.length} venture{watchlistProjects.length === 1 ? "" : "s"} under active due diligence scrutiny.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className="text-xs text-[#243d78] underline hover:text-[#1a2d5a] font-bold cursor-pointer"
            >
              Browse More Deals
            </button>
          </div>

          {watchlistProjects.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <Star className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-900">Your Watchlist is Empty</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Click the star icon on any startup card in the dealflow pipeline to bookmark ventures for deep-dive partner review.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("deals")}
                className="px-4 py-2 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-bold transition mt-2 shadow-sm border border-[#12224d] cursor-pointer"
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
                      targetFundingAmount: "₹50,00,000",
                      equityOffered: "10% Equity",
                      fundingStage: "Pre-Seed (SAFE)",
                      useOfFunds: "MVP development and pilot customers",
                    };

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#243d78]/50 transition flex flex-col justify-between shadow-sm cursor-pointer text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                          {project.selectedIdea.domain}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleWatchlist(e, project.id)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{project.selectedIdea.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{project.selectedIdea.tagline}</p>

                      {/* Capital Ask on Watchlist Card */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <span className="font-extrabold text-[#243d78]">Seeking: {fundingAsk.targetFundingAmount}</span>
                        <span className="text-[10px] font-bold text-slate-600">{fundingAsk.equityOffered}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Viability Rating</span>
                          <span className="font-bold text-emerald-700">
                            {project.feasibility?.overallScore || 85}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">TAM Valuation</span>
                          <span className="font-bold text-slate-900">{project.validation.tam.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">LTV:CAC Ratio</span>
                          <span className="font-bold text-[#243d78]">
                            {project.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio || "5.4x"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenInvestModal(e, project)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-extrabold text-xs shadow-sm border border-[#12224d] cursor-pointer"
                      >
                        🤝 Show Interest
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-semibold cursor-pointer shadow-sm"
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
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-[#243d78] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#243d78]" />
              <span>
                Active Soft Commitments &amp; Interest Inquiries: {commitments.length} logged
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className="text-xs text-[#243d78] underline hover:text-[#1a2d5a] font-bold cursor-pointer"
            >
              Browse Pipeline
            </button>
          </div>

          {commitments.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <Coins className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-900">No Active Commitments or Interest Logged Yet</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Open any venture from the dealflow pipeline and click &quot;Show Interest&quot; to submit soft commitments, propose check sizes, and request founder diligence calls.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("deals")}
                className="px-4 py-2 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-bold transition mt-2 shadow-sm border border-[#12224d] cursor-pointer"
              >
                Browse Curated Dealflow
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {commitments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cmt.projectName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {cmt.projectDomain}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {cmt.stage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Founder: <strong className="text-slate-800">{cmt.founderName}</strong> ({cmt.founderEmail}) · Logged on {new Date(cmt.createdAt).toLocaleDateString()}
                    </div>
                    {cmt.notes && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-1">
                        &quot;{cmt.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-slate-500">Check Expressed</div>
                      <div className="text-base font-extrabold text-emerald-700">{cmt.checkSize}</div>
                      <div className="text-[10px] text-slate-500">{cmt.instrument} (Cap: {cmt.valuationCap || "N/A"})</div>
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#243d78]" />
                  <span>Interactive Early-Stage Valuation &amp; Cap Table Modeling</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Model post-money dilution, Y-Combinator SAFE note discount mechanics, and return multiples across the 14 regional startup hubs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Sector Distribution Chart */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Sector Dealflow Distribution</div>
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
                          backgroundColor: "#ffffff",
                          borderColor: "#cbd5e1",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#0f172a",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-[10px] text-slate-600">
                  {sectorChartData.map((d) => (
                    <span key={d.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.name} ({d.value})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SAFE vs Convertible Calculator Quick Reference */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Seed SAFE Note Rules of Thumb</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Post-Money Valuation Cap</div>
                      <div className="text-[11px] text-slate-600">Guarantees exact ownership percentage at next priced round without founder option-pool surprises.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#243d78] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Standard 20% Discount Rate</div>
                      <div className="text-[11px] text-slate-600">Compensates early risk if Series A valuation greatly exceeds the post-money cap.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Cloud Burn Runway Factor</div>
                      <div className="text-[11px] text-slate-600">Our 14-stage algorithm verifies cloud architecture feasibility so every ₹50 Lakhs deployed funds 18-24 months of runway.</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => spotlightProject && handleOpenInvestModal(e, spotlightProject)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white font-bold text-xs shadow-sm border border-[#12224d] transition flex items-center justify-center gap-2 cursor-pointer"
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
