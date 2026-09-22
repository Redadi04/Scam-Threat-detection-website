import React, { useState } from "react";
import type { ScamAnalysisResult } from "../types.js";
import { Check, Copy, Download, Code, CheckCircle, Terminal } from "lucide-react";
import { motion } from "motion/react";

interface RawJsonViewProps {
  data: ScamAnalysisResult;
}

export const RawJsonView: React.FC<RawJsonViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [minified, setMinified] = useState(false);

  // Exact JSON object with the exact requested schema
  const rawJsonObject = {
    scam_threat_index: data.scam_threat_index,
    payment_risk_score: data.payment_risk_score,
    domain_risk_score: data.domain_risk_score,
    red_flags: data.red_flags,
    verdict: data.verdict,
  };

  const jsonString = minified
    ? JSON.stringify(rawJsonObject)
    : JSON.stringify(rawJsonObject, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scam-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-slate-100">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-3">
          {/* Mac/Linux Terminal Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Raw JSON Response
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            Verified JSON Schema
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Format / Minify Toggle */}
          <div className="flex rounded-lg bg-slate-800/90 p-0.5 text-xs font-mono border border-slate-700">
            <button
              type="button"
              onClick={() => setMinified(false)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                !minified
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pretty
            </button>
            <button
              type="button"
              onClick={() => setMinified(true)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                minified
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Minified
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Raw JSON</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw JSON</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            title="Download JSON file"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Area with Syntax Highlighting Look */}
      <div className="p-4 sm:p-5 overflow-x-auto max-h-[380px] bg-slate-950 font-mono text-xs sm:text-sm leading-relaxed">
        <pre className="text-emerald-400 select-all">
          <code>{jsonString}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span>Content-Type: application/json</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">200 OK</span>
        </div>
        <span>{jsonString.length} bytes</span>
      </div>
    </div>
  );
};
