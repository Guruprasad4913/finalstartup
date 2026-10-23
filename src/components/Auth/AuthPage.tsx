"use client";

import React, { useState } from "react";
import {
  Zap,
  Shield,
  ShieldCheck,
  User,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Globe,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  HelpCircle,
  Coins,
  Rocket,
} from "lucide-react";
import { User as UserType } from "@/types";

export type UserRole = "founder" | "investor" | "admin";
export type AuthTab = "signin" | "signup";

interface AuthPageProps {
  onLoginSuccess: (user: UserType) => void;
  onOpenHelp?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onOpenHelp }) => {
  // Role is chosen from the top section: Founder, Investor, or Admin
  const [selectedRole, setSelectedRole] = useState<UserRole>("founder");
  // Two options available under Founder & Investor: Sign In and Sign Up
  const [authTab, setAuthTab] = useState<AuthTab>("signin");

  // Form fields
  const [username, setUsername] = useState("Guruprasad");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Guru@4913");
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Password validation rules (for signup)
  const passwordCriteria = {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const criteriaMetCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isPasswordStrong = criteriaMetCount === 4;

  const getStrengthInfo = () => {
    if (password.length === 0) return { label: "Empty", color: "bg-slate-700", text: "text-slate-500" };
    if (criteriaMetCount <= 1) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (criteriaMetCount === 2) return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
    if (criteriaMetCount === 3) return { label: "Good", color: "bg-cyan-500", text: "text-cyan-400" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const resetForm = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const selectRoleAndTab = (role: UserRole, tab: AuthTab = "signin") => {
    setSelectedRole(role);
    setAuthTab(tab);
    resetForm();
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin");
    } else if (role === "investor" && tab === "signin") {
      setUsername("investor");
      setPassword("investor");
    } else if (role === "founder" && tab === "signin") {
      setUsername("Guruprasad");
      setPassword("Guru@4913");
    } else {
      setUsername("");
      setPassword("");
      setName("");
      setEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (selectedRole === "admin") {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "admin-login",
            username: username.trim(),
            password: password.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid Admin authorization");
        }

        setSuccessMsg("Elevated Administrator Access Granted!");
        setTimeout(() => {
          onLoginSuccess({ ...data.user, isNewUser: false });
        }, 500);
      } else if (authTab === "signin") {
        const cleanUname = (username || (selectedRole === "investor" ? "investor" : "")).trim();
        const cleanPass = (password || (selectedRole === "investor" ? "investor" : "")).trim();

        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            username: cleanUname,
            password: cleanPass,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid username or password");
        }

        setSuccessMsg(
          selectedRole === "investor" || data.user.role === "investor"
            ? `Welcome, ${data.user.name || "Investor"}! Accessing Dealflow Pipeline...`
            : `Welcome back, ${data.user.name || data.user.username}!`
        );
        setTimeout(() => {
          onLoginSuccess({ ...data.user, isNewUser: false });
        }, 500);
      } else if (authTab === "signup") {
        if (!isPasswordStrong) {
          throw new Error(
            "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 number, and 1 special character."
          );
        }

        const assignedRole = selectedRole === "investor" ? "investor" : "user";
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "register",
            username: username.trim(),
            name: name.trim() || username.trim(),
            email: email.trim(),
            password: password.trim(),
            role: assignedRole,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to register account");
        }

        setSuccessMsg(
          assignedRole === "investor"
            ? `Welcome, ${data.user.name || "Investor"}! Accredited Investor Account Created.`
            : `Welcome, ${data.user.name || data.user.username}! Founder Workspace Ready.`
        );
        setTimeout(() => {
          onLoginSuccess({ ...data.user, isNewUser: true });
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type: "admin" | "guru" | "investor") => {
    if (type === "admin") {
      selectRoleAndTab("admin", "signin");
      setUsername("admin");
      setPassword("admin");
    } else if (type === "guru") {
      selectRoleAndTab("founder", "signin");
      setUsername("Guruprasad");
      setPassword("Guru@4913");
    } else if (type === "investor") {
      selectRoleAndTab("investor", "signin");
      setUsername("investor");
      setPassword("investor");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] bg-blue-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md relative z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-sm shadow-blue-500/20">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Startup<span className="text-blue-600 font-extrabold">Gen</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  AI + API + Cloud
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                14-Stage Institutional Startup Validation Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Header Portal Switchers */}
            <button
              type="button"
              onClick={() => selectRoleAndTab("founder", "signin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                selectedRole === "founder"
                  ? "bg-blue-600 text-white shadow-blue-600/30"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300"
              }`}
              title="Open Founder Portal"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Founder</span>
            </button>

            <button
              type="button"
              onClick={() => selectRoleAndTab("investor", "signin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                selectedRole === "investor"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300"
              }`}
              title="Open Investor Portal"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Investor</span>
            </button>

            <button
              type="button"
              onClick={() => selectRoleAndTab("admin", "signin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300"
              }`}
              title="Open Administrator Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {onOpenHelp && (
              <button
                type="button"
                onClick={onOpenHelp}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-semibold transition shadow-sm"
                title="14-Stage Platform Guide & Founder Support"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Help</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Authentication Arena */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-6xl">
          {/* Left Column: Platform Showcase */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Full-Stack Venture Intelligence Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Validate Venture Ideas with <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Institutional AI Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Step through our end-to-end 14-stage engine: from geographic ecosystem signals and
              competitor battlecards to the 82/100 AI Viability Score, MoSCoW MVP sprints, and cloud
              architecture blueprints.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-blue-400 hover:shadow-md transition group">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:scale-105 transition">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">TAM / SAM / SOM Funnel</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Live CAGR &amp; market sizing hierarchy
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-emerald-400 hover:shadow-md transition group">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">82/100 Viability Engine</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    5-factor algorithmic scoring &amp; verdict
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-cyan-400 hover:shadow-md transition group">
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 group-hover:scale-105 transition">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">MoSCoW MVP &amp; Sprints</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    28-day launch plan &amp; 12-mo milestones
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-amber-400 hover:shadow-md transition group">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:scale-105 transition">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Global Ecosystem Hubs</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    14 regional startup talent indices
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Login Credentials helper */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 1-Click Demo Accounts:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickFill("guru")}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Sign in as Founder Guruprasad"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Founder Demo (Guruprasad)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("investor")}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Sign in as Investor Devon Vance"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Investor Demo (Devon Vance)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("admin")}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Demo (admin)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role Selector + Sign In / Sign Up Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="relative rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xl">
              {/* Header Gradient Stripe */}
              <div
                className={`absolute top-0 left-8 right-8 h-[3px] transition-all duration-300 rounded-full ${
                  selectedRole === "investor"
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                    : selectedRole === "admin"
                    ? "bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                }`}
              />

              <div className="animate-in fade-in duration-300 text-left">
                {/* UPPER SECTION: ROLE SELECTOR TABS (Founder, Investor, Admin) */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => selectRoleAndTab("founder", authTab)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRole === "founder"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Founder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRoleAndTab("investor", authTab)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRole === "investor"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Investor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRoleAndTab("admin", "signin")}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedRole === "admin"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* WHEN ADMIN IS SELECTED */}
                {selectedRole === "admin" ? (
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">Administrator Portal</h2>
                      <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                        Elevated Access
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      System dashboard, user management, and MongoDB collection oversight.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* THE TWO OPTIONS: SIGN IN AND SIGN UP (AVAILABLE FOR FOUNDER & INVESTOR) */}
                    <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab("signin");
                          resetForm();
                          if (selectedRole === "founder") {
                            setUsername("Guruprasad");
                            setPassword("Guru@4913");
                          } else if (selectedRole === "investor") {
                            setUsername("investor");
                            setPassword("investor");
                          }
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          authTab === "signin"
                            ? selectedRole === "investor"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab("signup");
                          resetForm();
                          setUsername("");
                          setPassword("");
                          setName("");
                          setEmail("");
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          authTab === "signup"
                            ? selectedRole === "investor"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sign Up</span>
                      </button>
                    </div>

                    {/* Header Titles tailored to Role and Action */}
                    <div className="mb-4 text-left">
                      {selectedRole === "founder" && authTab === "signin" && (
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span>Founder Sign In</span>
                            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                              Founder Hub
                            </span>
                          </h2>
                          <p className="text-xs text-slate-500 mt-1">
                            Access your validated startup vault, 14-stage blueprints, and market reports.
                          </p>
                        </div>
                      )}

                      {selectedRole === "founder" && authTab === "signup" && (
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span>Create Founder Account</span>
                            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                              Free Registration
                            </span>
                          </h2>
                          <p className="text-xs text-slate-500 mt-1">
                            Register as a startup founder to validate ideas and generate investment dossiers.
                          </p>
                        </div>
                      )}

                      {selectedRole === "investor" && authTab === "signin" && (
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <span>Investor Sign In</span>
                            </h2>
                            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              Dealflow &amp; Capital
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Access verified startup deal pipeline, valuation modeling, and syndicate term sheets.
                          </p>
                        </div>
                      )}

                      {selectedRole === "investor" && authTab === "signup" && (
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <span>Create Investor Account</span>
                            </h2>
                            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              Accredited Access
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Register as an angel investor or syndicate partner to receive vetted dealflow alerts.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Status Notifications */}
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Full Name for Sign Up */}
                  {authTab === "signup" && selectedRole !== "admin" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={
                            selectedRole === "investor" ? "e.g. Devon Vance" : "e.g. Elena Rostova"
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Username or Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {selectedRole === "admin"
                        ? "Admin Identifier / Username"
                        : selectedRole === "investor"
                        ? authTab === "signup"
                          ? "Investor Username"
                          : "Investor Username or Firm Email"
                        : authTab === "signup"
                        ? "Founder Username"
                        : "Username or Email"}
                    </label>
                    <div className="relative">
                      {selectedRole === "admin" ? (
                        <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                      ) : selectedRole === "investor" ? (
                        <Coins className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      )}
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={
                          selectedRole === "admin"
                            ? "admin"
                            : selectedRole === "investor"
                            ? "investor or devon@angelventures.io"
                            : authTab === "signup"
                            ? "founder_elena"
                            : "Guruprasad or email"
                        }
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition ${
                          selectedRole === "admin"
                            ? "border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                            : selectedRole === "investor"
                            ? "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                            : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email for Sign Up */}
                  {authTab === "signup" && selectedRole !== "admin" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {selectedRole === "investor" ? "Firm or Business Email" : "Email Address"}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={
                            selectedRole === "investor"
                              ? "devon@angelventures.io"
                              : "elena@venturelab.io"
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {authTab === "signup" ? "Set Password" : "Password"}
                      </label>
                      {authTab === "signin" && selectedRole === "founder" && (
                        <span
                          className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setUsername("Guruprasad");
                            setPassword("Guru@4913");
                          }}
                        >
                          Preset: Guru@4913
                        </span>
                      )}
                      {authTab === "signin" && selectedRole === "investor" && (
                        <span
                          className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setUsername("investor");
                            setPassword("investor");
                          }}
                        >
                          Preset: investor / investor
                        </span>
                      )}
                      {selectedRole === "admin" && (
                        <span
                          className="text-[10px] text-amber-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setUsername("admin");
                            setPassword("admin");
                          }}
                        >
                          Preset: admin / admin
                        </span>
                      )}
                      {authTab === "signup" && (
                        <span className="text-[10px] text-slate-400">Must be strong</span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition ${
                          selectedRole === "admin"
                            ? "border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                            : authTab === "signup" && password.length > 0
                            ? isPasswordStrong
                              ? "border-emerald-500 focus:border-emerald-500"
                              : "border-amber-500 focus:border-amber-500"
                            : selectedRole === "investor"
                            ? "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                            : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator & Requirements (Signup Mode) */}
                  {authTab === "signup" && selectedRole !== "admin" && (
                    <div className="space-y-2.5 pt-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Password Strength:</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-xs ${getStrengthInfo().text}`}>
                            {getStrengthInfo().label}
                          </span>
                          {isPasswordStrong && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                      </div>

                      {/* 4-bar strength progress meter */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                        {[1, 2, 3, 4].map((step) => {
                          const active = criteriaMetCount >= step && password.length > 0;
                          let barColor = "bg-slate-200";
                          if (active) {
                            if (criteriaMetCount <= 1)
                              barColor = "bg-red-500";
                            else if (criteriaMetCount === 2)
                              barColor = "bg-amber-500";
                            else if (criteriaMetCount === 3)
                              barColor = "bg-cyan-500";
                            else barColor = "bg-emerald-500";
                          }
                          return (
                            <div
                              key={step}
                              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                            />
                          );
                        })}
                      </div>

                      {/* Requirements Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            passwordCriteria.hasMinLength
                              ? "text-emerald-700 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {passwordCriteria.hasMinLength ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                            </div>
                          )}
                          <span>Min 8 characters</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            passwordCriteria.hasUpper
                              ? "text-emerald-700 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {passwordCriteria.hasUpper ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                            </div>
                          )}
                          <span>1 uppercase letter</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            passwordCriteria.hasNumber
                              ? "text-emerald-700 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {passwordCriteria.hasNumber ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                            </div>
                          )}
                          <span>1 number (0-9)</span>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            passwordCriteria.hasSpecial
                              ? "text-emerald-700 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {passwordCriteria.hasSpecial ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                            </div>
                          )}
                          <span>1 special char (!@#$)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer ${
                      selectedRole === "admin"
                        ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                        : selectedRole === "investor"
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30"
                        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating session...</span>
                      </>
                    ) : (
                      <>
                        {selectedRole === "investor" && <Coins className="w-4 h-4" />}
                        {selectedRole === "founder" && <Rocket className="w-4 h-4" />}
                        {selectedRole === "admin" && <Shield className="w-4 h-4" />}
                        <span>
                          {selectedRole === "admin"
                            ? "Unlock Administrator Portal"
                            : selectedRole === "investor"
                            ? authTab === "signin"
                              ? "Enter Investor Dealflow Portal"
                              : "Create Accredited Investor Account"
                            : authTab === "signin"
                            ? "Sign In to Founder Platform"
                            : "Create & Launch Founder Account"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch between Sign In and Sign Up footer helper */}
                {selectedRole !== "admin" && (
                  <div className="mt-4 pt-3 border-t border-slate-200 text-center text-xs text-slate-500">
                    {authTab === "signin" ? (
                      <span>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab("signup");
                            resetForm();
                          }}
                          className={`font-semibold underline cursor-pointer hover:text-slate-900 ${
                            selectedRole === "investor" ? "text-emerald-700" : "text-blue-600"
                          }`}
                        >
                          Sign Up as {selectedRole === "investor" ? "an Investor" : "a Founder"}
                        </button>
                      </span>
                    ) : (
                      <span>
                        Already registered?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab("signin");
                            resetForm();
                          }}
                          className={`font-semibold underline cursor-pointer hover:text-slate-900 ${
                            selectedRole === "investor" ? "text-emerald-700" : "text-blue-600"
                          }`}
                        >
                          Sign In to your account
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Security Footer Notice */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit Encrypted Session</span>
                  </span>
                  <span>MongoDB v7.6 Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 relative z-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>StartupGen · AI + API + Cloud Multi-Sector Startup Validator Engine</div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px] flex-wrap justify-center">
            <span>14-Stage Institutional Pipeline</span>
            <span>·</span>
            <span>Real-Time Cloud Blueprints</span>
            <span>·</span>
            <span>Zero Hallucination Telemetry</span>
            {onOpenHelp && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={onOpenHelp}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1 transition cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Help &amp; Founder Support</span>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
