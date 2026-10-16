import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { CalculatedTask, PlannerSettings, formatDuration } from "@/types/studyPlanner";

interface CapacityUtilizationProps {
  tasks: CalculatedTask[];
  settings: PlannerSettings;
}

const CapacityUtilization = ({ tasks, settings }: CapacityUtilizationProps) => {
  const totalHours = tasks.reduce((s, t) => s + t.studyHours, 0);
  const dailyLoad =
    settings.studyDaysPerWeek > 0 ? totalHours / settings.studyDaysPerWeek : 0;
  const capacity = settings.dailyAvailableHours || 1;
  const utilization = Math.min((dailyLoad / capacity) * 100, 200);
  const overloaded = dailyLoad > capacity;
  const pct = Math.min(utilization, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card-premium p-5 ${overloaded ? "ring-1 ring-destructive/40" : ""}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" strokeWidth={2} />
            Capacity Utilization
          </span>
          <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums tracking-tight">
            {Math.round(utilization)}%
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {formatDuration(dailyLoad)} / {capacity}h daily
            </span>
          </p>
        </div>
        {overloaded && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-[11px] font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            Bottleneck
          </div>
        )}
      </div>

      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${
            overloaded
              ? "bg-destructive"
              : utilization > 80
              ? "bg-foreground"
              : "bg-foreground/70"
          }`}
        />
        {/* threshold marker at 100% if scale extends beyond */}
        {utilization > 100 && (
          <div className="absolute top-0 bottom-0 w-px bg-background/50" style={{ left: "50%" }} />
        )}
      </div>

      {overloaded && (
        <p className="mt-2.5 text-xs text-destructive">
          Workload exceeds daily availability. Reduce tasks or extend study days.
        </p>
      )}
    </motion.div>
  );
};

export default CapacityUtilization;
