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
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Compass,
  GitCompare,
  Info,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Sparkles,
} from "lucide-react";
import type { ThreatVector } from "../types.js";

interface InteractiveThreatChartsProps {
  vectors?: ThreatVector[];
  scamThreatIndex: number;
  paymentRiskScore: number;
  domainRiskScore: number;
}

type ChartViewMode = "radar" | "breakdown" | "archetypes" | "simulator";

export const InteractiveThreatCharts: React.FC<InteractiveThreatChartsProps> = ({
  vectors = [],
  scamThreatIndex,
  paymentRiskScore,
  domainRiskScore,
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>("radar");
  const [selectedVector, setSelectedVector] = useState<ThreatVector | null>(
    vectors.length > 0 ? vectors[0] : null
  );

  // Interactive What-If Simulation State
  const [simCheckFloat, setSimCheckFloat] = useState<boolean>(paymentRiskScore >= 50);
  const [simWireZelle, setSimWireZelle] = useState<boolean>(paymentRiskScore >= 65);
  const [simFreeEmail, setSimFreeEmail] = useState<boolean>(domainRiskScore >= 50);
  const [simVideoInterview, setSimVideoInterview] = useState<boolean>(false);
  const [simFormalW2, setSimFormalW2] = useState<boolean>(false);

  // Compute simulated threat score dynamically
  const baseSimScore = Math.min(100, Math.max(5, Math.round((scamThreatIndex + paymentRiskScore + domainRiskScore) / 3)));
  const computedSimScore = Math.min(
    100,
    Math.max(
      4,
      baseSimScore +
        (simCheckFloat ? 15 : -10) +
        (simWireZelle ? 12 : -10) +
        (simFreeEmail ? 8 : -8) +
        (simVideoInterview ? -18 : 0) +
        (simFormalW2 ? -22 : 0)
    )
  );

  const simulationStagesData = [
    { stage: "1. Outreach", baseline: Math.round(scamThreatIndex * 0.45), simulated: Math.round(computedSimScore * 0.4) },
    { stage: "2. Identity", baseline: Math.round(scamThreatIndex * 0.65), simulated: Math.round(computedSimScore * 0.6) },
    { stage: "3. Agreement", baseline: Math.round(scamThreatIndex * 0.85), simulated: Math.round(computedSimScore * 0.8) },
    { stage: "4. Check Deposit", baseline: Math.round(scamThreatIndex * 0.95), simulated: Math.round(computedSimScore * 0.92) },
    { stage: "5. Wire Liquidation", baseline: scamThreatIndex, simulated: computedSimScore },
  ];

  // Fallback vectors if not provided by backend
  const activeVectors: ThreatVector[] =
    vectors.length > 0
      ? vectors
      : [
          {
            category: "Payment Float",
            score: paymentRiskScore,
            benchmark: 15,
            description: "Counterfeit check float traps, overpayment reversals, or wire demands",
            status: paymentRiskScore >= 75 ? "critical" : paymentRiskScore >= 40 ? "suspicious" : "safe",
          },
          {
            category: "Domain Spoofing",
            score: domainRiskScore,
            benchmark: 12,
            description: "Sender identity, lookalike domains, or off-platform redirection",
            status: domainRiskScore >= 75 ? "critical" : domainRiskScore >= 40 ? "suspicious" : "safe",
          },
          {
            category: "Upfront Fees",
            score: Math.min(100, Math.round(paymentRiskScore * 0.88)),
            benchmark: 10,
            description: "Advance fees, buying equipment from approved vendors, or deposits",
            status: paymentRiskScore >= 70 ? "critical" : paymentRiskScore >= 40 ? "suspicious" : "safe",
          },
          {
            category: "Linguistic Urgency",
            score: Math.min(100, Math.round(scamThreatIndex * 0.85)),
            benchmark: 18,
            description: "Artificial 24-hr deadlines, hurried onboarding, and emotional pressure",
            status: scamThreatIndex >= 70 ? "critical" : scamThreatIndex >= 40 ? "suspicious" : "safe",
          },
          {
            category: "Legitimacy Gap",
            score: Math.min(100, Math.round(Math.max(scamThreatIndex, domainRiskScore) * 0.8)),
            benchmark: 14,
            description: "Omission of verifiable corporate registration, licensing, or official screening",
            status: Math.max(scamThreatIndex, domainRiskScore) >= 70 ? "critical" : "safe",
          },
        ];

  // Radar Data
  const radarData = activeVectors.map((v) => ({
    category: v.category,
    currentScore: v.score,
    safeBenchmark: v.benchmark,
    fullVector: v,
  }));

  // Archetype Benchmark Comparison Data
  const archetypeData = [
    {
      name: "Check Float Trap",
      score: 96,
      type: "benchmark",
      color: "#e11d48",
      description: "Counterfeit courier check + vendor wire transfer return",
    },
    {
      name: "Rental Advance Wire",
      score: 92,
      type: "benchmark",
      color: "#f43f5e",
      description: "Sight-unseen security deposit demand via Zelle/wire",
    },
    {
      name: "Telegram Interview",
      score: 84,
      type: "benchmark",
      color: "#fb7185",
      description: "Off-platform chat screen with free @gmail HR contact",
    },
    {
      name: "This Message",
      score: scamThreatIndex,
      type: "active",
      color: scamThreatIndex >= 75 ? "#e11d48" : scamThreatIndex >= 45 ? "#f59e0b" : "#10b981",
      description: `Current scan overall threat rating (${scamThreatIndex}/100)`,
    },
    {
      name: "Legit Job Offer",
      score: 12,
      type: "benchmark",
      color: "#10b981",
      description: "Standard formal contract with official corporate payroll",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 75) return "#f43f5e";
    if (score >= 40) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 transition-colors">
      {/* Header & Chart View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Interactive Threat Vector Graph
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Visual risk distribution across multidimensional forensic axes
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setViewMode("radar")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "radar"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-rose-500" />
            <span>Radar Map</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("breakdown")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "breakdown"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Vector Bars</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("archetypes")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "archetypes"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Archetypes</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("simulator")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "simulator"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-rose-500" />
            <span>What-If Model</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {viewMode === "simulator" ? (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950 dark:text-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Interactive Threat Sensitivity Simulator</span>
              </div>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                Toggle scenario variables to observe real-time model score shifts and stage curve escalation.
              </p>
            </div>
            <div className="flex items-center gap-3">
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

          {/* Interactive Checkbox Matrix */}
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
                <span className="font-bold text-slate-800 dark:text-slate-200">Wire / Zelle Vendor Payment</span>
                <span className="text-[10px] text-slate-400">Non-repudiable transfer to supplier (+28 pts)</span>
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
                <span className="font-bold text-slate-800 dark:text-slate-200">Public Webmail Domain (@gmail)</span>
                <span className="text-[10px] text-slate-400">Public email used for corporate HR (+20 pts)</span>
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
                <span className="font-bold text-slate-800 dark:text-slate-200">Formal W-2 / I-9 Paperwork via Verified Portal</span>
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

          {/* Area Chart Comparison */}
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
                    <linearGradient id="chartBaselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="chartSimGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#chartBaselineGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="simulated"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#chartSimGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-72 sm:h-80">
          {viewMode === "radar" && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" className="dark:opacity-20" />
                <PolarAngleAxis
                  dataKey="category"
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
                        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800 pb-1">
                            <span className="font-bold text-slate-200">{data.category}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                data.currentScore >= 75
                                  ? "bg-rose-500/30 text-rose-300"
                                  : data.currentScore >= 40
                                  ? "bg-amber-500/30 text-amber-300"
                                  : "bg-emerald-500/30 text-emerald-300"
                              }`}
                            >
                              {data.currentScore}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mb-1.5 leading-relaxed">
                            {data.fullVector?.description}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Safe Baseline: {data.safeBenchmark}</span>
                            <span className="text-rose-400 font-semibold">
                              Delta: +{Math.max(0, data.currentScore - data.safeBenchmark)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Safe Baseline Overlay */}
                <Radar
                  name="Safe Baseline"
                  dataKey="safeBenchmark"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                {/* Active Threat Radar */}
                <Radar
                  name="Active Threat Score"
                  dataKey="currentScore"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {viewMode === "breakdown" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeVectors}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-20" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ThreatVector;
                      return (
                        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold">{item.category}</span>
                            <span className="font-mono text-rose-400 font-bold">{item.score}/100</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={40} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Warning", fill: "#f59e0b", fontSize: 9 }} />
                <ReferenceLine x={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Critical", fill: "#f43f5e", fontSize: 9 }} />
                <Bar
                  dataKey="score"
                  radius={[0, 6, 6, 0]}
                  onClick={(entry) => setSelectedVector(entry as unknown as ThreatVector)}
                  cursor="pointer"
                >
                  {activeVectors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {viewMode === "archetypes" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={archetypeData}
                margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-20" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold">{item.name}</span>
                            <span className="font-mono font-bold" style={{ color: item.color }}>
                              {item.score}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x="This Message" stroke="#6366f1" strokeWidth={2} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {archetypeData.map((entry, index) => (
                    <Cell
                      key={`arch-cell-${index}`}
                      fill={entry.color}
                      stroke={entry.type === "active" ? "#6366f1" : undefined}
                      strokeWidth={entry.type === "active" ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Interactive Vector Inspector Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[11px]">
            {viewMode === "radar" && "Radar compares detected threat signature against clean commercial norms."}
            {viewMode === "breakdown" && "Click any vector bar to isolate and examine forensic evidence."}
            {viewMode === "archetypes" && "Calibrated against verified 2024-2026 FTC, FBI IC3, and BBB fraud reports."}
            {viewMode === "simulator" && "Simulates real-time risk escalation when critical fraud mechanisms are introduced."}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>&lt;40 Safe</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>40-74 Mod</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>75+ Crit</span>
          </div>
        </div>
      </div>
    </div>
  );
};


      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80">
        {viewMode === "radar" && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" className="dark:opacity-20" />
              <PolarAngleAxis
                dataKey="category"
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
                      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                        <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800 pb-1">
                          <span className="font-bold text-slate-200">{data.category}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              data.currentScore >= 75
                                ? "bg-rose-500/30 text-rose-300"
                                : data.currentScore >= 40
                                ? "bg-amber-500/30 text-amber-300"
                                : "bg-emerald-500/30 text-emerald-300"
                            }`}
                          >
                            {data.currentScore}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mb-1.5 leading-relaxed">
                          {data.fullVector?.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Safe Baseline: {data.safeBenchmark}</span>
                          <span className="text-rose-400 font-semibold">
                            Delta: +{Math.max(0, data.currentScore - data.safeBenchmark)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Safe Baseline Overlay */}
              <Radar
                name="Safe Baseline"
                dataKey="safeBenchmark"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeDasharray="4 4"
              />
              {/* Active Threat Radar */}
              <Radar
                name="Active Threat Score"
                dataKey="currentScore"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {viewMode === "breakdown" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeVectors}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-20" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                width={110}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ThreatVector;
                    return (
                      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold">{item.category}</span>
                          <span className="font-mono text-rose-400 font-bold">{item.score}/100</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x={40} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Warning", fill: "#f59e0b", fontSize: 9 }} />
              <ReferenceLine x={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Critical", fill: "#f43f5e", fontSize: 9 }} />
              <Bar
                dataKey="score"
                radius={[0, 6, 6, 0]}
                onClick={(entry) => setSelectedVector(entry as unknown as ThreatVector)}
                cursor="pointer"
              >
                {activeVectors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {viewMode === "archetypes" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={archetypeData}
              margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-20" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 10, fontWeight: 600 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold">{item.name}</span>
                          <span className="font-mono font-bold" style={{ color: item.color }}>
                            {item.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x="This Message" stroke="#6366f1" strokeWidth={2} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {archetypeData.map((entry, index) => (
                  <Cell
                    key={`arch-cell-${index}`}
                    fill={entry.color}
                    stroke={entry.type === "active" ? "#6366f1" : undefined}
                    strokeWidth={entry.type === "active" ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Interactive Vector Inspector Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[11px]">
            {viewMode === "radar" && "Radar compares detected threat signature against clean commercial norms."}
            {viewMode === "breakdown" && "Click any vector bar to isolate and examine forensic evidence."}
            {viewMode === "archetypes" && "Calibrated against verified 2024-2026 FTC, FBI IC3, and BBB fraud reports."}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>&lt;40 Safe</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>40-74 Mod</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>75+ Crit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
