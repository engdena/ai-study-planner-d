import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, Download, ExternalLink } from "lucide-react";
import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import TaskInputForm from "./TaskInputForm";
import TaskList from "./TaskList";
import WeeklyCalendar from "./WeeklyCalendar";
import DailyPlanner from "./DailyPlanner";
import PlannerSettings from "./PlannerSettings";

const InteractivePlanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [view, setView] = useState<"weekly" | "daily">("weekly");

  const {
    calculatedTasks,
    settings,
    weeklySchedule,
    subjectProgress,
    addTask,
    removeTask,
    updateSettings,
    getBlocksForDate,
    addBlock,
    updateBlock,
    deleteBlock,
  } = useStudyPlanner();

  const sheetCopyUrl = "https://docs.google.com/spreadsheets/d/1D2WSKU5QDCAKI99QoirYpZFrxl-ikRhwX1cUhXZahyk/copy";

  return (
    <section id="planner" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container-wide section-padding" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Interactive Planner
            </span>
          </span>
          <h2 className="section-title mb-4">
            Plan Your Study Week
          </h2>
          <p className="section-subtitle mx-auto">
            Add your tasks, set priorities, and let the AI algorithm create 
            an optimized study schedule for you in real-time.
          </p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-12 gap-6"
        >
          {/* Left Column - Input & Settings */}
          <div className="lg:col-span-4 space-y-6">
            <TaskInputForm onAddTask={addTask} />
            <PlannerSettings
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          </div>

          {/* Right Column - Tasks & Calendar */}
          <div className="lg:col-span-8 space-y-6">
            <div role="tablist" className="inline-flex p-1 rounded-xl border border-border bg-card">
              {(["weekly", "daily"] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v === "weekly" ? "Weekly Overview" : "Daily View"}
                </button>
              ))}
            </div>
            {view === "weekly" ? (
              <WeeklyCalendar schedule={weeklySchedule} progress={subjectProgress} />
            ) : (
              <DailyPlanner
                getBlocksForDate={getBlocksForDate}
                addBlock={addBlock}
                updateBlock={updateBlock}
                deleteBlock={deleteBlock}
                subjects={calculatedTasks.map((t) => t.subject)}
              />
            )}
            <TaskList tasks={calculatedTasks} onRemoveTask={removeTask} />
          </div>
        </motion.div>

        {/* Expert Mode / Template Download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want more control? Download your own copy of the spreadsheet template.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={sheetCopyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Expert Mode: Get Template
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clicking this creates your own private copy in Google Sheets.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractivePlanner;
