"use client";

import React from "react";
import {
  Sparkles,
  Cloud,
  Database,
  Cpu,
  Settings,
  FolderHeart,
  Zap,
  Scale,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  HelpCircle,
  Coins,
  TrendingUp,
  Bell,
} from "lucide-react";
import { User } from "@/types";

interface NavigationProps {
  onOpenSettings: () => void;
  onOpenVault?: () => void;
  onOpenCompare?: () => void;
  vaultCount?: number;
  onSelectPreset: (presetName: string) => void;
  currentUser: User | null;
  onSignOut: () => void;
  onOpenAdminPortal?: () => void;
  adminView?: "dashboard" | "wizard" | "investor";
  onSetAdminView?: (view: "dashboard" | "wizard" | "investor") => void;
  userView?: "reports" | "wizard" | "investor";
  onSetUserView?: (view: "reports" | "wizard" | "investor") => void;
  userReportsCount?: number;
  onOpenHelp?: () => void;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSettings,
  onOpenVault: _onOpenVault,
  onOpenCompare,
  vaultCount: _vaultCount,
  onSelectPreset,
  currentUser,
  onSignOut,
  onOpenAdminPortal,
  adminView = "dashboard",
  onSetAdminView,
  userView = "reports",
  onSetUserView,
  userReportsCount = 0,
  onOpenHelp,
  unreadNotificationCount = 0,
  onOpenNotifications,
}) => {
  return (
    <header className="no-print border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
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
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-sm">
                Multi-Sector Validation
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              14-Stage Institutional Idea Validation Engine
            </p>
          </div>
        </div>

        {/* Action Buttons & User Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin View Switcher (If user is Admin) */}
          {currentUser?.role === "admin" && onSetAdminView && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => onSetAdminView("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  adminView === "dashboard"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Analytics</span>
              </button>
              <button
                type="button"
                onClick={() => onSetAdminView("investor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  adminView === "investor"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Investor Hub</span>
              </button>
              <button
                type="button"
                onClick={() => onSetAdminView("wizard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  adminView === "wizard"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Validator Flow</span>
              </button>
            </div>
          )}

          {/* Investor View Switcher (If user logged in as Investor) */}
          {currentUser?.role === "investor" && onSetUserView && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => onSetUserView("investor")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userView === "investor"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Curated Startup Dealflow & Valuation Lab"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Investor Dealflow</span>
              </button>
              <button
                type="button"
                onClick={() => onSetUserView("reports")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userView === "reports"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="My Saved Reports"
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Saved Vault</span>
              </button>
            </div>
          )}

          {/* Founder View Switcher (If user is regular Founder) */}
          {currentUser?.role === "user" && onSetUserView && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => onSetUserView("reports")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userView === "reports"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View All Previously Generated Reports"
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>My Reports</span>
                {typeof userReportsCount === "number" && userReportsCount > 0 && (
                  <span className="bg-emerald-800 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {userReportsCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onSetUserView("wizard")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  userView === "wizard"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Start a New 14-Stage Startup Validation"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Validation</span>
              </button>
            </div>
          )}

          {/* MongoDB Live Status Pill (Admin Dashboard only) */}
          {currentUser?.role === "admin" && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs hover:bg-emerald-100 transition font-mono shadow-sm cursor-pointer"
              title="MongoDB Connected: 127.0.0.1:27017 / startupgen (Admin: Click to configure)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-sans font-bold text-emerald-800">
                startupgen
              </span>
            </button>
          )}

          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Compare Saved Startup Concepts"
            >
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Compare</span>
            </button>
          )}

          {/* Notification Bell (Investor Interest Inquiries) */}
          {onOpenNotifications && currentUser?.role !== "investor" && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className={`relative px-2.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                unreadNotificationCount > 0
                  ? "bg-emerald-50 border-emerald-400 text-emerald-700 hover:border-emerald-500 shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm"
              }`}
              title={
                unreadNotificationCount > 0
                  ? `🔔 ${unreadNotificationCount} New Investor Interest Inquiry Received!`
                  : "Investor Inquiries & Interest Inbox"
              }
            >
              <Bell className={`w-3.5 h-3.5 ${unreadNotificationCount > 0 ? "text-emerald-600 animate-bounce" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Interest</span>
              {unreadNotificationCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-sm">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* Help & Support Button (Only for founders, hidden in admin portal) */}
          {onOpenHelp && currentUser?.role !== "admin" && (
            <button
              type="button"
              onClick={onOpenHelp}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="14-Stage Guide, FAQs & Founder Support"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Help</span>
            </button>
          )}

          {/* Setting button: Only visible for Admin login */}
          {currentUser?.role === "admin" && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 transition shadow-sm"
              title="Admin Settings: Configure AI API & Cloud Providers"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Pill & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 sm:border-l border-slate-200">
              <div
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-sm"
                title={`Signed in as ${currentUser.username}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                    currentUser.role === "admin"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : currentUser.role === "investor"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {currentUser.username.substring(0, 1).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {currentUser.username}
                  </div>
                  <div
                    className={`text-[9px] font-bold uppercase ${
                      currentUser.role === "admin"
                        ? "text-amber-700"
                        : currentUser.role === "investor"
                        ? "text-blue-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {currentUser.role === "admin"
                      ? "Admin"
                      : currentUser.role === "investor"
                      ? "Investor"
                      : "Founder"}
                  </div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-2 rounded-lg bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-300 border border-slate-200 transition shadow-sm"
                title="Sign Out / Switch Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
