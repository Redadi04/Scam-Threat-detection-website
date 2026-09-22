import React from "react";
import { motion } from "motion/react";
import {
  AlertOctagon,
  CreditCard,
  Globe,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface ScoreGaugesProps {
  scamThreatIndex: number;
  paymentRiskScore: number;
  domainRiskScore: number;
}

interface GaugeCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  description: string;
  subLabels: { label: string; active: boolean }[];
  isPrimary?: boolean;
}

const RadialGauge: React.FC<{ score: number; colorClass: string; strokeColor: string }> = ({
  score,
  strokeColor,
}) => {
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc angle: 240 degrees (like a car speedometer)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (Math.min(100, Math.max(0, score)) / 100) * arcLength;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full -rotate-135 transform" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="text-slate-200 dark:text-slate-800"
        />
        {/* Animated fill stroke */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono leading-none">
          {score}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
};

export const ScoreGauges: React.FC<ScoreGaugesProps> = ({
  scamThreatIndex,
  paymentRiskScore,
  domainRiskScore,
}) => {
  const getThreatMeta = (score: number) => {
    if (score >= 80) {
      return {
        label: "CRITICAL THREAT",
        colorText: "text-rose-600 dark:text-rose-400",
        badgeBg: "bg-rose-500 text-white",
        stroke: "#f43f5e",
        gradientBorder: "border-rose-300/80 dark:border-rose-900/80",
        bgGlow: "bg-rose-50/70 dark:bg-rose-950/30",
        barColor: "bg-rose-500",
      };
    }
    if (score >= 50) {
      return {
        label: "HIGH RISK",
        colorText: "text-amber-600 dark:text-amber-400",
        badgeBg: "bg-amber-500 text-white",
        stroke: "#f59e0b",
        gradientBorder: "border-amber-300/80 dark:border-amber-900/80",
        bgGlow: "bg-amber-50/70 dark:bg-amber-950/30",
        barColor: "bg-amber-500",
      };
    }
    if (score >= 25) {
      return {
        label: "ELEVATED CONCERN",
        colorText: "text-yellow-600 dark:text-yellow-400",
        badgeBg: "bg-yellow-500 text-slate-900",
        stroke: "#eab308",
        gradientBorder: "border-yellow-300/80 dark:border-yellow-900/80",
        bgGlow: "bg-yellow-50/70 dark:bg-yellow-950/30",
        barColor: "bg-yellow-500",
      };
    }
    return {
      label: "LOW RISK / SAFE",
      colorText: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-500 text-white",
      stroke: "#10b981",
      gradientBorder: "border-emerald-300/80 dark:border-emerald-900/80",
      bgGlow: "bg-emerald-50/70 dark:bg-emerald-950/30",
      barColor: "bg-emerald-500",
    };
  };

  const threatMeta = getThreatMeta(scamThreatIndex);
  const paymentMeta = getThreatMeta(paymentRiskScore);
  const domainMeta = getThreatMeta(domainRiskScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Scam Threat Index */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${threatMeta.gradientBorder} ${threatMeta.bgGlow} relative overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${threatMeta.badgeBg}`}>
              {scamThreatIndex >= 50 ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Scam Threat Index
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Composite Forensic Score
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${threatMeta.badgeBg}`}>
            {threatMeta.label}
          </span>
        </div>

        <div className="flex items-center justify-around my-2">
          <RadialGauge
            score={scamThreatIndex}
            colorClass={threatMeta.colorText}
            strokeColor={threatMeta.stroke}
          />
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Severity Level
            </span>
            <span className={`text-sm font-extrabold ${threatMeta.colorText}`}>
              {scamThreatIndex >= 80
                ? "Immediate Fraud Danger"
                : scamThreatIndex >= 50
                ? "Suspicious Patterns"
                : scamThreatIndex >= 25
                ? "Unusual Elements"
                : "Legitimate Baseline"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              JSON: scam_threat_index
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
          Probability of check overpayment traps, deposit fraud, or financial extraction.
        </div>
      </motion.div>

      {/* 2. Payment Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${paymentMeta.gradientBorder} ${paymentMeta.bgGlow} relative overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${paymentMeta.badgeBg}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Payment Risk Score
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Financial Transaction Threat
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${paymentMeta.badgeBg}`}>
            {paymentMeta.label}
          </span>
        </div>

        <div className="flex items-center justify-around my-2">
          <RadialGauge
            score={paymentRiskScore}
            colorClass={paymentMeta.colorText}
            strokeColor={paymentMeta.stroke}
          />
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Payment Trap Type
            </span>
            <span className={`text-sm font-extrabold ${paymentMeta.colorText}`}>
              {paymentRiskScore >= 70
                ? "Fake Check Float Trap"
                : paymentRiskScore >= 40
                ? "Upfront Fee / Wire"
                : "Standard Payroll/Lease"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              JSON: payment_risk_score
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
          Detects mobile deposit bouncing, vendor refund demands, and non-refundable fees.
        </div>
      </motion.div>

      {/* 3. Domain Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${domainMeta.gradientBorder} ${domainMeta.bgGlow} relative overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${domainMeta.badgeBg}`}>
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Domain Risk Score
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Identity & Channel Integrity
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${domainMeta.badgeBg}`}>
            {domainMeta.label}
          </span>
        </div>

        <div className="flex items-center justify-around my-2">
          <RadialGauge
            score={domainRiskScore}
            colorClass={domainMeta.colorText}
            strokeColor={domainMeta.stroke}
          />
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Channel Integrity
            </span>
            <span className={`text-sm font-extrabold ${domainMeta.colorText}`}>
              {domainRiskScore >= 70
                ? "Lookalike / Free Webmail"
                : domainRiskScore >= 35
                ? "Telegram / Unverified"
                : "Verified Corporate Domain"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              JSON: domain_risk_score
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
          Flags free webmail impersonation, Telegram interview redirects, and missing SPF/DKIM.
        </div>
      </motion.div>
    </div>
  );
};
