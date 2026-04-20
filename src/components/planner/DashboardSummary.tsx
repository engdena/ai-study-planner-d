import { motion } from "framer-motion";
import { Clock, Target, Gauge } from "lucide-react";
import {
  CalculatedTask,
  PlannerSettings,
  formatDuration,
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
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="relative bg-card rounded-xl p-6 shadow-[0_2px_8px_-2px_hsl(0_0%_0%_/_0.06),_0_8px_24px_-12px_hsl(0_0%_0%_/_0.08)] hover:shadow-[0_4px_16px_-4px_hsl(0_0%_0%_/_0.1),_0_12px_32px_-12px_hsl(0_0%_0%_/_0.12)] transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {label}
      </span>
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
      </div>
    </div>
    <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">
      {value}
    </p>
    {hint && (
      <p className="text-xs text-muted-foreground mt-1.5 tracking-wide">
        {hint}
      </p>
    )}
  </motion.div>
);

const DashboardSummary = ({ tasks, settings }: DashboardSummaryProps) => {
  const totalHours = tasks.reduce((s, t) => s + t.studyHours, 0);
  const highPriority = [...tasks].sort((a, b) => b.finalWeight - a.finalWeight)[0];
  const dailyCapacity = settings.studyDaysPerWeek > 0
    ? totalHours / settings.studyDaysPerWeek
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard
        icon={Clock}
        label="Total Study Hours"
        value={formatDuration(totalHours)}
        hint={`Allocated across ${settings.studyDaysPerWeek} days`}
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
        label="Daily Workload Capacity"
        value={formatDuration(dailyCapacity)}
        hint={`${settings.totalWeeklyHours}h weekly budget`}
        delay={0.1}
      />
    </div>
  );
};

export default DashboardSummary;
