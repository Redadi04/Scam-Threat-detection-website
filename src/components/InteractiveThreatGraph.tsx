import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import type { ThreatVector } from "../types.js";
import {
  Sliders,
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Layers,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface InteractiveThreatGraphProps {
  vectors?: ThreatVector[];
  scamThreatIndex: number;
  paymentRiskScore: number;
  domainRiskScore: number;
}

export const InteractiveThreatGraph: React.FC<InteractiveThreatGraphProps> = ({
  vectors = [],
  scamThreatIndex,
  paymentRiskScore,
  domainRiskScore,
}) => {
  const [activeChart, setActiveChart] = useState<"radar" | "bar" | "simulator">("radar");
  const [selectedVector, setSelectedVector] = useState<string | null>(null);

  // Interactive What-If Simulation State
  const [simCheckFloat, setSimCheckFloat] = useState<boolean>(paymentRiskScore >= 50);
  const [simWireZelle, setSimWireZelle] = useState<boolean>(paymentRiskScore >= 65);
  const [simFreeEmail, setSimFreeEmail] = useState<boolean>(domainRiskScore >= 50);
  const [simVideoInterview, setSimVideoInterview] = useState<boolean>(false);
  const [simFormalW2, setSimFormalW2] = useState<boolean>(false);

  // Compute simulated threat score dynamically
  let simDelta = 0;
  if (simCheckFloat) simDelta += 35;
  if (simWireZelle) simDelta += 28;
  if (simFreeEmail) simDelta += 20;
  if (simVideoInterview) simDelta -= 25;
  if (simFormalW2) simDelta -= 30;

  // Base raw baseline calculation
  const baseSimScore = Math.min(100, Math.max(5, Math.round((scamThreatIndex + paymentRiskScore + domainRiskScore) / 3)));
  const computedSimScore = Math.min(100, Math.max(4, baseSimScore + (simCheckFloat ? 15 : -10) + (simWireZelle ? 12 : -10) + (simFreeEmail ? 8 : -8) + (simVideoInterview ? -18 : 0) + (simFormalW2 ? -22 : 0)));

  // Radar data mapping
  const radarData = vectors.map((v) => ({
    subject: v.category,
    threatScore: v.score,
    safeBenchmark: v.benchmark,
    fullMark: 100,
    description: v.description,
    status: v.status,
  }));

  // Bar chart data
  const barData = vectors.map((v) => ({
    name: v.category,
    score: v.score,
    benchmark: v.benchmark,
    description: v.description,
  }));

  // Area chart data for the interactive simulator across fraud stages
  const simulationStagesData = [
    { stage: "1. Initial Contact", baseline: Math.round(scamThreatIndex * 0.45), simulated: Math.round(computedSimScore * 0.4) },
    { stage: "2. Identity Screening", baseline: Math.round(scamThreatIndex * 0.65), simulated: Math.round(computedSimScore * 0.6) },
    { stage: "3. Contract & Offer", baseline: Math.round(scamThreatIndex * 0.85), simulated: Math.round(computedSimScore * 0.8) },
    { stage: "4. Check / Deposit", baseline: Math.round(scamThreatIndex * 0.95), simulated: Math.round(computedSimScore * 0.92) },
    { stage: "5. Irreversible Wire", baseline: scamThreatIndex, simulated: computedSimScore },
  ];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-4 transition-colors">
      {/* Chart Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200/60 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Interactive Threat Intelligence Graphs
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Multi-dimensional risk radar, severity spectrum, and interactive what-if simulation
          </p>
        </div>

        {/* View mode toggle pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveChart("radar")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeChart === "radar"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Radar Spectrum
          </button>
          <button
            type="button"
            onClick={() => setActiveChart("bar")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeChart === "bar"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Vector Severity
          </button>
          <button
            type="button"
            onClick={() => setActiveChart("simulator")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeChart === "simulator"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>What-If Model</span>
          </button>
        </div>
      </div>

      {/* 1. Radar Chart View */}
      {activeChart === "radar" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Detected Threat Pattern
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                Safe Enterprise Baseline (≤15)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Hover nodes for forensic specifics</span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" opacity={0.4} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 text-white text-xs rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md max-w-xs">
                          <div className="font-bold text-sm text-rose-400 flex items-center justify-between">
                            <span>{data.subject}</span>
                            <span className="font-mono text-white text-xs px-1.5 py-0.5 rounded bg-rose-500/30">
                              {data.threatScore}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">{data.description}</p>
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Benchmark: {data.safeBenchmark} pts</span>
                            <span
                              className={`font-bold uppercase ${
                                data.threatScore >= 70
                                  ? "text-rose-400"
                                  : data.threatScore >= 40
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {data.status}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar
                  name="Safe Baseline"
                  dataKey="safeBenchmark"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
                <Radar
                  name="Detected Threat"
                  dataKey="threatScore"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Mini Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {vectors.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedVector(selectedVector === v.category ? null : v.category)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedVector === v.category
                    ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 dark:bg-rose-950/40"
                    : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                    {v.category}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded ${
                      v.score >= 75
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : v.score >= 40
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {v.score}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      v.score >= 75 ? "bg-rose-500" : v.score >= 40 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${v.score}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Vector Severity Bar Chart View */}
      {activeChart === "bar" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 dark:text-slate-400">
              Thresholds: <strong className="text-rose-600 dark:text-rose-400">Critical (&gt;75)</strong> ·{" "}
              <strong className="text-amber-600 dark:text-amber-400">Suspicious (40-74)</strong> ·{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">Benign (&lt;40)</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Scale: 0-100</span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Critical (75)", fill: "#f43f5e", fontSize: 10 }} />
                <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Suspicious (40)", fill: "#f59e0b", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900/95 text-white text-xs rounded-xl shadow-xl border border-slate-700/80">
                          <div className="font-bold text-sm text-rose-400">{data.name}</div>
                          <div className="text-white font-mono text-base font-black my-1">
                            {data.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{data.description}</p>
                          <div className="mt-2 text-[10px] text-slate-400">
                            Safe Standard: ≤{data.benchmark} pts
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score >= 75
                          ? "#f43f5e"
                          : entry.score >= 40
                          ? "#f59e0b"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. What-If Interactive Simulator View */}
      {activeChart === "simulator" && (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 dark:text-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Real-Time Threat Sensitivity Simulation</span>
              </div>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                Toggle scenario factors below to observe how the AI threat model recalibrates across each attack stage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Simulated Score</span>
                <span className={`text-xl font-black font-mono leading-none ${
                  computedSimScore >= 75 ? "text-rose-600 dark:text-rose-400" : computedSimScore >= 40 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {computedSimScore}
                  <span className="text-xs font-semibold text-slate-400">/100</span>
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                computedSimScore < scamThreatIndex ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}>
                {computedSimScore <= scamThreatIndex ? "" : "+"}
                {computedSimScore - scamThreatIndex} pts
              </span>
            </div>
          </div>

          {/* Interactive Toggle Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200">Cashier Check Deposit</span>
                <span className="text-[10px] text-slate-400">Employer mails paper check (+35 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={simCheckFloat}
                onChange={(e) => setSimCheckFloat(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200">Wire / Zelle Reversal Demand</span>
                <span className="text-[10px] text-slate-400">Non-repudiable transfer to vendor (+28 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={simWireZelle}
                onChange={(e) => setSimWireZelle(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200">Free Webmail Sender (@gmail)</span>
                <span className="text-[10px] text-slate-400">Public domain used for enterprise HR (+20 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={simFreeEmail}
                onChange={(e) => setSimFreeEmail(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200">Live Video Interview Conducted</span>
                <span className="text-[10px] text-slate-400">Visual face-to-face employee verification (-25 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={simVideoInterview}
                onChange={(e) => setSimVideoInterview(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs sm:col-span-2">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200">Formal W-2 / I-9 Paperwork via Enterprise Portal</span>
                <span className="text-[10px] text-slate-400">Legitimate HR onboarding with verified tax withholding (-30 pts)</span>
              </div>
              <input
                type="checkbox"
                checked={simFormalW2}
                onChange={(e) => setSimFormalW2(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Area curve comparison across the 5 attack stages */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Threat Escalation Curve by Fraud Stage
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block"></span> Baseline Detected
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Simulated Scenario
                </span>
              </div>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationStagesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="stage" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2.5 bg-slate-900/95 text-white text-xs rounded-xl shadow-lg border border-slate-700">
                            <div className="font-bold text-slate-200">{label}</div>
                            <div className="mt-1 flex items-center justify-between gap-4">
                              <span className="text-slate-400">Baseline:</span>
                              <span className="font-mono font-bold">{payload[0]?.value}/100</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-rose-400">
                              <span>Simulated:</span>
                              <span className="font-mono font-bold">{payload[1]?.value}/100</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fill="url(#baselineGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="simulated"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#simGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
