import { motion } from "framer-motion";
import { Clock, Target, CalendarClock, Layers } from "lucide-react";
import {
  CalculatedTask,
  PlannerSettings,
  formatDuration,
} from "@/types/studyPlanner";

interface DashboardSummaryProps {
  tasks: CalculatedTask[];
  settings: PlannerSettings;
}

const Stat = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-elevated p-5"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
        {label}
      </span>
      <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
    </div>
    <p className="text-2xl font-semibold text-foreground tracking-tight">
      {value}
    </p>
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </motion.div>
);

const DashboardSummary = ({ tasks, settings }: DashboardSummaryProps) => {
  const totalHours = tasks.reduce((s, t) => s + t.studyHours, 0);

  // Highest finalWeight = next priority
  const nextTask = [...tasks].sort((a, b) => b.finalWeight - a.finalWeight)[0];

  // Closest deadline (not overdue first)
  const sorted = [...tasks].sort((a, b) => a.daysLeft - b.daysLeft);
  const upcoming = sorted.find((t) => t.daysLeft >= 0) ?? sorted[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Stat
        icon={Clock}
        label="Total Hours / Week"
        value={formatDuration(totalHours)}
        hint={`${settings.studyDaysPerWeek} study days`}
      />
      <Stat
        icon={Layers}
        label="Active Subjects"
        value={String(tasks.length)}
        hint={tasks.length === 0 ? "Add tasks to begin" : "Tracked this week"}
      />
      <Stat
        icon={Target}
        label="Next Priority"
        value={nextTask ? nextTask.subject : "—"}
        hint={nextTask ? `${formatDuration(nextTask.studyHours)} / week` : "No tasks yet"}
      />
      <Stat
        icon={CalendarClock}
        label="Closest Deadline"
        value={
          upcoming
            ? upcoming.daysLeft <= 0
              ? "Overdue"
              : `${upcoming.daysLeft}d`
            : "—"
        }
        hint={upcoming ? upcoming.subject : "No deadlines"}
      />
    </div>
  );
};

export default DashboardSummary;
