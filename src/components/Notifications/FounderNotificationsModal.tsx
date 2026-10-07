"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  Coins,
  Building,
  Mail,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Briefcase,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { FounderNotification, StartupProject } from "@/types";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notifications";

interface FounderNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: FounderNotification[];
  onSelectProjectById?: (projectId: string) => void;
  onRefreshNotifications?: () => void;
}

export const FounderNotificationsModal: React.FC<FounderNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectProjectById,
  onRefreshNotifications,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopyEmail = (notif: FounderNotification) => {
    navigator.clipboard.writeText(notif.investorEmail);
    setCopiedId(notif.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id);
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl glass-panel border border-emerald-500/40 bg-slate-900/95 shadow-2xl p-6 sm:p-7 space-y-5 relative my-8 text-left">
        {/* Top ambient highlight */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Investor Interest Inbox
                </h2>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-extrabold text-[11px] border border-emerald-400/40 animate-pulse">
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold text-[11px] border border-slate-700">
                    All Read
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Accredited investors and venture syndicates that showed interest in your ideas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-950/40 transition cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Investor Inquiries Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                When angel investors or venture funds review your published startups on the Investor Dealflow Hub and express interest, their proposed check sizes, terms, and direct contact details will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  !notif.read
                    ? "bg-gradient-to-r from-emerald-950/35 via-slate-900/90 to-teal-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/20"
                    : "bg-slate-950/70 border-slate-800/80"
                }`}
              >
                {/* Header: Investor + Time + Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {notif.investorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{notif.investorName}</span>
                        {notif.investorFirm && (
                          <span className="text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                            {notif.investorFirm}
                          </span>
                        )}
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Interested in <strong className="text-cyan-300 font-semibold">{notif.projectName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
                        title="Mark as read"
                      >
                        ✓ Mark read
                      </button>
                    )}
                  </div>
                </div>

                {/* Offer Terms Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Proposed Check Size</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {notif.checkSize}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Instrument</span>
                    <span className="text-xs font-bold text-slate-200 block truncate">
                      {notif.instrument}
                    </span>
                  </div>

                  {notif.valuationCap && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">Valuation Cap</span>
                      <span className="text-xs font-bold text-cyan-300 font-mono block">
                        {notif.valuationCap}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes from Investor */}
                {notif.notes && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                      Message from Investor:
                    </span>
                    &ldquo;{notif.notes}&rdquo;
                  </div>
                )}

                {/* Action Row */}
                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${notif.investorEmail}?subject=Re:%20Investment%20Interest%20in%20${encodeURIComponent(notif.projectName)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyEmail(notif)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                      title="Copy investor email"
                    >
                      {copiedId === notif.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{notif.investorEmail}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {onSelectProjectById && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProjectById(notif.projectId);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                    >
                      <span>View Startup Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {notifications.length} inquiry{notifications.length === 1 ? "" : "ies"} recorded
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
