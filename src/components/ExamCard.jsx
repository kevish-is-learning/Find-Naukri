"use client";

import { Calendar, Clock, Building2, ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function ExamCard({ exam, index, t }) {
  const isCurrent = exam.status === "current";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="group bg-[#04081c]/60 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-xs rounded-xl sm:rounded-2xl p-4 sm:p-5"
    >
      {/* Top Row: Badge + Status */}
      <div className="flex flex-wrap items-center gap-2 mb-2.5 sm:mb-3">
        <span className="text-[10px] bg-indigo-500/10 font-bold text-indigo-400 border border-indigo-500/20 rounded-lg px-2.5 py-1 uppercase tracking-wider">
          {exam.badge || "Exam"}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 border ${
            isCurrent
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isCurrent ? (t.examStatusCurrent || "LIVE NOW") : (t.examStatusUpcoming || "UPCOMING")}
        </span>
      </div>

      {/* Name */}
      <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug group-hover:text-cyan-300 transition-colors duration-200 font-display">
        {exam.name}
      </h4>

      {/* Conducting Body */}
      <div className="flex items-center gap-1.5 mt-2 text-[11px] sm:text-xs text-slate-400">
        <Building2 className="h-3.5 w-3.5 text-slate-500" />
        <span>{exam.conductingBody}</span>
      </div>

      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 text-xs text-slate-400">
        {/* Date Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-start gap-2 bg-[#05081b] p-2.5 sm:p-3 rounded-xl border border-white/5">
            <Calendar className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-0.5">
                {t.examDate || "Exam Date"}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">{exam.examDate}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-[#05081b] p-2.5 sm:p-3 rounded-xl border border-white/5">
            <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-0.5">
                {t.examRegDeadline || "Registration Deadline"}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">{exam.registrationDeadline}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <span className="font-semibold text-slate-200 block mb-1.5 uppercase tracking-wider text-[10px]">
            {t.examDescription || "About This Exam"}
          </span>
          <p className="leading-relaxed bg-[#05081b] p-3 sm:p-3.5 rounded-xl border border-white/5 text-slate-300 text-[11px] sm:text-xs">
            {exam.description}
          </p>
        </div>

        {/* Eligibility */}
        {exam.eligibility && exam.eligibility.length > 0 && (
          <div>
            <span className="font-semibold text-slate-200 block mb-1.5 uppercase tracking-wider text-[10px]">
              {t.eligibilityTitle}
            </span>
            <ul className="space-y-1.5">
              {exam.eligibility.map((item, idx) => (
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
      </div>

      {/* Apply Button */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-white/5 flex justify-end">
        <a
          href={
            exam.applyUrl && exam.applyUrl.startsWith("http")
              ? exam.applyUrl
              : "https://exams.gov.in"
          }
          target="_blank"
          rel="noreferrer"
          referrerPolicy="no-referrer"
          className="bg-[#05081b] hover:bg-slate-900 text-cyan-400 border border-white/10 group-hover:border-cyan-500/20 transition-all duration-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>{t.examApplyNow || "Apply / Register"}</span>
          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </a>
      </div>
    </motion.div>
  );
}
