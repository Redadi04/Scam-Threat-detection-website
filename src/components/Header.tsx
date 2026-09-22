import React from "react";
import { ShieldAlert, Terminal, Cpu, Radio, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.js";

interface HeaderProps {
  apiStatus: "ready" | "analyzing" | "error";
  hasKey?: boolean;
  theme: "light" | "dark";
  onSelectTheme: (theme: "light" | "dark") => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  hasKey,
  theme,
  onSelectTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 flex items-center justify-center text-white shadow-md ring-4 ring-rose-500/10 dark:ring-rose-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Scam Threat Analyzer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  Active Fraud Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                Detects check deposit traps, pay-to-work schemes, rental scams & domain spoofing
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 shadow-2xs">
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-mono text-[11px] font-semibold">Strict JSON Schema</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-800/80 text-xs text-emerald-700 dark:text-emerald-300 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-[11px]">
                {hasKey ? "Gemini 3.8 Flash" : "Forensic Engine"}
              </span>
            </div>

            <div className="flex items-center gap-1 pl-1">
              <ThemeToggle theme={theme} onSelectTheme={onSelectTheme} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
