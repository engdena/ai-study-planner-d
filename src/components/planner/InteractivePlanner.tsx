import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Download, ExternalLink, LayoutDashboard, ListChecks } from "lucide-react";
import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import TaskInputForm from "./TaskInputForm";
import TaskList from "./TaskList";
import WeeklyCalendar from "./WeeklyCalendar";
import PlannerSettings from "./PlannerSettings";
import DashboardSummary from "./DashboardSummary";
import LiveStatsSheet from "./LiveStatsSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InteractivePlanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [tab, setTab] = useState("dashboard");

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

  return (
    <section id="planner" className="py-20 lg:py-28 bg-secondary/40 border-y border-border">
      <div className="container-wide section-padding" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-10"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Interactive Planner
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Your Study Plan
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A real-time dashboard. Edit your tasks, adjust your weekly budget,
            and let the engine balance the load.
          </p>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="bg-background border border-border h-11 p-1 rounded-md">
            <TabsTrigger
              value="dashboard"
              className="gap-2 px-4 data-[state=active]:bg-foreground data-[state=active]:text-background rounded-sm"
            >
              <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
              My Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="gap-2 px-4 data-[state=active]:bg-foreground data-[state=active]:text-background rounded-sm"
            >
              <ListChecks className="w-4 h-4" strokeWidth={1.5} />
              Task Manager
            </TabsTrigger>
          </TabsList>

          {/* DASHBOARD — value first */}
          <TabsContent value="dashboard" className="mt-6 space-y-6 focus-visible:outline-none">
            <DashboardSummary tasks={calculatedTasks} settings={settings} />
            <WeeklyCalendar schedule={weeklySchedule} />
          </TabsContent>

          {/* TASK MANAGER — inputs */}
          <TabsContent
            value="tasks"
            id="task-manager"
            className="mt-6 focus-visible:outline-none"
          >
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
          </TabsContent>
        </Tabs>

        {/* Expert Mode / Template Download */}
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

      {/* Floating live stats — visible on all tabs */}
      <LiveStatsSheet tasks={calculatedTasks} settings={settings} />
    </section>
  );
};

export default InteractivePlanner;
