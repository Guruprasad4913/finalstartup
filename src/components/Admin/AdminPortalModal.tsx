"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  X,
  Users,
  Database,
  Layers,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Server,
  FileText,
  Key,
  ExternalLink,
} from "lucide-react";
import { User, StartupProject } from "@/types";

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  savedProjects: StartupProject[];
  onSelectProject?: (p: StartupProject) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedProjects,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<"users" | "projects" | "telemetry">("users");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalProjects: number;
    database: string;
    serverTime: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-users" }),
      });
      const usersData = await usersRes.json();
      if (usersData.success && Array.isArray(usersData.users)) {
        setUsersList(usersData.users);
      }

      // Fetch stats
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
      console.error("Admin fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteUser = async (u: User) => {
    if (u.username === "admin" || u.role === "admin") {
      alert("Master Administrator account cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${u.username}" from MongoDB?`)) {
      return;
    }

    setIsDeleting(u.id || u.username);
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
        setMessage(`User ${u.username} deleted.`);
        setTimeout(() => setMessage(""), 3000);
        fetchAdminData();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err: any) {
      alert(err?.message || "Delete error");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4d669a] via-[#243d78] to-[#12224d]" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-[#243d78] border border-blue-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Administrator Command Center</h2>
                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Superuser
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Logged in as: <span className="text-[#243d78] font-bold">{currentUser?.username || "Admin"}</span> · MongoDB Database: <span className="font-mono text-emerald-700 font-semibold">startupgen</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
              title="Refresh Admin Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#243d78]" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">Registered Users</div>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalUsers ?? usersList.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 text-[#243d78] border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">MongoDB Reports</div>
              <div className="text-2xl font-bold text-emerald-700">
                {stats?.totalProjects ?? savedProjects.length}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">Cluster Status</div>
              <div className="text-sm font-bold text-[#243d78] flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>127.0.0.1:27017</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 text-[#243d78] border border-blue-200">
              <Server className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "users"
                ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Validated Startups ({savedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-[#243d78] text-white shadow-sm border border-[#12224d]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry &amp; MongoDB</span>
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Tab Contents: Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: USERS */}
          {activeTab === "users" && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Registered At</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {usersList.map((u) => (
                      <tr key={u.id || u.username} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#243d78] flex items-center justify-center font-bold text-xs border border-blue-200">
                            {u.username.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div>{u.name || u.username}</div>
                            <div className="text-[10px] text-slate-500 font-mono">@{u.username}</div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email || "—"}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              u.role === "admin"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                        </td>
                        <td className="p-3 text-right">
                          {u.role === "admin" ? (
                            <span className="text-[10px] text-slate-500 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isDeleting === (u.id || u.username)}
                              className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-3">
              {savedProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No validated projects found in database yet. Run the 14-stage wizard to generate one!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#243d78] shadow-sm transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{p.selectedIdea.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Score: {p.feasibility.overallScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {p.selectedIdea.tagline}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{p.founderProfile.targetAudience}</span>
                        {onSelectProject && (
                          <button
                            onClick={() => {
                              onSelectProject(p);
                              onClose();
                            }}
                            className="text-[#243d78] hover:text-[#1a2d5a] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect Report</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TELEMETRY */}
          {activeTab === "telemetry" && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>MongoDB Infrastructure Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">Database Name</span>
                    <span className="font-mono text-emerald-700 font-semibold">startupgen</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">Host</span>
                    <span className="font-mono text-[#243d78] font-semibold">127.0.0.1:27017</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">Active Collections</span>
                    <span className="font-mono text-slate-800">projects, users, reports</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">Sync Driver</span>
                    <span className="font-mono text-slate-800">mongodb@v7.6 (Native Node)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>StartupGen Administrator Security Suite</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm transition font-semibold cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
