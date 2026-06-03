"use client";

import { ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function GroundingLinks({ links, t }) {
  if (!links || links.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-cyan-950/10 border border-cyan-800/15"
    >
      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
        {t.verifySources}
      </span>
      <p className="text-[10px] sm:text-[11px] text-slate-400 italic mb-2">
        {t.verifyDesc}
      </p>
      <div className="flex flex-col gap-1.5 mt-2">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.uri}
            target="_blank"
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="text-xs text-cyan-400/80 hover:text-cyan-300 underline flex items-center gap-1 truncate transition-colors duration-200"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{link.title || link.uri}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
