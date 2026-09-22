import React from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onSelectTheme: (theme: "light" | "dark") => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onSelectTheme }) => {
  return (
    <div
      role="group"
      aria-label="Color scheme options"
      className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 shadow-2xs"
    >
      <button
        type="button"
        onClick={() => onSelectTheme("light")}
        aria-pressed={theme === "light"}
        title="Switch to Light Mode"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
          theme === "light"
            ? "bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200/80"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${theme === "light" ? "text-amber-500" : "text-slate-400"}`} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTheme("dark")}
        aria-pressed={theme === "dark"}
        title="Switch to Dark Mode"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-slate-900 dark:bg-slate-950 text-white shadow-xs font-semibold ring-1 ring-slate-700"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${theme === "dark" ? "text-indigo-400" : "text-slate-400"}`} />
        <span>Dark</span>
      </button>
    </div>
  );
};

