"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CharacterAriusProps {
  response: string | null;
  isThinking: boolean;
}

const IDLE_TEXT =
  "I, Arius of Alexandria, stand before this council. The Father alone is unbegotten and truly eternal. The Son was begotten — the greatest of all things God has made, but made nonetheless. There was a time when He was not.";

export default function CharacterArius({ response, isThinking }: CharacterAriusProps) {
  const displayText = response ?? IDLE_TEXT;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      {/* Character header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={isThinking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ repeat: isThinking ? Infinity : 0, duration: 1.2 }}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[var(--color-border)] bg-[var(--color-panel)] text-lg font-bold text-[var(--color-muted)]"
          aria-hidden
        >
          Ar
        </motion.div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            AI Opponent
          </p>
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Arius of Alexandria
          </p>
        </div>
        {isThinking && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="ml-auto text-xs text-[var(--color-muted)]"
          >
            Preparing reply…
          </motion.span>
        )}
      </div>

      {/* Response bubble */}
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={displayText}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="border-l-2 border-[var(--color-border)] pl-4 text-sm leading-7 italic text-[var(--color-muted)]"
        >
          {isThinking ? (
            <span className="opacity-40">…</span>
          ) : (
            displayText
          )}
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
}
