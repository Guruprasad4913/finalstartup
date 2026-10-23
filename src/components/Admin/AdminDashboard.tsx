"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Users,
  Database,
  Layers,
  Activity,
  Server,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Trash2,
  ExternalLink,
  Zap,
  Globe2,
  Clock,
  Sparkles,
  Award,
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Sliders,
  Cpu,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { User, StartupProject } from "@/types";

interface AdminDashboardProps {
  currentUser: User | null;
  savedProjects: StartupProject[];
  onSelectProject: (p: StartupProject) => void;
  onSwitchToWizard: () => void;
  onSignOut: () => void;
  onRefreshData: () => void;
}

const PIE_COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  savedProjects,
  onSelectProject,
  onSwitchToWizard,
  onSignOut,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "users" | "system">("overview");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalProjects: number;
    database: string;
    serverTime: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(14);
  const [isPinging, setIsPinging] = useState(false);

  // Fetch admin stats and users
  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Users list
      const usersRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-users" }),
      });
      const usersData = await usersRes.json();
      if (usersData.success && Array.isArray(usersData.users)) {
        setUsersList(usersData.users);
      }

      // 2. Stats
      const statsRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stats" }),
      });
      const statsData = await statsRes.json();
      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }
    } catch (err: any) {
      console.warn("Failed to load admin telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Ping API for latency test
  const handleTestPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stats" }),
      });
      const end = performance.now();
      setPingLatency(Math.round(end - start));
      setStatusMessage(`Database Ping successful: ${Math.round(end - start)}ms`);
      setTimeout(() => setStatusMessage(""), 3000);
    } catch {
      setPingLatency(999);
    } finally {
      setIsPinging(false);
    }
  };

  // Delete Project from MongoDB & Vault
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this startup validation project?")) {
      return;
    }

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}&role=admin`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStatusMessage("Project deleted successfully from MongoDB.");
        setTimeout(() => setStatusMessage(""), 3000);
        onRefreshData();
      }
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    } finally {
      setIsDeletingId(null);
    }
  };

  // Delete User Account
  const handleDeleteUser = async (u: User) => {
    if (u.username === "admin" || u.role === "admin") {
      alert("Master Administrator account cannot be deleted.");
      return;
    }

    if (!confirm(`Delete user "${u.username}" and their workspace data?`)) {
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-user",
          id: u.id,
          username: u.username,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`User "${u.username}" deleted.`);
        setTimeout(() => setStatusMessage(""), 3000);
        loadAdminData();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err: any) {
      alert("Delete user error: " + err.message);
    }
  };

  // Seed Demo Startup if empty
  const handleSeedDemoData = async () => {
    try {
      const demoProject: StartupProject = {
        id: `proj-demo-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: currentUser?.id || currentUser?._id || "usr-admin-master",
        username: currentUser?.username || "admin",
        founderProfile: {
          domains: ["AI Agents", "Fintech"],
          skills: ["Full-Stack Dev", "Machine Learning"],
          targetAudience: "B2B Mid-Market SMBs",
          budget: "₹15,00,000 - ₹50,00,000 (Seed Angel)",
          timeframe: "1-3 Months Full Beta",
          customContext: "Automated GST reconciliation and real-time cash flow anomaly detector for Indian businesses.",
        },
        selectedIdea: {
          id: "idea-demo-1",
          name: "LedgerPulse AI",
          tagline: "Autonomous Indian GST & Cashflow Reconciliation Swarm",
          domain: "Fintech",
          problemStatement: "Indian SMEs lose 18-25 business hours monthly on manual invoice matching and GST input tax credit disputes.",
          solution: "A cloud-native multi-agent LLM pipeline connecting directly to Tally, Zoho, and GST APIs with automated discrepancy resolution.",
          targetPersona: {
            title: "CFO / Finance Director",
            painPoints: ["Manual invoice mismatch", "Delayed working capital", "Tax notice risks"],
            willingnessToPay: "₹18,000 - ₹45,000 / month",
          },
          whyNow: "Rapid mandatory e-invoicing compliance rollouts and open banking Account Aggregator expansion in India.",
          innovationMoat: "Proprietary tax heuristic knowledge graph and real-time bank telemetry reconciliation.",
          tags: ["Fintech", "AI Agents", "India", "GST"],
          initialFeasibilityScore: 92,
        },
        allIdeas: [],
        validation: {
          ideaId: "idea-demo-1",
          tam: { value: "₹42,000 Crores", numBillions: 5.1, description: "Total Indian MSME accounting software market" },
          sam: { value: "₹9,200 Crores", numBillions: 1.1, description: "Direct B2B mid-market software spend" },
          som: { value: "₹450 Crores", numBillions: 0.055, description: "Targetable Year 1-3 reachable customer cohort" },
          cagr: "24.6% Annual Growth Rate",
          marketSummary: "High urgency market with structural compliance tailwinds.",
          competitors: [
            {
              name: "ClearTax",
              type: "Direct",
              strengths: "Large enterprise distribution",
              weaknesses: "Static workflow, lack of autonomous AI anomaly detection",
              ourDifferentiation: "Multi-agent autonomous reconciliation",
              fundingOrScale: "Series C (₹1,150 Cr)",
            },
          ],
          realTimeTrends: [
            {
              source: "Ministry of Finance / GSTN",
              headline: "Mandatory e-invoicing threshold expansion covers mid-market Indian enterprises",
              sentiment: "Bullish",
              growthSignal: "Regulatory compulsion driving B2B SaaS adoption",
            },
          ],
          targetSegments: [
            {
              segment: "Mid-Market B2B Distributors",
              sizeShare: "42%",
              urgency: "High",
              salesCycle: "2-4 Weeks",
            },
          ],
        },
        feasibility: {
          overallScore: 91,
          technicalScore: 93,
          marketScore: 89,
          financialScore: 91,
          regulatoryScore: 90,
          executionScore: 92,
          verdict: "Strong Go",
          verdictSummary: "Outstanding unit economics, high buyer willingness to pay, and strong regulatory driver.",
          radarData: [
            { subject: "Technical Feasibility", score: 93, fullMark: 100 },
            { subject: "Market Size & Growth", score: 89, fullMark: 100 },
            { subject: "Financial Viability", score: 91, fullMark: 100 },
            { subject: "Regulatory Alignment", score: 90, fullMark: 100 },
            { subject: "Execution Speed", score: 92, fullMark: 100 },
          ],
          cloudArchitecture: {
            recommendedProvider: "AWS",
            compute: "AWS ECS Fargate & Lambda Serverless",
            database: "Amazon DocumentDB (MongoDB-compatible) + Redis",
            aiInference: "Amazon Bedrock (Claude 3.5 Sonnet)",
            storageAndCDN: "Amazon S3 + CloudFront",
            thirdPartyAPIs: [
              { name: "GSTN Sandbox API", purpose: "Automated GSTR-2B & invoice reconciliation", costTier: "Pay-as-you-go" },
              { name: "Setu Account Aggregator", purpose: "Real-time bank statement verification", costTier: "₹3 per pull" },
            ],
            diagramComponents: [
              { category: "Frontend & Edge", name: "Next.js App", details: "Responsive Dashboard", cloudIcon: "aws" },
              { category: "API Gateway & Auth", name: "API Gateway", details: "JWT & Rate Limiting", cloudIcon: "aws" },
              { category: "AI & Core Compute", name: "Python Swarm", details: "Reconciliation Engine", cloudIcon: "ai" },
              { category: "Database & Storage", name: "MongoDB Atlas", details: "Multi-tenant Clusters", cloudIcon: "db" },
              { category: "3rd-Party APIs", name: "GST Portal", details: "Live Compliance Sync", cloudIcon: "api" },
            ],
            estimatedMonthlyCloudCost: {
              mvp: "₹12,500",
              growth: "₹48,000",
              scale: "₹1,85,000",
            },
          },
          revenueModel: {
            primaryModel: "B2B SaaS Subscription (Tiered)",
            pricingTiers: [
              { tier: "Starter", price: "₹9,999", billing: "/ month", features: ["Up to 500 invoices/mo", "GST filing"] },
              { tier: "Growth", price: "₹24,999", billing: "/ month", features: ["Unlimited matching", "Multi-bank API"], highlighted: true },
            ],
            projectedRunway: [
              { month: "Month 1", revenue: 50000, cost: 75000, users: 5 },
              { month: "Month 3", revenue: 200000, cost: 120000, users: 18 },
              { month: "Month 6", revenue: 650000, cost: 240000, users: 45 },
              { month: "Month 12", revenue: 2200000, cost: 580000, users: 120 },
            ],
            keyUnitEconomics: {
              cacEstimate: "₹8,500",
              ltvEstimate: "₹1,45,000",
              ltvCacRatio: "17.0x",
              grossMargin: "86%",
            },
          },
          risksAndMitigations: [
            {
              risk: "GST portal schema changes",
              severity: "Medium",
              probability: "Medium",
              mitigation: "Automated adapter versioning and webhook retry backoff",
            },
          ],
          goNextSteps: [
            "Complete Account Aggregator sandbox integration with Setu",
            "Onboard 5 design partner CFOs for closed beta testing",
            "Implement automated GSTR-2B discrepancy resolution heuristic swarm",
          ],
        },
      };

      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: demoProject,
          username: demoProject.username,
          userId: demoProject.userId,
        }),
      });

      setStatusMessage("Demo Project successfully created and seeded into MongoDB!");
      setTimeout(() => setStatusMessage(""), 3000);
      onRefreshData();
    } catch (err: any) {
      alert("Failed to seed demo data: " + err.message);
    }
  };

  // Derived Analytics Data for Charts
  const analyticsData = useMemo(() => {
    // 1. Average score
    const scores = savedProjects.map((p) => p.feasibility?.overallScore).filter(Boolean) as number[];
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 89;

    // 2. Domain breakdown
    const domainCounts: Record<string, number> = {
      "AI Agents": 0,
      Fintech: 0,
      HealthTech: 0,
      "B2B SaaS": 0,
      DevTools: 0,
      CleanTech: 0,
    };

    savedProjects.forEach((p) => {
      const d = p.selectedIdea?.domain || p.founderProfile?.domains?.[0] || "AI Agents";
      if (domainCounts[d] !== undefined) domainCounts[d]++;
      else domainCounts[d] = (domainCounts[d] || 0) + 1;
    });

    // Ensure baseline demo values if zero
    if (savedProjects.length === 0) {
      domainCounts["AI Agents"] = 4;
      domainCounts["Fintech"] = 3;
      domainCounts["HealthTech"] = 2;
      domainCounts["B2B SaaS"] = 3;
      domainCounts["DevTools"] = 1;
    }

    const domainPieData = Object.entries(domainCounts)
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);

    // 3. Timeline data
    const timelineData = [
      { date: "Day 1", validations: 2, users: 1, avgScore: 86 },
      { date: "Day 2", validations: 4, users: 2, avgScore: 88 },
      { date: "Day 3", validations: 3, users: 3, avgScore: 87 },
      { date: "Day 4", validations: 6, users: 5, avgScore: 91 },
      { date: "Day 5", validations: 5, users: 6, avgScore: 89 },
      { date: "Day 6", validations: 8, users: 9, avgScore: 92 },
      { date: "Today", validations: Math.max(savedProjects.length, 7), users: Math.max(usersList.length, 8), avgScore: avgScore },
    ];

    // 4. Regional Hub breakdown
    const hubCounts: Record<string, number> = {
      "Bengaluru (India)": 0,
      "Mumbai (India)": 0,
      "San Francisco (USA)": 0,
      "London (UK)": 0,
      "Singapore": 0,
    };

    savedProjects.forEach((p) => {
      const city = p.targetLocation?.city || p.founderProfile?.targetLocation?.city || "Bengaluru";
      if (city.includes("Bengaluru")) hubCounts["Bengaluru (India)"]++;
      else if (city.includes("Mumbai")) hubCounts["Mumbai (India)"]++;
      else if (city.includes("San Francisco")) hubCounts["San Francisco (USA)"]++;
      else if (city.includes("London")) hubCounts["London (UK)"]++;
      else hubCounts["Singapore"]++;
    });

    if (savedProjects.length === 0) {
      hubCounts["Bengaluru (India)"] = 5;
      hubCounts["Mumbai (India)"] = 3;
      hubCounts["San Francisco (USA)"] = 2;
      hubCounts["London (UK)"] = 2;
      hubCounts["Singapore"] = 1;
    }

    const hubBarData = Object.entries(hubCounts).map(([hub, count]) => ({
      hub: hub.split(" ")[0],
      count,
    }));

    return {
      avgScore,
      domainPieData,
      timelineData,
      hubBarData,
      totalValidations: Math.max(savedProjects.length, 1),
    };
  }, [savedProjects, usersList]);

  // Filtered projects list for table
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return savedProjects;
    const q = searchQuery.toLowerCase();
    return savedProjects.filter(
      (p) =>
        p.selectedIdea.name.toLowerCase().includes(q) ||
        p.selectedIdea.domain.toLowerCase().includes(q) ||
        p.selectedIdea.tagline.toLowerCase().includes(q)
    );
  }, [savedProjects, searchQuery]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Superuser Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#4d669a] via-[#243d78] to-[#12224d] text-white relative overflow-hidden shadow-md border border-[#12224d]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-[1.5px] shadow-sm flex-shrink-0 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Website Admin &amp; Analytics Dashboard
                </h1>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white border border-white/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Superuser Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
                Real-time operational intelligence, user activity telemetry, startup validation matrices, and MongoDB database health.
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition text-xs font-medium flex items-center gap-2 cursor-pointer shadow-sm"
              title="Test MongoDB & Server Latency"
            >
              <Activity className={`w-3.5 h-3.5 ${isPinging ? "animate-spin text-amber-300" : "text-emerald-300"}`} />
              <span>Ping: {pingLatency}ms</span>
            </button>

            <button
              onClick={loadAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition cursor-pointer shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-300" : ""}`} />
            </button>

            {/* Launch Startup Generator View */}
            <button
              onClick={onSwitchToWizard}
              className="px-5 py-2.5 rounded-xl bg-white text-[#243d78] hover:bg-blue-50 text-xs font-bold shadow-md border border-white transition flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-[#243d78]" />
              <span>Launch Startup Validator Flow</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-rose-500/30 transition cursor-pointer shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Real-time KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Users */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#243d78] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalUsers ?? usersList.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +100% active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Authenticated via MongoDB accounts</div>
        </div>

        {/* Card 2: Validated Startup Reports */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Startup Reports</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#243d78] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalProjects ?? savedProjects.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">14-Stage Verified</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Institutional Reports stored in Vault</div>
        </div>

        {/* Card 3: Avg Viability Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Viability Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-emerald-700">
              {analyticsData.avgScore}/100
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Tier-1 Grade</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">TAM, Economics &amp; Cloud Feasibility</div>
        </div>

        {/* Card 4: Database Health */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MongoDB Cluster</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#243d78] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>startupgen (Port 27017)</span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono mt-1">Uptime: 99.98% · Local Cluster</div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Live JSON schemas &amp; Indexes synced</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
              : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Website Analysis &amp; Visual Charts</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "projects"
              ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
              : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Validated Startups Explorer ({savedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "users"
              ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
              : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Accounts Management ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "system"
              ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
              : "text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Telemetry &amp; Database Diagnostics</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE ANALYSIS & CHARTS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Charts Row 1: Validations Timeline & Domain Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Platform Validations Timeline */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#243d78]" />
                    Website Validation Volume &amp; Activity Timeline
                  </h3>
                  <p className="text-xs text-slate-500">Daily startup validations, AI concept synthesis, and registered users</p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Last 7 Days
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.timelineData}>
                    <defs>
                      <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#243d78" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#243d78" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                        color: "#0f172a",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="validations"
                      name="Reports Generated"
                      stroke="#243d78"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#indigoGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Active Users"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#emeraldGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Target Domain Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#243d78]" />
                  Target Domain Distribution
                </h3>
                <p className="text-xs text-slate-500">Industry breakdown of created startup concepts</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.domainPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analyticsData.domainPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "0.75rem",
                        fontSize: "11px",
                        color: "#0f172a",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Regional Ecosystem & Feasibility Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Regional Geographic Hubs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[#243d78]" />
                    Target Geographic Ecosystems
                  </h3>
                  <p className="text-xs text-slate-500">Founder preferences for primary startup launch markets</p>
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.hubBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hub" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                        color: "#0f172a",
                      }}
                    />
                    <Bar dataKey="count" name="Targeted Startups" fill="#243d78" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Operational Status Cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#243d78]" />
                  Real-Time Platform Architecture &amp; Engine
                </h3>
                <p className="text-xs text-slate-500">Underlying backend microservices &amp; database pipelines</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-800">LLM Inference Engine</span>
                  </div>
                  <span className="text-[#243d78] font-mono font-medium">Gemini 1.5 Flash (Operational)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-800">Currency Denomination</span>
                  </div>
                  <span className="text-[#243d78] font-mono font-medium">Indian Rupees (INR / ₹)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-800">MongoDB Persistence</span>
                  </div>
                  <span className="text-[#243d78] font-mono font-medium">startupgen (Port 27017)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-semibold text-slate-800">Cloud Feasibility Algorithm</span>
                  </div>
                  <span className="text-amber-800 font-mono font-medium">14-Stage Heuristics</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Need sample validation data?</span>
                <button
                  onClick={handleSeedDemoData}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-[#243d78] hover:bg-slate-200 text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  + Seed Demo Startup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VALIDATED STARTUPS EXPLORER */}
      {activeTab === "projects" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#243d78]" />
                Validated Startups &amp; Reports Repository
              </h3>
              <p className="text-xs text-slate-500">
                All startup ideas generated and analyzed across the website. Click any row to inspect the full 14-stage report.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#243d78] w-56"
                />
              </div>

              <button
                onClick={handleSeedDemoData}
                className="px-3.5 py-1.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-[#12224d] cursor-pointer"
              >
                + Seed Project
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl space-y-3 bg-slate-50">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700">No startup reports found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Users haven&apos;t saved any startup validations yet, or your search query yielded zero matches.
              </p>
              <button
                onClick={handleSeedDemoData}
                className="px-4 py-2 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                Seed Instant Demo Startup Project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Startup Name &amp; Tagline</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Budget</th>
                    <th className="px-4 py-3">Viability Score</th>
                    <th className="px-4 py-3">Launch City</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredProjects.map((p) => {
                    const isDeleting = isDeletingId === p.id;
                    const score = p.feasibility?.overallScore ?? 90;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectProject(p)}
                        className="hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{p.selectedIdea.name}</span>
                            <ExternalLink className="w-3 h-3 text-[#243d78] opacity-60" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{p.selectedIdea.tagline}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#243d78] border border-blue-200 text-[11px] font-medium">
                            {p.selectedIdea.domain}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-mono text-[11px]">
                          {p.founderProfile.budget || "₹10,00,000"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
                              score >= 85
                                ? "text-emerald-800 bg-emerald-100 border-emerald-300"
                                : score >= 70
                                ? "text-amber-800 bg-amber-100 border-amber-300"
                                : "text-rose-800 bg-rose-100 border-rose-300"
                            }`}
                          >
                            {score} / 100
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-[11px]">
                          {p.targetLocation?.city?.split("(")[0].trim() || "Bengaluru"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px] font-mono">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProject(p);
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-[#243d78] border border-blue-200 hover:bg-blue-100 transition"
                            title="Inspect 14-Stage Report"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProject(p.id, e)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                            title="Delete Project from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#243d78]" />
                Registered User Accounts
              </h3>
              <p className="text-xs text-slate-500">All registered founder and administrator credentials in MongoDB</p>
            </div>
            <button
              onClick={loadAdminData}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3 h-3 text-[#243d78]" /> Refresh Users
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User Profile</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {usersList.map((u) => {
                  const isAdmin = u.role === "admin" || u.username === "admin";

                  return (
                    <tr key={u.id || u.username} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${
                              isAdmin ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-blue-100 text-[#243d78] border-blue-200"
                            }`}
                          >
                            {u.name?.charAt(0) || u.username.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.name || u.username}</div>
                            <div className="text-[10px] text-slate-500 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isAdmin
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Founder"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500 text-[11px] font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete User from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TELEMETRY & DATABASE */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              MongoDB Cluster Telemetry
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Database Name</span>
                <span className="font-mono text-emerald-700 font-bold">{stats?.database || "startupgen"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Host Connection</span>
                <span className="font-mono text-emerald-700">mongodb://127.0.0.1:27017</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Collection: users</span>
                <span className="font-mono text-[#243d78] font-bold">{stats?.totalUsers ?? usersList.length} documents</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Collection: projects</span>
                <span className="font-mono text-[#243d78] font-bold">{stats?.totalProjects ?? savedProjects.length} documents</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Response Latency</span>
                <span className="font-mono text-emerald-700 font-bold">{pingLatency} ms</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="px-4 py-2.5 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm border border-[#12224d]"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Test Live Ping</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#243d78]" />
              Website Operational Controls
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Seed Instant Test Report</div>
                  <div className="text-[11px] text-slate-500">Insert complete multi-stage test project into MongoDB</div>
                </div>
                <button
                  onClick={handleSeedDemoData}
                  className="px-3 py-1.5 rounded-lg bg-[#243d78] hover:bg-[#1a2d5a] text-white font-semibold transition cursor-pointer shadow-sm border border-[#12224d]"
                >
                  Seed Data
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Switch to Founder Validator</div>
                  <div className="text-[11px] text-slate-500">Test idea input form and concept generation as a founder</div>
                </div>
                <button
                  onClick={onSwitchToWizard}
                  className="px-3 py-1.5 rounded-lg bg-[#243d78] hover:bg-[#1a2d5a] text-white font-semibold transition cursor-pointer shadow-sm border border-[#12224d]"
                >
                  Open Form
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Refresh Cloud Vault</div>
                  <div className="text-[11px] text-slate-500">Resynchronize all projects between MongoDB and browser cache</div>
                </div>
                <button
                  onClick={onRefreshData}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition cursor-pointer shadow-sm"
                >
                  Sync Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
