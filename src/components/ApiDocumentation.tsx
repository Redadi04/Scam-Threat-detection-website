import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export const ApiDocumentation: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const curlCommand = `curl -X POST https://ais-dev-ddjwgntukdrcsbs6igwywa-952658641774.asia-east1.run.app/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "We will mail you a check for $4,500 to buy office supplies from our vendor..."}'`;

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Developer API Endpoint: POST /api/analyze
          </h4>
        </div>
        <button
          type="button"
          onClick={copyCurl}
          className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy cURL</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
        Integrate automated fraud detection into your pipeline. Send text to receive pure JSON with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">scam_threat_index</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">payment_risk_score</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">domain_risk_score</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">red_flags</code>, and <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">verdict</code>.
      </p>

      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
        {curlCommand}
      </div>
    </div>
  );
};
