import React from "react";
import { PRESET_SAMPLES } from "../data/samples.js";
import type { PresetSample } from "../types.js";
import { Briefcase, Home, Mail, ShieldCheck, Sparkles, ChevronRight, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface PresetSelectorProps {
  onSelectSample: (sample: PresetSample) => void;
  activeId?: string;
  disabled?: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectSample,
  activeId,
  disabled,
}) => {
  const getCategoryMeta = (category: PresetSample["category"]) => {
    switch (category) {
      case "job":
        return {
          icon: <Briefcase className="w-3.5 h-3.5" />,
          scorePill: "Threat 95%",
          pillColor: "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900",
        };
      case "rental":
        return {
          icon: <Home className="w-3.5 h-3.5" />,
          scorePill: "Threat 92%",
          pillColor: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900",
        };
      case "email":
        return {
          icon: <Mail className="w-3.5 h-3.5" />,
          scorePill: "Threat 90%",
          pillColor: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-900",
        };
      case "safe":
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          scorePill: "Safe 0%",
          pillColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
        };
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Interactive Test Scenarios
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click any realistic real-world case to populate text, run analysis, and verify the raw JSON schema
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          5 Curated Cases
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {PRESET_SAMPLES.map((sample) => {
          const isSelected = activeId === sample.id;
          const isSafe = sample.category === "safe";
          const meta = getCategoryMeta(sample.category);

          return (
            <motion.button
              key={sample.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={disabled}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? isSafe
                    ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-400/40 dark:ring-emerald-500/30 shadow-sm"
                    : "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500 ring-2 ring-rose-400/40 dark:ring-rose-500/30 shadow-sm"
                  : "bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.pillColor}`}
                  >
                    {meta.icon}
                    <span>{sample.badge}</span>
                  </span>

                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isSafe
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {meta.scorePill}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 leading-snug">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal line-clamp-2">
                  {sample.subtitle}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] font-semibold">
                <span
                  className={
                    isSelected
                      ? isSafe
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-rose-700 dark:text-rose-300"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {isSelected ? "Active Scenario" : "Click to Load"}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? "translate-x-0.5" : "text-slate-400"
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
