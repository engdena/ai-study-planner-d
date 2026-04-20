import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  Download,
  ExternalLink,
  Plus,
  ArrowUp,
  Brain,
} from "lucide-react";
import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import TaskInputForm from "./TaskInputForm";
import TaskList from "./TaskList";
import WeeklyCalendar from "./WeeklyCalendar";
import PlannerSettings from "./PlannerSettings";
import DashboardSummary from "./DashboardSummary";
import LiveStatsSheet from "./LiveStatsSheet";
import CapacityUtilization from "./CapacityUtilization";
import WorkBreakdown from "./WorkBreakdown";
import DeepWorkOverlay from "./DeepWorkOverlay";
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
  const [deepWorkOpen, setDeepWorkOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const {
    calculatedTasks,
    settings,
    weeklySchedule,
    addTask,
    removeTask,
    toggleTaskCompleted,
    clearCompleted,
    resetPlan,
    updateSettings,
  } = useStudyPlanner();

  const sheetCopyUrl =
    "https://docs.google.com/spreadsheets/d/1D2WSKU5QDCAKI99QoirYpZFrxl-ikRhwX1cUhXZahyk/copy";

  useEffect(() => {
    const handler = () => setQuickAddOpen(true);
    window.addEventListener("planner:open-tasks", handler);
    return () => window.removeEventListener("planner:open-tasks", handler);
  }, []);

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

  const topTask = useMemo(
    () =>
      [...calculatedTasks]
        .filter((t) => !t.completed)
        .sort((a, b) => b.finalWeight - a.finalWeight)[0] || null,
    [calculatedTasks]
  );

  return (
    <section
      id="planner"
      className="py-16 lg:py-24 bg-secondary/40 border-b border-border"
    >
      <div className="container-wide section-padding" ref={ref}>
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
              Decision Support System
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Your Study Plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Real-time analytics. Every change updates your plan instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setDeepWorkOpen(true)}
              className="btn-outline"
              aria-label="Enter Deep Work mode"
            >
              <Brain className="w-4 h-4" strokeWidth={1.5} />
              Deep Work
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

        {/* Predictive analytics row */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CapacityUtilization tasks={calculatedTasks} settings={settings} />
          <WorkBreakdown tasks={calculatedTasks} />
        </div>

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
              <TaskList
                tasks={calculatedTasks}
                onRemoveTask={removeTask}
                onToggleCompleted={toggleTaskCompleted}
                onClearCompleted={clearCompleted}
                onResetPlan={resetPlan}
              />
            </div>
          </div>
        </div>

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

      {/* Live stats */}
      <LiveStatsSheet tasks={calculatedTasks} settings={settings} />

      {/* Deep Work overlay */}
      <DeepWorkOverlay
        open={deepWorkOpen}
        onClose={() => setDeepWorkOpen(false)}
        task={topTask}
      />

      {/* Jump-to-results FAB */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToResults}
            className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-foreground text-background shadow-elevated hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
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
