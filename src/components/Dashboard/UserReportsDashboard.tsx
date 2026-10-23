"use client";

import React, { useState, useMemo } from "react";
import {
  Zap,
  FolderHeart,
  Sparkles,
  TrendingUp,
  Award,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  Scale,
  MapPin,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Target,
  Briefcase,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Activity,
  Coins,
  Globe,
  Lock,
  ShieldCheck,
  Bell,
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
} from "recharts";
import { User, StartupProject, FounderNotification } from "@/types";
import { deleteProjectFromVault, exportProjectAsMarkdown } from "@/lib/storage";
import { getNotificationsForFounder } from "@/lib/notifications";
import { SeekFundingModal } from "./SeekFundingModal";

interface UserReportsDashboardProps {
  currentUser: User;
  projects: StartupProject[];
  onSelectProject: (p: StartupProject) => void;
  onStartNewValidation: () => void;
  onOpenCompare?: () => void;
  onRefreshData?: () => void;
  notifications?: FounderNotification[];
  onOpenNotifications?: () => void;
}

export const UserReportsDashboard: React.FC<UserReportsDashboardProps> = ({
  currentUser,
  projects,
  onSelectProject,
  onStartNewValidation,
  onOpenCompare,
  onRefreshData,
  notifications: initialNotifications,
  onOpenNotifications,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "highestScore" | "highestTam">("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showPortfolioChart, setShowPortfolioChart] = useState(true);
  const [fundingModalProject, setFundingModalProject] = useState<StartupProject | null>(null);

  // Notifications state
  const [founderNotifications, setFounderNotifications] = useState<FounderNotification[]>(() => {
    if (initialNotifications) return initialNotifications;
    return getNotificationsForFounder(currentUser.username, currentUser.email);
  });

  // Sync notifications on mount and event triggers
  React.useEffect(() => {
    if (initialNotifications) {
      setFounderNotifications(initialNotifications);
    } else {
      setFounderNotifications(getNotificationsForFounder(currentUser.username, currentUser.email));
    }

    const handleNewNotif = () => {
      setFounderNotifications(getNotificationsForFounder(currentUser.username, currentUser.email));
    };

    window.addEventListener("startupgen_founder_notification", handleNewNotif);
    window.addEventListener("startupgen_founder_notification_read", handleNewNotif);
    return () => {
      window.removeEventListener("startupgen_founder_notification", handleNewNotif);
      window.removeEventListener("startupgen_founder_notification_read", handleNewNotif);
    };
  }, [currentUser, initialNotifications]);

  // Latest unread or most recent investor interest
  const latestInterest = useMemo(() => {
    if (founderNotifications.length === 0) return null;
    const unread = founderNotifications.find((n) => !n.read);
    return unread || founderNotifications[0];
  }, [founderNotifications]);

  // Portfolio comparison data for comparative bar chart
  const portfolioComparisonData = useMemo(() => {
    return projects.slice(0, 8).map((p, idx) => {
      const palette = ["#06b6d4", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#3b82f6"];
      const score = p.feasibility?.overallScore || 0;
      const ltvCac = parseFloat(p.feasibility?.revenueModel?.keyUnitEconomics?.ltvCacRatio?.replace(/[^0-9.]/g, "") || "0") || 0;
      return {
        name: p.selectedIdea?.name?.split(" ")[0]?.substring(0, 12) || `Concept ${idx + 1}`,
        fullName: p.selectedIdea?.name || `Startup ${idx + 1}`,
        domain: p.selectedIdea?.domain || "Technology",
        viabilityScore: score,
        ltvCacRatio: ltvCac,
        color: palette[idx % palette.length],
        project: p,
      };
    });
  }, [projects]);

  // Compute domains list for filter pills
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.selectedIdea?.domain) set.add(p.selectedIdea.domain);
    });
    return Array.from(set);
  }, [projects]);

  // Executive KPI summary computations
  const stats = useMemo(() => {
    const total = projects.length;
    if (total === 0) {
      return {
        total: 0,
        maxScore: 0,
        highestScoreVerdict: "N/A",
        topDomain: "None",
        primaryProvider: "N/A",
        publishedCount: 0,
      };
    }

    let maxScore = 0;
    let highestScoreVerdict = "";
    let publishedCount = 0;
    const domainCounts: Record<string, number> = {};

    projects.forEach((p) => {
      const score = p.feasibility?.overallScore || 0;
      if (score > maxScore) {
        maxScore = score;
        highestScoreVerdict = p.feasibility?.verdict || "Strong Go";
      }
      const dom = p.selectedIdea?.domain || "General";
      domainCounts[dom] = (domainCounts[dom] || 0) + 1;

      if (p.isPublishedForInvestors === true || p.fundingAsk?.seekingFunding === true) {
        publishedCount++;
      }
    });

    const topDomain = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

    return {
      total,
      maxScore,
      highestScoreVerdict,
      topDomain,
      publishedCount,
    };
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((p) => {
      const name = p.selectedIdea?.name || "";
      const domain = p.selectedIdea?.domain || "";
      const tagline = p.selectedIdea?.tagline || "";
      const loc = p.targetLocation?.city || p.founderProfile?.targetLocation?.city || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain =
        selectedDomainFilter === "all" ||
        p.selectedIdea?.domain?.toLowerCase() === selectedDomainFilter.toLowerCase();

      return matchesSearch && matchesDomain;
    });

    result.sort((a, b) => {
      if (sortBy === "highestScore") {
        return (b.feasibility?.overallScore || 0) - (a.feasibility?.overallScore || 0);
      }
      if (sortBy === "highestTam") {
        const parseTam = (str?: string) => {
          if (!str) return 0;
          // Check for Indian Crores (e.g. ₹42,000 Crores, ₹12,10,000 Cr)
          const inrCroreMatch = str.match(/₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:Crores?|Cr)/i);
          if (inrCroreMatch) {
            return parseFloat(inrCroreMatch[1].replace(/,/g, ""));
          }
          // Check for Indian Lakhs (e.g. ₹5,000 Lakhs)
          const inrLakhMatch = str.match(/₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:Lakhs?|Lac)/i);
          if (inrLakhMatch) {
            return parseFloat(inrLakhMatch[1].replace(/,/g, "")) / 100;
          }
          const match = str.match(/\$?([0-9.]+)\s*([BMK]?)/i);
          if (!match) return 0;
          let val = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          if (unit === "B") val *= 8350; // Convert USD B to Crores approx
          else if (unit === "M") val *= 8.35; // Convert USD M to Crores approx
          return val;
        };
        return parseTam(b.validation?.tam?.value) - parseTam(a.validation?.tam?.value);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [projects, searchTerm, selectedDomainFilter, sortBy]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this validated startup report? This cannot be undone.")) {
      setDeletingId(id);
      try {
        await deleteProjectFromVault(id, currentUser);
        if (onRefreshData) onRefreshData();
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDownloadMarkdown = (p: StartupProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const md = exportProjectAsMarkdown(p);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.selectedIdea.name.toLowerCase().replace(/\s+/g, "-")}-validation-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#4d669a] via-[#243d78] to-[#12224d] border border-blue-300/35 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/60">
        {/* Radiant top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-cyan-300 via-sky-200 to-indigo-300" />
        
        {/* Soft atmospheric ambient glows matching the portal aesthetic */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-300/[0.14] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 bg-blue-400/[0.16] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-16 w-60 h-60 bg-indigo-300/[0.12] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-200/40 text-blue-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-950/50 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Founder Workspace
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentUser.isNewUser || projects.length === 0 ? "Welcome, " : "Welcome back, "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-100 font-extrabold">{currentUser.name || currentUser.username}</span>!
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              {currentUser.isNewUser || projects.length === 0
                ? "Start your venture journey by generating institutional startup reports, real-time market sizing, and execution roadmaps with our 14-stage AI validation engine."
                : "Access your institutional startup reports, real-time market sizing, and execution roadmaps. Review previous validations or spin up a new multi-sector concept."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {onOpenCompare && projects.length >= 2 && (
              <button
                type="button"
                onClick={onOpenCompare}
                className="px-4 py-3 rounded-2xl bg-blue-950/80 text-blue-100 border border-blue-300/40 hover:border-cyan-300 hover:text-white transition flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-cyan-500/20 cursor-pointer backdrop-blur-md"
                title="Compare Multiple Saved Concepts"
              >
                <Scale className="w-4 h-4 text-cyan-300" />
                <span>Compare ({projects.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartNewValidation}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white text-sm font-bold shadow-xl shadow-blue-950/50 border border-cyan-300/40 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Validate New Startup Concept</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Investor Interest Alert Banner for Founder */}
      {latestInterest && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Coins className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>NEW INVESTOR INTEREST RECEIVED</span>
                </span>
                {!latestInterest.read && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300">
                    Unread Inquiry
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                <span className="text-emerald-700">{latestInterest.investorName}</span>
                {latestInterest.investorFirm && <span className="text-slate-600"> ({latestInterest.investorFirm})</span>}
                {" "}expressed interest in <span className="text-blue-700 font-bold underline decoration-blue-500/50 underline-offset-4">{latestInterest.projectName}</span>!
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                <span>Proposed Check Size: <strong className="text-emerald-700 font-mono text-sm">{latestInterest.checkSize}</strong></span>
                <span>·</span>
                <span>Structure: <strong className="text-slate-900">{latestInterest.instrument}</strong></span>
                {latestInterest.notes && (
                  <>
                    <span>·</span>
                    <span className="italic text-slate-500">&ldquo;{latestInterest.notes}&rdquo;</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0 self-start md:self-center flex-wrap">
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 border border-emerald-400/40 transition flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Review Inquiries ({founderNotifications.length})</span>
              </button>
            )}
            <a
              href={`mailto:${latestInterest.investorEmail}?subject=Re:%20Investment%20Interest%20in%20${encodeURIComponent(latestInterest.projectName)}`}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-emerald-500 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Investor</span>
            </a>
          </div>
        </div>
      )}

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Saved Reports */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Saved Reports</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <FolderHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
          <div className="text-xs text-blue-700 mt-1.5 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Persisted in Cloud Vault & MongoDB</span>
          </div>
        </div>

        {/* Card 2: Peak Viability Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Peak Viability Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats.maxScore > 0 ? `${stats.maxScore}/100` : "—"}
            </span>
          </div>
          <div className="text-xs text-emerald-700 mt-1.5 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{stats.maxScore > 0 ? `Rating: ${stats.highestScoreVerdict}` : "Awaiting first validation"}</span>
          </div>
        </div>

        {/* Card 3: Top Industry Domain */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Top Industry Domain</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 truncate" title={stats.topDomain}>
            {stats.topDomain}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            {availableDomains.length > 0 ? `${availableDomains.length} unique sector(s) validated` : "Multi-sector engine ready"}
          </div>
        </div>

        {/* Card 4: Investor Launch Funding */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Investor Launch Deals</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.publishedCount} of {stats.total} Listed
          </div>
          <div className="text-xs text-teal-700 mt-1.5 font-medium flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>{stats.publishedCount > 0 ? "Live for angel syndicate reviews" : "Allow ideas below to seek funding"}</span>
          </div>
        </div>
      </div>

      {/* Portfolio Comparison Benchmark Chart Card (if 2 or more projects exist) */}
      {projects.length >= 2 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Portfolio Concept Comparison &amp; Viability Benchmarks
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {projects.length} Saved Concepts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side benchmark of algorithmic viability scores and capital efficiency across your saved portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {onOpenCompare && (
                <button
                  type="button"
                  onClick={onOpenCompare}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                  title="Open Deep Comparison Modal with Radar & Revenue Ramp"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Deep Compare Modal</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPortfolioChart(!showPortfolioChart)}
                className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                title={showPortfolioChart ? "Collapse Chart" : "Expand Chart"}
              >
                {showPortfolioChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showPortfolioChart && (
            <div className="space-y-3 pt-1">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioComparisonData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#94a3b8"
                      tickFormatter={(val) => `${val}`}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(val: any, _name: any, item: any) => [
                        `${val}/100 Viability (${item.payload.domain} · LTV:CAC ${item.payload.ltvCacRatio}x)`,
                        item.payload.fullName,
                      ]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                        color: "#0f172a",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="viabilityScore"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                      onClick={(entry: any) => {
                        if (entry && entry.project) {
                          onSelectProject(entry.project);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {portfolioComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Click any bar to instantly open that startup concept&apos;s full validation memo.
                </span>
                <span className="text-slate-400 font-mono">
                  Scale: 0 - 100 Viability Score
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search, Domain Filter Pills, and Sort Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by startup name, sector, tagline, or launch city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 absolute right-3 top-1/2 -translate-y-1/2 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {availableDomains.length > 1 && (
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Sectors ({projects.length})</option>
              {availableDomains.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="highestScore">Sort: Highest Viability</option>
            <option value="highestTam">Sort: Highest Market TAM</option>
          </select>

          {onRefreshData && (
            <button
              type="button"
              onClick={onRefreshData}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition cursor-pointer shadow-sm"
              title="Refresh Reports from Database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reports Listing */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          {projects.length === 0 ? (
            <>
              <h3 className="text-xl font-bold text-slate-900">No Validated Reports Yet</h3>
              <p className="text-sm text-slate-600 max-w-md mt-1.5 mb-6 leading-relaxed">
                You haven&apos;t generated any startup reports yet. Step through our 14-stage multi-sector validation engine to build your first institutional validation report.
              </p>
              <button
                type="button"
                onClick={onStartNewValidation}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold shadow-md shadow-blue-600/30 border border-cyan-400/30 transition flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Launch 14-Stage Validation Engine</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900">No Matching Reports</h3>
              <p className="text-sm text-slate-600 max-w-md mt-1 mb-4">
                No startup reports match your search term &quot;{searchTerm}&quot; or chosen sector filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDomainFilter("all");
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                Reset Search Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAndSortedProjects.map((p) => {
            const loc = p.targetLocation || p.founderProfile?.targetLocation;
            const score = p.feasibility?.overallScore || 70;
            const verdict = p.feasibility?.verdict || "Conditional Go";
            const isHighScore = score >= 80;
            const isMediumScore = score >= 65 && score < 80;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between shadow-sm cursor-pointer overflow-hidden transform hover:-translate-y-0.5"
              >
                {/* Top radiant highlight bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isHighScore
                      ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
                      : isMediumScore
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"
                      : "bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400"
                  }`}
                />

                <div className="space-y-3.5">
                  {/* Card Header: Badges & Date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                        {p.selectedIdea?.domain || "Tech / AI"}
                      </span>
                      {p.founderProfile?.businessType && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {p.founderProfile.businessType}
                        </span>
                      )}
                      {loc && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-sm">
                          <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                          {loc.city}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Startup Title & Tagline */}
                  <div>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-all">
                      {p.selectedIdea?.name}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {p.selectedIdea?.tagline}
                    </p>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                      <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" />
                        Viability Score
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-black text-slate-900">{score}/100</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isHighScore
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isMediumScore
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {verdict}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                      <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                        Market TAM
                      </div>
                      <div className="text-base font-black text-slate-900 truncate mt-0.5">
                        {p.validation?.tam?.value || "₹20,000 Crores"}
                      </div>
                    </div>
                  </div>

                  {/* Specific Project Investor Interest Strip */}
                  {(() => {
                    const pInterests = founderNotifications.filter(
                      (n) => n.projectId === p.id || (p.selectedIdea?.name && n.projectName === p.selectedIdea.name)
                    );
                    if (pInterests.length === 0) return null;
                    const latest = pInterests[0];
                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenNotifications) onOpenNotifications();
                        }}
                        className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-400 transition shadow-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <Coins className="w-4 h-4 text-emerald-600 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-slate-900 font-bold block">
                              {pInterests.length} Investor{pInterests.length === 1 ? "" : "s"} Interested · Proposed{" "}
                              <span className="text-emerald-700 font-mono">{latest.checkSize}</span>
                            </span>
                            <span className="text-[11px] text-slate-600">
                              By {latest.investorName} ({latest.investorFirm || "Accredited Angel"})
                            </span>
                          </div>
                        </div>
                        <span className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 flex-shrink-0">
                          <span>View Inquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    );
                  })()}

                  {/* Investor Funding & Visibility Section */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`p-3 rounded-2xl border transition-all ${
                      p.isPublishedForInvestors || p.fundingAsk?.seekingFunding
                        ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.isPublishedForInvestors || p.fundingAsk?.seekingFunding ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-bold text-emerald-800">
                                Listed on Investor Dealflow
                              </span>
                              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                Seeking {p.fundingAsk?.targetFundingAmount || "₹25 Lakhs"}
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-600">
                                Private Idea (Confidential to You)
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {p.isPublishedForInvestors || p.fundingAsk?.seekingFunding
                            ? `${p.fundingAsk?.equityOffered || "Equity"} · ${p.fundingAsk?.fundingStage || "Pre-Seed"} · Visible to active angel syndicate investors`
                            : "Need funding to launch? Allow this idea to be showcased to investors."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFundingModalProject(p)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center ${
                          p.isPublishedForInvestors || p.fundingAsk?.seekingFunding
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                            : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-sm shadow-amber-500/20"
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>
                          {p.isPublishedForInvestors || p.fundingAsk?.seekingFunding
                            ? "Edit Funding Ask"
                            : "⚡ Seek Launch Funding"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadMarkdown(p, e)}
                      className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:border-blue-300 border border-slate-200 transition cursor-pointer shadow-sm"
                      title="Download Markdown Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(p.id, e)}
                      disabled={deletingId === p.id}
                      className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-rose-600 hover:border-rose-300 border border-slate-200 transition disabled:opacity-50 cursor-pointer shadow-sm"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 border border-cyan-400/30 transition-all group-hover:scale-105"
                  >
                    <span>Open Full Report</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seek Funding Modal */}
      {fundingModalProject && (
        <SeekFundingModal
          isOpen={!!fundingModalProject}
          onClose={() => setFundingModalProject(null)}
          project={fundingModalProject}
          currentUser={currentUser}
          onProjectUpdated={() => {
            setFundingModalProject(null);
            if (onRefreshData) {
              onRefreshData();
            }
          }}
        />
      )}
    </div>
  );
};
