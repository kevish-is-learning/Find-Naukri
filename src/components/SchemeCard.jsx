"use client";

import { FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function SchemeCard({ scheme, index, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="group bg-[#04081c]/60 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-xs rounded-xl sm:rounded-2xl p-4 sm:p-5"
    >
      {/* Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-3">
        <span className="text-[10px] bg-indigo-500/10 font-bold text-indigo-400 border border-indigo-500/20 rounded-lg px-2.5 py-1 uppercase tracking-wider">
          {scheme.badge || "Welfare"}
        </span>
      </div>

      {/* Name */}
      <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug group-hover:text-cyan-300 transition-colors duration-200 font-display">
        {scheme.name}
      </h4>

      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 text-xs text-slate-400">
        {/* Benefit */}
        <div>
          <span className="font-semibold text-slate-200 block mb-1.5 uppercase tracking-wider text-[10px]">
            {t.benefitTitle}
          </span>
          <p className="leading-relaxed bg-[#05081b] p-3 sm:p-3.5 rounded-xl border border-white/5 text-slate-300 text-[11px] sm:text-xs">
            {scheme.benefit}
          </p>
        </div>

        {/* Eligibility */}
        {scheme.eligibility && scheme.eligibility.length > 0 && (
          <div>
            <span className="font-semibold text-slate-200 block mb-1.5 uppercase tracking-wider text-[10px]">
              {t.eligibilityTitle}
            </span>
            <ul className="space-y-1.5">
              {scheme.eligibility.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents */}
        {scheme.documents && scheme.documents.length > 0 && (
          <div>
            <span className="font-semibold text-slate-200 block mb-1.5 uppercase tracking-wider text-[10px]">
              {t.requiredDocs}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {scheme.documents.map((doc, idx) => (
                <span
                  key={idx}
                  className="bg-[#05081b] text-slate-300 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/5 text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 font-medium"
                >
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-400" />
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-white/5 flex justify-end">
        <a
          href={
            scheme.applyUrl && scheme.applyUrl.startsWith("http")
              ? scheme.applyUrl
              : "https://myscheme.gov.in"
          }
          target="_blank"
          rel="noreferrer"
          referrerPolicy="no-referrer"
          className="bg-[#05081b] hover:bg-slate-900 text-cyan-400 border border-white/10 group-hover:border-cyan-500/20 transition-all duration-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>{t.applyNow}</span>
          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </a>
      </div>
    </motion.div>
  );
}
