"use client";

import { Languages, User } from "lucide-react";

export default function Header({ t, lang, userName, onToggleLanguage }) {
  return (
    <header className="sticky top-0 z-40 bg-[#020617]/70 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg shadow-lg shadow-indigo-500/25 flex items-center justify-center font-bold text-slate-950 font-display text-xs sm:text-sm">
            SG
          </div>
          <div>
            <div className="flex items-baseline ml-0.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                {t.title}
              </span>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-display ml-0.5">
                {t.titleSpan}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold tracking-widest uppercase font-mono block leading-none mt-0.5 opacity-80">
              {t.domain}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {userName && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <User className="h-3.5 w-3.5 text-indigo-400" />
              {t.greeting}
              <span className="text-cyan-400 font-bold">{userName}</span>
            </span>
          )}

          <button
            onClick={onToggleLanguage}
            className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 shrink-0 transition-all duration-200 p-2 sm:p-2.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 active:scale-95"
          >
            <Languages className="h-4 w-4 text-cyan-400" />
            <span className="hidden xs:inline sm:inline">
              {lang === "en" ? "हिन्दी" : "English"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
