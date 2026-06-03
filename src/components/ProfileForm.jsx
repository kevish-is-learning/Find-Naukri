"use client";

import { MapPin, Wallet, BookOpen, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ProfileForm({ t, profile, setProfile, loading, onSearch }) {
  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="lg:col-span-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-lg">
      {/* Ambient glow */}
      <div className="absolute top-[-25%] right-[-25%] w-[60%] h-[60%] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 leading-normal">
          🔍 GROUNDED AI RESEARCH
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display mb-2">
          {t.subtitle}
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans mt-2">
          {t.tagline}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-5">
        {/* State */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            {t.stateLabel}
          </label>
          <select
            value={profile.state}
            onChange={(e) => updateProfile("state", e.target.value)}
            className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none"
          >
            <option value="">{t.statePlaceholder}</option>
            {Object.entries(t.stateOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Category + Income Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
              {t.categoryLabel}
            </label>
            <select
              value={profile.category}
              onChange={(e) => updateProfile("category", e.target.value)}
              className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none"
            >
              {Object.entries(t.categoryOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
              <Wallet className="h-3.5 w-3.5 text-indigo-400" />
              {t.incomeLabel}
            </label>
            <select
              value={profile.income}
              onChange={(e) => updateProfile("income", e.target.value)}
              className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none"
            >
              {Object.entries(t.incomeOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profession */}
        <div>
          <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
            {t.professionLabel}
          </label>
          <select
            value={profile.profession}
            onChange={(e) => updateProfile("profession", e.target.value)}
            className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none"
          >
            {Object.entries(t.professionOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Student Fields */}
        <AnimatePresence>
          {profile.profession === "Student" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                    {t.currentClassLabel}
                  </label>
                  <input
                    type="text"
                    value={profile.currentClass || ""}
                    onChange={(e) => updateProfile("currentClass", e.target.value)}
                    placeholder="e.g. 12th, B.Sc, ITI"
                    className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    {t.percentageLabel}
                  </label>
                  <input
                    type="number"
                    value={profile.percentage || ""}
                    onChange={(e) => updateProfile("percentage", e.target.value)}
                    placeholder="e.g. 82"
                    min="0"
                    max="100"
                    className="w-full bg-[#05091a] border border-white/10 text-slate-200 text-sm focus:border-cyan-500/50 hover:border-white/15 transition-all duration-200 p-3 sm:p-3.5 rounded-xl outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={loading}
          className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white hover:opacity-95 active:scale-[0.98] transition-all duration-200 font-bold p-3.5 sm:p-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.btnSearching}</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>{t.btnSearch}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
