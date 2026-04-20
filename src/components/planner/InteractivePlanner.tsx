import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Download,
  ExternalLink,
  Plus,
  ArrowUp,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import TaskInputForm from "./TaskInputForm";
import TaskList from "./TaskList";
import WeeklyCalendar from "./WeeklyCalendar";
import PlannerSettings from "./PlannerSettings";
import DashboardSummary from "./DashboardSummary";
import LiveStatsSheet from "./LiveStatsSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InteractivePlanner = () => {
  const ref = useRef(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const {
    calculatedTasks,
    settings,
    weeklySchedule,
    addTask,
    removeTask,
    updateSettings,
  } = useStudyPlanner();

  const sheetCopyUrl =
    "https://docs.google.com/spreadsheets/d/1D2WSKU5QDCAKI99QoirYpZFrxl-ikRhwX1cUhXZahyk/copy";

  useEffect(() => {
    const handler = () => setQuickAddOpen(true);
    window.addEventListener("planner:open-tasks", handler);
    return () => window.removeEventListener("planner:open-tasks", handler);
  }, []);

  // Show FAB once user has scrolled past results
  useEffect(() => {
    const onScroll = () => {
      if (!resultsRef.current) return;
      const rect = resultsRef.current.getBoundingClientRect();
      setShowFab(rect.bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const topPriority = [...calculatedTasks]
    .sort((a, b) => b.finalWeight - a.finalWeight)
    .slice(0, 3);

  return (
    <section
      id="planner"
      className="py-16 lg:py-24 bg-secondary/40 border-b border-border"
    >
      <div className="container-wide section-padding" ref={ref}>
        {/* Header row */}
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
              Executive Dashboard
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Your Study Plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Real-time calculations. Every change updates your plan instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFocusMode((f) => !f)}
              className="btn-outline"
              aria-pressed={focusMode}
            >
              {focusMode ? (
                <Eye className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <EyeOff className="w-4 h-4" strokeWidth={1.5} />
              )}
              {focusMode ? "Exit Focus" : "Focus Mode"}
            </button>
            <button
              onClick={() => setQuickAddOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Quick Add
            </button>
          </div>
        </motion.div>

        {/* KPI HEADER ROW */}
        <DashboardSummary tasks={calculatedTasks} settings={settings} />

        {/* FOCUS MODE — only top tasks */}
        {focusMode ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-card rounded-xl p-8 shadow-[0_2px_8px_-2px_hsl(0_0%_0%_/_0.06)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                  Focus Mode
                </span>
                <h3 className="mt-1 text-xl font-semibold text-foreground tracking-tight">
                  Top {topPriority.length} Priority Targets
                </h3>
              </div>
            </div>
            {topPriority.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Add tasks to enter focus mode.
              </p>
            ) : (
              <ul className="space-y-3">
                {topPriority.map((task, i) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-background"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-2xl font-semibold text-muted-foreground tabular-nums w-6">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {task.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {task.daysLeft <= 0
                            ? "Overdue"
                            : `${task.daysLeft} days remaining`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {Math.round(task.studyHours * 60)} min
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        / week
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <>
            {/* Calendar */}
            <div className="mt-6">
              <WeeklyCalendar schedule={weeklySchedule} />
            </div>

            {/* Inputs below */}
            <div className="mt-10 pt-10 border-t border-border">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                  Inputs
                </span>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  Task Manager
                </h3>
              </div>
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                  <TaskInputForm onAddTask={addTask} />
                  <PlannerSettings
                    settings={settings}
                    onUpdateSettings={updateSettings}
                  />
                </div>
                <div className="lg:col-span-8">
                  <TaskList tasks={calculatedTasks} onRemoveTask={removeTask} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Expert Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground">
                Need full control?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download the spreadsheet template — your private copy in Google Sheets.
              </p>
            </div>
            <a
              href={sheetCopyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Expert Mode: Get Template
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Quick Add Modal */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-base font-semibold tracking-tight">
              Quick Add Task
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 pt-2">
            <TaskInputForm
              onAddTask={(t) => {
                addTask(t);
                setQuickAddOpen(false);
              }}
              embedded
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating live stats */}
      <LiveStatsSheet tasks={calculatedTasks} settings={settings} />

      {/* Jump-to-results FAB */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToResults}
            className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-foreground text-background shadow-[0_8px_24px_-4px_hsl(0_0%_0%_/_0.3)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
            aria-label="Jump to results"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default InteractivePlanner;
