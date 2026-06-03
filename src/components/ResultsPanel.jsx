"use client";

import { Loader2, Sparkles, Info } from "lucide-react";
import SchemeCard from "./SchemeCard";
import GroundingLinks from "./GroundingLinks";

export default function ResultsPanel({
  t,
  lang,
  userName,
  loading,
  schemes,
  groundingLinks,
}) {
  return (
    <section className="lg:col-span-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 backdrop-blur-md min-h-[300px] sm:min-h-[400px] flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] bg-cyan-600/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div>
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 h-10 w-10 rounded-full bg-cyan-400/20 blur-md animate-pulse-glow" />
            </div>
            <h3 className="font-extrabold text-white font-display text-base sm:text-lg mt-5 tracking-tight">
              {lang === "en"
                ? `${t.loadingTitle} ${userName}...`
                : `${userName} ${t.loadingTitle}...`}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mt-3 leading-relaxed">
              {t.loadingDesc}
            </p>
          </div>
        ) : schemes.length > 0 ? (
          /* Results */
          <div className="space-y-5 sm:space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <h3 className="font-extrabold text-base sm:text-lg text-white font-display tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                {t.resultsTitle} ({schemes.length})
              </h3>
              <span className="text-[9px] sm:text-[10px] bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full border border-cyan-500/20">
                VERIFIED
              </span>
            </div>

            {/* Scheme Cards */}
            <div className="space-y-4 sm:space-y-5">
              {schemes.map((scheme, index) => (
                <SchemeCard
                  key={scheme.id || index}
                  scheme={scheme}
                  index={index}
                  t={t}
                />
              ))}
            </div>

            {/* Grounding Links */}
            <GroundingLinks links={groundingLinks} t={t} />
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-14 sm:py-20 px-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 sm:mb-5">
              <Info className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-white font-display text-base sm:text-lg tracking-tight">
              {t.emptyTitle}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-2 max-w-sm leading-relaxed font-sans">
              {/* Show mobile-specific text on small screens */}
              <span className="hidden sm:inline">{t.noInputText}</span>
              <span className="sm:hidden">{t.noInputTextMobile}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 pt-3 sm:pt-4 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        <span>Powered by Gemini & Search Grounding</span>
        <span>© 2026 SchemeGyan. All Rights reserved.</span>
      </div>
    </section>
  );
}
