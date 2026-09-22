import React, { useState } from "react";
import { CheckCircle2, Flag, AlertCircle, Copy, Check, Shield } from "lucide-react";
import { motion } from "motion/react";

interface RedFlagsListProps {
  redFlags: string[];
  threatIndex: number;
}

export const RedFlagsList: React.FC<RedFlagsListProps> = ({ redFlags, threatIndex }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const isSafe = threatIndex < 30 && redFlags.length <= 1 && redFlags[0]?.toLowerCase().includes("no immediate");

  const getFlagCategory = (flag: string) => {
    const text = flag.toLowerCase();
    if (text.includes("check") || text.includes("overpayment") || text.includes("vendor")) {
      return { tag: "CHECK DEPOSIT TRAP", color: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900" };
    }
    if (text.includes("wire") || text.includes("zelle") || text.includes("cashapp") || text.includes("crypto") || text.includes("bitcoin")) {
      return { tag: "IRREVERSIBLE WIRE", color: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900" };
    }
    if (text.includes("telegram") || text.includes("outlook") || text.includes("gmail") || text.includes("domain") || text.includes("whatsapp")) {
      return { tag: "SUSPICIOUS CHANNEL", color: "bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-900" };
    }
    if (text.includes("fee") || text.includes("upfront") || text.includes("deposit") || text.includes("pay")) {
      return { tag: "ADVANCE FEE DEMAND", color: "bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900" };
    }
    if (text.includes("ssn") || text.includes("id") || text.includes("passport")) {
      return { tag: "IDENTITY HARVESTING", color: "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900" };
    }
    return { tag: "FORENSIC ANOMALY", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" };
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(redFlags.map((f, i) => `${i + 1}. ${f}`).join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isSafe ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"}`}>
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isSafe ? "Security Verification Findings" : `Detected Red Flags (${redFlags.length})`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorized attack vectors and deceptive linguistic triggers
            </p>
          </div>
        </div>

        {!isSafe && redFlags.length > 0 && (
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied List</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Flags</span>
              </>
            )}
          </button>
        )}
      </div>

      {isSafe ? (
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-emerald-900 dark:text-emerald-100">Clean Communication Record</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
              No check overpayment patterns, upfront equipment fee extraction, unverified wire mandates, or spoofed sender addresses were identified.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {redFlags.map((flag, idx) => {
            const category = getFlagCategory(flag);
            return (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs border border-rose-200 dark:border-rose-900/60">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${category.color}`}>
                      {category.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {flag}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
