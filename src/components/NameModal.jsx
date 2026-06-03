"use client";

import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NameModal({ show, t, nameInput, setNameInput, onSave }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl relative"
          >
            {/* Ambient glow */}
            <div className="absolute top-[-20%] left-[40%] w-[35%] h-[35%] bg-indigo-600/30 blur-[60px] rounded-full -z-10" />

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-center tracking-tight text-white font-display">
              {t.enterNameTitle}
            </h2>
            <p className="text-sm text-slate-400 text-center mt-2 leading-relaxed">
              {t.enterNameDesc}
            </p>

            {/* Input */}
            <div className="mt-6">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSave()}
                placeholder={t.namePlaceholder}
                autoFocus
                className="w-full bg-[#090d22]/80 border border-white/10 focus:border-cyan-500/50 focus:bg-[#090d22] transition-all duration-200 shadow-inner font-sans rounded-xl p-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* CTA */}
            <button
              onClick={onSave}
              className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:opacity-95 active:scale-[0.98] transition-all duration-200 font-bold p-4 rounded-xl text-sm font-sans flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
            >
              {t.letsStart}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
