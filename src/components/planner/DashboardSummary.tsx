import { motion } from "framer-motion";
import { Clock, Target, Gauge, Timer } from "lucide-react";
import {
  CalculatedTask,
  PlannerSettings,
  formatDuration,
  projectCompletionTime,
} from "@/types/studyPlanner";

interface DashboardSummaryProps {
  tasks: CalculatedTask[];
  settings: PlannerSettings;
}

const KpiCard = ({
  icon: Icon,
  label,
  value,
  hint,
  delay = 0,
  accent = false,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint?: string;
  delay?: number;
  accent?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="card-premium p-6 hover:shadow-elevated transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {label}
      </span>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          accent ? "bg-data/10 text-data" : "bg-muted text-foreground"
        }`}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>
    </div>
    <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">
      {value}
    </p>
    {hint && (
      <p className="text-xs text-muted-foreground mt-1.5 tracking-wide">{hint}</p>
    )}
  </motion.div>
);

const DashboardSummary = ({ tasks, settings }: DashboardSummaryProps) => {
  const totalHours = tasks.reduce((s, t) => s + t.studyHours, 0);
  const dailyHours =
    settings.studyDaysPerWeek > 0 ? totalHours / settings.studyDaysPerWeek : 0;
  const highPriority = [...tasks].sort((a, b) => b.finalWeight - a.finalWeight)[0];
  const projectedFinish = projectCompletionTime(settings.startTime, dailyHours);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        icon={Clock}
        label="Total Study Hours"
        value={formatDuration(totalHours)}
        hint={`Across ${settings.studyDaysPerWeek} days`}
        delay={0}
      />
      <KpiCard
        icon={Target}
        label="High Priority Target"
        value={highPriority ? highPriority.subject : "—"}
        hint={
          highPriority
            ? `${formatDuration(highPriority.studyHours)} this week`
            : "Add a task to begin"
        }
        delay={0.05}
      />
      <KpiCard
        icon={Gauge}
        label="Daily Workload"
        value={formatDuration(dailyHours)}
        hint={`${settings.totalWeeklyHours}h weekly budget`}
        delay={0.1}
      />
      <KpiCard
        icon={Timer}
        label="Projected Completion"
        value={projectedFinish}
        hint={`If start ${settings.startTime}`}
        delay={0.15}
        accent
      />
    </div>
  );
};

export default DashboardSummary;
