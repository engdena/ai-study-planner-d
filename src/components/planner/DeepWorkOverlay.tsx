import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X, Coffee, Brain } from "lucide-react";
import { CalculatedTask, formatDuration } from "@/types/studyPlanner";

interface DeepWorkOverlayProps {
  open: boolean;
  onClose: () => void;
  task: CalculatedTask | null;
}

type Phase = "focus" | "break";
const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const DeepWorkOverlay = ({ open, onClose, task }: DeepWorkOverlayProps) => {
  const [phase, setPhase] = useState<Phase>("focus");
  const [seconds, setSeconds] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!open) {
      setRunning(false);
      setPhase("focus");
      setSeconds(FOCUS_SECONDS);
      setCycles(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        // phase complete
        if (phase === "focus") {
          setCycles((c) => c + 1);
          setPhase("break");
          return BREAK_SECONDS;
        }
        setPhase("focus");
        return FOCUS_SECONDS;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [open, running, phase]);

  const total = phase === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = ((total - seconds) / total) * 100;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setSeconds(phase === "focus" ? FOCUS_SECONDS : BREAK_SECONDS);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "#000000" }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, hsl(var(--accent-data) / 0.08) 0%, transparent 60%)",
            }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center"
            aria-label="Exit Deep Work"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Cycle counter */}
          <div className="absolute top-6 left-6 text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Cycle {cycles + (phase === "focus" ? 1 : 0)}
          </div>

          {/* Glassmorphism card */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl p-8 sm:p-10 text-center"
            style={{
              background: "hsl(240 5% 9% / 0.55)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              border: "1px solid hsl(0 0% 100% / 0.08)",
              boxShadow:
                "0 30px 80px -20px hsl(0 0% 0% / 0.8), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
            }}
          >
            {/* Phase chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] uppercase tracking-[0.2em] font-semibold">
              {phase === "focus" ? (
                <Brain className="w-3 h-3" strokeWidth={2} />
              ) : (
                <Coffee className="w-3 h-3" strokeWidth={2} />
              )}
              {phase === "focus" ? "Deep Focus" : "Break"}
            </div>

            {/* Top priority */}
            <div className="mt-5">
              {task ? (
                <>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/40 font-medium">
                    #1 Priority Target
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                    {task.subject}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/50">
                    {formatDuration(task.studyHours)} this week ·{" "}
                    {task.daysLeft <= 0 ? "Overdue" : `${task.daysLeft}d left`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-white/50">Add a task to begin</p>
              )}
            </div>

            {/* Timer */}
            <div className="mt-8">
              <div
                className="text-7xl sm:text-8xl font-light tabular-nums tracking-[-0.02em]"
                style={{
                  color: phase === "focus" ? "hsl(var(--accent-data-glow))" : "hsl(0 0% 92%)",
                  textShadow:
                    phase === "focus"
                      ? "0 0 40px hsl(var(--accent-data) / 0.45)"
                      : "0 0 30px hsl(0 0% 100% / 0.15)",
                }}
              >
                {mm}:{ss}
              </div>

              {/* Progress ring/bar */}
              <div className="mt-6 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{
                    background:
                      phase === "focus"
                        ? "hsl(var(--accent-data))"
                        : "hsl(0 0% 80%)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setRunning((r) => !r)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? "Pause" : "Start"}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/15 text-white/70 text-sm hover:border-white/40 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-white/30">
              25 min focus · 5 min break
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeepWorkOverlay;
