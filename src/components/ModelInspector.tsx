import React, { useState } from "react";
import type { ModelComparisonResult, AttackStage, FeatureAttribution, ModelInfo } from "../types.js";
import {
  Cpu,
  Brain,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Gauge,
  Workflow,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ModelInspectorProps {
  models?: ModelComparisonResult[];
  attackStages?: AttackStage[];
  featureWeights?: FeatureAttribution[];
  currentModelInfo?: ModelInfo;
  scamThreatIndex: number;
}

export const ModelInspector: React.FC<ModelInspectorProps> = ({
  models = [],
  attackStages = [],
  featureWeights = [],
  currentModelInfo,
  scamThreatIndex,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    currentModelInfo?.model_id || (models[0]?.id ?? "gemini-3.8-flash")
  );
  const [activeModelTab, setActiveModelTab] = useState<"consensus" | "attack_chain" | "features">("consensus");
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-4 transition-colors">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400">
              <Brain className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              AI & Fraud Threat Models
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Ensemble model comparison, MITRE ATT&CK fraud stages, and explainable feature attribution
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveModelTab("consensus")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeModelTab === "consensus"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Model Ensemble
          </button>
          <button
            type="button"
            onClick={() => setActiveModelTab("attack_chain")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeModelTab === "attack_chain"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Attack Lifecycle
          </button>
          <button
            type="button"
            onClick={() => setActiveModelTab("features")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeModelTab === "features"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Feature Weights
          </button>
        </div>
      </div>

      {/* 1. Model Ensemble & Consensus View */}
      {activeModelTab === "consensus" && (
        <div className="flex flex-col gap-4">
          {/* Ensemble Consensus Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50/80 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/50 border border-indigo-200/70 dark:border-indigo-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Multi-Model Consensus Agreement
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    High Confidence
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Cross-validation across Google Gemini foundation models and deterministic heuristic rule engine.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Consensus Score</span>
              <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {selectedModel?.consensus_agreement || 96}%
              </span>
            </div>
          </div>

          {/* Model Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {models.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModelId(model.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  )}
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {model.family}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {model.name}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Threat Index</span>
                      <span className={`text-base font-black font-mono leading-none ${
                        model.scam_threat_index >= 75
                          ? "text-rose-600 dark:text-rose-400"
                          : model.scam_threat_index >= 40
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {model.scam_threat_index}/100
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Latency</span>
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {model.latency_ms} ms
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Model Detailed Card */}
          {selectedModel && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/50 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/80 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedModel.name} — Architecture & Reasoning Focus
                  </h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {selectedModel.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Model Confidence:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedModel.confidence}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedModel.reasoning_focus}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Scam Index</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedModel.scam_threat_index} / 100</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Risk</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedModel.payment_risk} / 100</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Domain Risk</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedModel.domain_risk} / 100</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Inference Speed</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedModel.latency_ms} ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Attack Lifecycle (MITRE ATT&CK Fraud Framework) */}
      {activeModelTab === "attack_chain" && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Mapping against the 5-Stage Fraud Kill Chain & MITRE ATT&CK Pretexting Framework</span>
            <span className="text-[10px] text-slate-400">Click stage for forensic findings</span>
          </div>

          <div className="flex flex-col gap-2">
            {attackStages.map((stage) => {
              const isSelected = selectedStage === stage.stage;
              const isDetected = stage.status === "detected";
              const isHighRisk = stage.status === "high_risk";

              return (
                <div
                  key={stage.stage}
                  onClick={() => setSelectedStage(isSelected ? null : stage.stage)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/30"
                      : isDetected
                      ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20"
                      : isHighRisk
                      ? "border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20"
                      : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                          isDetected
                            ? "bg-rose-500 text-white"
                            : isHighRisk
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {stage.stage}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{stage.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {stage.mitre_ref}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {stage.tactic}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isDetected
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900"
                            : isHighRisk
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-900"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900"
                        }`}
                      >
                        {stage.status}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isSelected ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Forensic Evidence & Findings:
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {stage.evidence}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Explainable Feature Attribution (SHAP-style Feature Impact Weights) */}
      {activeModelTab === "features" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Feature attribution analysis: Contribution to final scam threat classification
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <TrendingUp className="w-3 h-3" /> Scam Driver (+Risk)
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <TrendingDown className="w-3 h-3" /> Legitimacy Anchor (-Risk)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {featureWeights.map((feat) => {
              const isPositive = feat.weight > 0;
              const absWeight = Math.abs(feat.weight);
              const maxScale = 45;
              const widthPct = Math.min(100, Math.round((absWeight / maxScale) * 100));

              return (
                <div
                  key={feat.id}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-xs flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {feat.feature}
                    </span>
                    <span
                      className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                        isPositive
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isPositive ? `+${feat.weight}` : `${feat.weight}`} pts
                    </span>
                  </div>

                  {/* Impact bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {feat.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
