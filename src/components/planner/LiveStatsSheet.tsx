import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Activity } from "lucide-react";
import {
  CalculatedTask,
  PlannerSettings,
  formatDuration,
  getSubjectColor,
} from "@/types/studyPlanner";

interface LiveStatsSheetProps {
  tasks: CalculatedTask[];
  settings: PlannerSettings;
}

const LiveStatsSheet = ({ tasks, settings }: LiveStatsSheetProps) => {
  const [open, setOpen] = useState(false);

  const totalHours = tasks.reduce((s, t) => s + t.studyHours, 0);
  const sorted = [...tasks].sort((a, b) => b.finalWeight - a.finalWeight);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pointer-events-none">
      <motion.div
        layout
        className="pointer-events-auto bg-background border border-border rounded-xl shadow-elevated overflow-hidden"
      >
        {/* Handle / trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-30" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
            </span>
            <Activity className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-medium">
              Live
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatDuration(totalHours)}
            </span>
            <span className="text-xs text-muted-foreground">
              · {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border"
            >
              <div className="p-4 max-h-[50vh] overflow-y-auto">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Add tasks to see live calculations.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {sorted.map((task, i) => {
                      const pct =
                        totalHours > 0 ? (task.studyHours / totalHours) * 100 : 0;
                      const idx = tasks.findIndex((t) => t.id === task.id);
                      return (
                        <li key={task.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getSubjectColor(idx) }}
                              />
                              <span className="text-foreground truncate font-medium">
                                {task.subject}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs ml-3 flex-shrink-0">
                              {formatDuration(task.studyHours)}
                            </span>
                          </div>
                          <div className="h-[3px] bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.3 }}
                              className="h-full bg-foreground"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                  <span>Weekly budget</span>
                  <span className="font-medium text-foreground">
                    {settings.totalWeeklyHours} hrs
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LiveStatsSheet;
