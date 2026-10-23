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
  IndianRupee,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-7 space-y-5 relative my-8 text-left">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Investor Interest Inbox
                </h2>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300">
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px] border border-slate-200">
                    All Read
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Accredited investors and venture syndicates that showed interest in your ideas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Investor Inquiries Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                When angel investors or venture funds review your published startups on the Investor Dealflow Hub and express interest, their proposed check sizes, terms, and direct contact details will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  !notif.read
                    ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
                    : "bg-white border-slate-200"
                }`}
              >
                {/* Header: Investor + Time + Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {notif.investorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{notif.investorName}</span>
                        {notif.investorFirm && (
                          <span className="text-[11px] text-slate-700 font-medium px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {notif.investorFirm}
                          </span>
                        )}
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Interested in <strong className="text-blue-700 font-semibold">{notif.projectName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 transition cursor-pointer"
                        title="Mark as read"
                      >
                        ✓ Mark read
                      </button>
                    )}
                  </div>
                </div>

                {/* Offer Terms Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Proposed Check Size</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {notif.checkSize}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Instrument</span>
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {notif.instrument}
                    </span>
                  </div>

                  {notif.valuationCap && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 block font-semibold">Valuation Cap</span>
                      <span className="text-xs font-bold text-blue-700 font-mono block">
                        {notif.valuationCap}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes from Investor */}
                {notif.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
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
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyEmail(notif)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Copy investor email"
                    >
                      {copiedId === notif.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
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
                      className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 transition"
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
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {notifications.length} inquiry{notifications.length === 1 ? "" : "ies"} recorded
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
