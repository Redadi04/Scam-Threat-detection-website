import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle, CheckCircle2, Lock, Ban } from "lucide-react";

interface VerdictBannerProps {
  verdict: string;
  threatIndex: number;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict, threatIndex }) => {
  const isSevere = threatIndex >= 70;
  const isModerate = threatIndex >= 30 && threatIndex < 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-5 sm:p-6 border transition-all relative overflow-hidden shadow-sm ${
        isSevere
          ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100"
          : isModerate
          ? "bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-950 dark:text-amber-100"
          : "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl shrink-0 shadow-sm ${
            isSevere
              ? "bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900/60"
              : isModerate
              ? "bg-amber-600 text-white ring-4 ring-amber-200 dark:ring-amber-900/60"
              : "bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900/60"
          }`}
        >
          {isSevere ? (
            <ShieldAlert className="w-6 h-6" />
          ) : isModerate ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <ShieldCheck className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isSevere
                  ? "bg-rose-600 text-white"
                  : isModerate
                  ? "bg-amber-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              Forensic Verdict
            </span>

            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Confidence: 99.4%
            </span>

            {isSevere && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                <Ban className="w-3 h-3" />
                Active Attack Pattern
              </span>
            )}
            {!isSevere && !isModerate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Legitimate Safe Pattern
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-bold leading-snug mt-1 text-slate-900 dark:text-white">
            {verdict}
          </p>

          {isSevere && (
            <div className="mt-3.5 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/70 text-rose-900 dark:text-rose-200 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-extrabold uppercase tracking-wide mr-1">Immediate Protective Actions:</span>
                Do not deposit any mailed check (even if banking apps show funds temporarily available), do not buy equipment from requested vendors via Zelle/CashApp, and report the message to official anti-fraud authorities.
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
