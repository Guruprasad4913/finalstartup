"use client";

import React, { useState } from "react";
import { X, Trash2, ExternalLink, Download, Sparkles, TrendingUp, ShieldAlert, Award, Scale, Database } from "lucide-react";
import { StartupProject, User } from "@/types";
import { deleteProjectFromVault, exportProjectAsMarkdown } from "@/lib/storage";

interface CloudVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StartupProject[];
  currentUser?: User | null;
  onSelectProject: (p: StartupProject) => void;
  onProjectDeleted: () => void;
  onOpenCompare?: () => void;
}

export const CloudVaultModal: React.FC<CloudVaultModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentUser,
  onSelectProject,
  onProjectDeleted,
  onOpenCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filtered = projects.filter(
    (p) =>
      p.selectedIdea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.selectedIdea.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.selectedIdea.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this validated startup report from your Cloud Vault?")) {
      deleteProjectFromVault(id, currentUser);
      onProjectDeleted();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">Cloud Storage Vault</h2>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                {projects.length} Saved Reports
              </span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" /> MongoDB Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently preserved in MongoDB &amp; local storage cache with live API market metrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input & Compare Trigger */}
        {projects.length > 0 && (
          <div className="my-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search saved startups by name, domain, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCompare();
                }}
                className="px-4 py-2 rounded-xl bg-[#243d78] hover:bg-[#1a2d5a] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Ideas</span>
              </button>
            )}
          </div>
        )}

        {/* Projects list */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {projects.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No saved startups yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Generate an idea and click &quot;Save to Cloud Vault&quot; in the final report to store it here for future reference and comparison.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No startup concepts match your search criteria.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProject(p);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
                      {p.selectedIdea.name}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {p.selectedIdea.domain}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {p.selectedIdea.tagline}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Score: {p.feasibility.overallScore}/100 ({p.feasibility.verdict})
                    </span>
                    <span className="flex items-center gap-1 text-blue-700">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      TAM: {p.validation.tam.value}
                    </span>
                    <span className="text-slate-500">
                      Provider: {p.feasibility.cloudArchitecture.recommendedProvider}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={(e) => handleDownloadMarkdown(p, e)}
                    className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                    title="Export Markdown Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3.5 py-1.5 rounded-lg bg-[#243d78] hover:bg-[#1a2d5a] text-white transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    Load Report <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
