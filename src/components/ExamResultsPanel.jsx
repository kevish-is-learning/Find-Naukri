"use client";

import { Loader2, GraduationCap, Info, Zap, CalendarClock } from "lucide-react";
import ExamCard from "./ExamCard";
import GroundingLinks from "./GroundingLinks";

export default function ExamResultsPanel({
  t,
  lang,
  userName,
  loading,
  currentExams,
  upcomingExams,
  groundingLinks,
}) {
  const totalExams = currentExams.length + upcomingExams.length;
  const hasResults = totalExams > 0;

  return (
    <section className="lg:col-span-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 backdrop-blur-md min-h-[300px] sm:min-h-[400px] flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] bg-violet-600/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div>
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
              <div className="absolute inset-0 h-10 w-10 rounded-full bg-violet-400/20 blur-md animate-pulse-glow" />
            </div>
            <h3 className="font-extrabold text-white font-display text-base sm:text-lg mt-5 tracking-tight">
              {lang === "en"
                ? `Finding Exams for ${userName}...`
                : `${userName} के लिए परीक्षाएं ढूंढ रहा है...`}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mt-3 leading-relaxed">
              {t.examLoadingDesc}
            </p>
          </div>
        ) : hasResults ? (
          /* Results */
          <div className="space-y-6 sm:space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <h3 className="font-extrabold text-base sm:text-lg text-white font-display tracking-tight flex items-center gap-2">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                {t.examResultsTitle} ({totalExams})
              </h3>
              <span className="text-[9px] sm:text-[10px] bg-violet-500/10 text-violet-400 font-bold uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full border border-violet-500/20">
                {lang === "en" ? "AI MATCHED" : "AI मिलान"}
              </span>
            </div>

            {/* Current Exams Section */}
            {currentExams.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-display tracking-tight">
                    {t.examCurrentTitle} ({currentExams.length})
                  </h4>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  {currentExams.map((exam, index) => (
                    <ExamCard
                      key={`current-${index}`}
                      exam={exam}
                      index={index}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Exams Section */}
            {upcomingExams.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                    <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-display tracking-tight">
                    {t.examUpcomingTitle} ({upcomingExams.length})
                  </h4>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  {upcomingExams.map((exam, index) => (
                    <ExamCard
                      key={`upcoming-${index}`}
                      exam={exam}
                      index={index + currentExams.length}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grounding Links */}
            <GroundingLinks links={groundingLinks} t={t} />
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-14 sm:py-20 px-4">
            <div className="h-10 w-10 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 mb-4 sm:mb-5">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-white font-display text-base sm:text-lg tracking-tight">
              {t.examEmptyTitle}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-2 max-w-sm leading-relaxed font-sans">
              <span className="hidden sm:inline">{t.examNoInputText}</span>
              <span className="sm:hidden">{t.examNoInputTextMobile}</span>
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
