"use client";

import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AlertToast({ alert }) {
  return (
    <AnimatePresence>
      {alert.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 sm:top-6 left-1/2 z-50 py-3 sm:py-3.5 px-4 sm:px-6 border border-indigo-500/30 bg-[#0b1329]/95 backdrop-blur shadow-2xl rounded-2xl w-[92%] max-w-md flex flex-row items-start gap-3 sm:gap-4"
        >
          <div className="p-2 shrink-0 bg-indigo-500/15 text-indigo-400 rounded-xl border border-indigo-500/30">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-slate-100">
              {alert.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
              {alert.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
