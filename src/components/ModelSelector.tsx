import React from "react";
import { Cpu, Zap, ShieldCheck, Activity, Gauge, RefreshCw } from "lucide-react";
import type { ModelInfo } from "../types.js";

export type AvailableModelId = "gemini-3.8-flash" | "gemini-3.1-flash-lite" | "heuristic";

interface ModelSelectorProps {
  selectedModel: AvailableModelId;
  onSelectModel: (model: AvailableModelId) => void;
  modelInfo?: ModelInfo;
  isLoading: boolean;
  onRerun: () => void;
}

const MODELS_CONFIG: {
  id: AvailableModelId;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  latencyExpectation: string;
}[] = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    badge: "Neural Deep Reasoning",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    desc: "Advanced scam heuristic reasoning, psychological coercion detection, and fake check float forensics.",
    latencyExpectation: "~300ms",
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    badge: "Low Latency",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    desc: "High-throughput rapid screening optimized for fast validation and bulk message analysis.",
    latencyExpectation: "~180ms",
  },
  {
    id: "heuristic",
    name: "Heuristic Engine",
    badge: "Deterministic Rules",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    desc: "Offline regex & keyword pattern matching for equipment check floats, Zelle demands, and telegram interviews.",
    latencyExpectation: "~15ms",
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  modelInfo,
  isLoading,
  onRerun,
}) => {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                AI Detection Model & Inference Engine
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300/40">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Select model to benchmark threat sensitivity, detection latency, and reasoning depth
            </p>
          </div>
        </div>

        {/* Live Model Stats Badge */}
        {modelInfo && (
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>{modelInfo.latency_ms} ms</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              <span>{modelInfo.confidence}% conf</span>
            </div>
          </div>
        )}
      </div>

      {/* Model Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {MODELS_CONFIG.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelectModel(m.id);
              }}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/80 shadow-xs ring-2 ring-rose-500/20"
                  : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {m.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-semibold ${m.badgeColor}`}
                  >
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Speed: {m.latencyExpectation}</span>
                {isSelected && (
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-sans">
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Re-analyze with selected model trigger if changed */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/70">
        <span className="text-[11px]">
          Compare outputs across models to evaluate false-positive resistance.
        </span>
        <button
          type="button"
          onClick={onRerun}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          <span>Re-scan with {MODELS_CONFIG.find((m) => m.id === selectedModel)?.name}</span>
        </button>
      </div>
    </div>
  );
};
