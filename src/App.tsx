/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { PresetSelector } from "./components/PresetSelector.js";
import { ScoreGauges } from "./components/ScoreGauges.js";
import { VerdictBanner } from "./components/VerdictBanner.js";
import { RedFlagsList } from "./components/RedFlagsList.js";
import { RawJsonView } from "./components/RawJsonView.js";
import { ApiDocumentation } from "./components/ApiDocumentation.js";
import { ThemeToggle } from "./components/ThemeToggle.js";
import { ModelSelector, AvailableModelId } from "./components/ModelSelector.js";
import { InteractiveThreatCharts } from "./components/InteractiveThreatCharts.js";
import { PRESET_SAMPLES } from "./data/samples.js";
import type { PresetSample, ScamAnalysisResult } from "./types.js";
import {
  ShieldAlert,
  Loader2,
  Trash2,
  Code,
  LayoutDashboard,
  Terminal,
  AlertCircle,
  HelpCircle,
  FileText,
  Paperclip,
} from "lucide-react";

export default function App() {
  const [inputText, setInputText] = useState<string>(PRESET_SAMPLES[0].text);
  const [activePresetId, setActivePresetId] = useState<string>(PRESET_SAMPLES[0].id);
  const [selectedModel, setSelectedModel] = useState<AvailableModelId>("gemini-3.8-flash");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "raw_json" | "api">("dashboard");
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("scam_analyzer_theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Sync theme with document class, color-scheme and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      document.body.classList.remove("dark");
    }
    localStorage.setItem("scam_analyzer_theme", theme);
  }, [theme]);

  // Check health and run initial analysis on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        // quiet catch
      });

    // Run initial analysis with sample 1
    handleAnalyze(PRESET_SAMPLES[0].text, "gemini-3.8-flash");
  }, []);

  const handleAnalyze = async (textToAnalyze?: string, modelOverride?: AvailableModelId) => {
    const queryText = typeof textToAnalyze === "string" ? textToAnalyze : inputText;
    const modelToUse = modelOverride || selectedModel;

    if (!queryText || !queryText.trim()) {
      setErrorMsg("Please enter text or select a scenario to analyze.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: queryText.trim(),
          preferredModel: modelToUse,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error ${response.status}`);
      }

      const result: ScamAnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err: unknown) {
      console.error("Analysis failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: AvailableModelId) => {
    setSelectedModel(model);
    handleAnalyze(undefined, model);
  };

  const handleSelectSample = (sample: PresetSample) => {
    setActivePresetId(sample.id);
    setInputText(sample.text);
    handleAnalyze(sample.text);
  };

  const handleClear = () => {
    setInputText("");
    setActivePresetId("");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setInputText(content);
        setActivePresetId("");
        handleAnalyze(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 bg-cyber-grid`}>
      <Header
        apiStatus={isLoading ? "analyzing" : "ready"}
        hasKey={hasApiKey}
        theme={theme}
        onSelectTheme={setTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Preset quick buttons */}
        <PresetSelector
          onSelectSample={handleSelectSample}
          activeId={activePresetId}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Text Area */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col h-full transition-colors">
              {/* Header with Title and Actions */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Message / Offer Content
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Paste suspicious emails, job offers, or rental listings
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    title="Import text from a document or text file"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3 h-3 text-slate-500" />
                    <span>Import File</span>
                    <input
                      type="file"
                      id="scam-text-file-import"
                      name="scam_text_file"
                      accept=".txt,.eml,.msg,.json,.md,.csv,.rtf"
                      onChange={handleImportFile}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>

                  {inputText && (
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isLoading}
                      title="Clear text"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Text Area */}
              <div className="flex flex-col flex-1">
                <div className="relative flex-1 min-h-[280px] sm:min-h-[340px]">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (activePresetId) setActivePresetId("");
                    }}
                    placeholder="Paste a suspicious job offer, email, employment agreement, rental advertisement, or message here... (e.g. mentions of courier check, buying equipment from approved vendors, wire transfer before keys, Telegram interview)"
                    className="w-full h-full min-h-[280px] sm:min-h-[340px] p-3.5 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-2">
                  <span>
                    {inputText.trim().length} characters · {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Live detection for upfront fees & check float traps
                  </span>
                </div>

                {/* Quick test snippet tags */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mr-1">
                    Quick Triggers:
                  </span>
                  {[
                    { label: "+ Cashier Check Trap", text: " We will mail you a cashier check for $4,500. Deposit it and send $3,800 to our equipment vendor." },
                    { label: "+ Zelle Deposit", text: " Please send first month rent and deposit via Zelle before key delivery." },
                    { label: "+ Telegram Screen", text: " Message our HR manager @recruiter_msft on Telegram for your interview." },
                  ].map((snippet, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText((prev) => (prev ? prev + "\n" + snippet.text : snippet.text))}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {snippet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="hidden sm:inline">Calibrated on 2024-2026 fraud vectors</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAnalyze()}
                  disabled={isLoading || !inputText.trim()}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
                    isLoading || !inputText.trim()
                      ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] ring-4 ring-rose-500/20 shadow-rose-500/25"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Scanning Scam Markers...</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>Analyze Threat Risk</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Threat Analysis & JSON Inspector */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            {/* Tab navigation */}
            <div className="flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm transition-colors">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Threat Intelligence</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("raw_json")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "raw_json"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Raw JSON Output</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono">
                    Schema
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("api")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "api"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>API Docs</span>
                </button>
              </div>

              {analysisResult && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pr-3 font-mono">
                  <span className="font-semibold">Risk:</span>
                  <span
                    className={`font-black px-2 py-0.5 rounded-full text-xs ${
                      analysisResult.scam_threat_index >= 70
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900"
                        : analysisResult.scam_threat_index >= 30
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-900"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900"
                    }`}
                  >
                    {analysisResult.scam_threat_index}/100
                  </span>
                </div>
              )}
            </div>

            {/* Error message if any */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Analysis Error:</strong> {errorMsg}
                </div>
              </div>
            )}

            {/* Content per Tab */}
            {isLoading && !analysisResult && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center shadow-xs">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Running Deep Forensic Scam Analysis...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  Evaluating check deposit trap signatures, advance fee mechanics, domain authentication, and wire transfer requests.
                </p>
              </div>
            )}

            {analysisResult && activeTab === "dashboard" && (
              <div className="flex flex-col gap-4">
                {/* AI Model Intelligence & Inference Selector */}
                <ModelSelector
                  selectedModel={selectedModel}
                  onSelectModel={handleModelChange}
                  modelInfo={analysisResult.model_info}
                  isLoading={isLoading}
                  onRerun={() => handleAnalyze(undefined, selectedModel)}
                />

                {/* 3 Metric Gauges */}
                <ScoreGauges
                  scamThreatIndex={analysisResult.scam_threat_index}
                  paymentRiskScore={analysisResult.payment_risk_score}
                  domainRiskScore={analysisResult.domain_risk_score}
                />

                {/* Interactive Multi-Vector Forensic Graphs (Radar, Vector Breakdown & Archetypes) */}
                <InteractiveThreatCharts
                  vectors={analysisResult.vectors}
                  scamThreatIndex={analysisResult.scam_threat_index}
                  paymentRiskScore={analysisResult.payment_risk_score}
                  domainRiskScore={analysisResult.domain_risk_score}
                />

                {/* Verdict Summary Banner */}
                <VerdictBanner
                  verdict={analysisResult.verdict}
                  threatIndex={analysisResult.scam_threat_index}
                />

                {/* Red Flags List */}
                <RedFlagsList
                  redFlags={analysisResult.red_flags}
                  threatIndex={analysisResult.scam_threat_index}
                />

                {/* Compact Raw JSON Drawer preview for immediate access */}
                <div className="pt-2">
                  <RawJsonView data={analysisResult} />
                </div>
              </div>
            )}

            {analysisResult && activeTab === "raw_json" && (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <Code className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Pure Schema Output:</span> This matches the exact requested JSON contract with <code className="font-mono bg-blue-100/80 dark:bg-blue-900/50 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">scam_threat_index</code>, <code className="font-mono bg-blue-100/80 dark:bg-blue-900/50 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">payment_risk_score</code>, <code className="font-mono bg-blue-100/80 dark:bg-blue-900/50 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">domain_risk_score</code>, <code className="font-mono bg-blue-100/80 dark:bg-blue-900/50 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">red_flags</code>, and <code className="font-mono bg-blue-100/80 dark:bg-blue-900/50 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">verdict</code>.
                  </div>
                </div>
                <RawJsonView data={analysisResult} />
              </div>
            )}

            {activeTab === "api" && (
              <div className="flex flex-col gap-4">
                <ApiDocumentation />
                {analysisResult && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Live Response Preview
                    </div>
                    <RawJsonView data={analysisResult} />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Scam Threat Analyzer · Automated fraud detection for employment, rental listings, and payment wire traps.
          </div>
          <div className="flex items-center gap-2">
            <span>Theme:</span>
            <ThemeToggle theme={theme} onSelectTheme={setTheme} />
          </div>
        </div>
      </footer>
    </div>
  );
}

