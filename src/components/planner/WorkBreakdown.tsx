import { motion } from "framer-motion";
import { useMemo } from "react";
import { CalculatedTask, WORK_INTENSITY_LABELS, WorkIntensity } from "@/types/studyPlanner";

interface WorkBreakdownProps {
  tasks: CalculatedTask[];
}

// MECE work-type doughnut breakdown
const WorkBreakdown = ({ tasks }: WorkBreakdownProps) => {
  const breakdown = useMemo(() => {
    const totals: Record<WorkIntensity, number> = { deep: 0, admin: 0, review: 0 };
    tasks.forEach((t) => {
      totals[t.workIntensity] = (totals[t.workIntensity] || 0) + t.studyHours;
    });
    const total = totals.deep + totals.admin + totals.review;
    return { totals, total };
  }, [tasks]);

  const segments: { key: WorkIntensity; pct: number; shade: string }[] = [
    { key: "deep", pct: breakdown.total ? (breakdown.totals.deep / breakdown.total) * 100 : 0, shade: "hsl(var(--foreground))" },
    { key: "admin", pct: breakdown.total ? (breakdown.totals.admin / breakdown.total) * 100 : 0, shade: "hsl(var(--foreground) / 0.55)" },
    { key: "review", pct: breakdown.total ? (breakdown.totals.review / breakdown.total) * 100 : 0, shade: "hsl(var(--accent-data))" },
  ];

  // Build conic-gradient
  let cursor = 0;
  const gradientStops = segments
    .map((s) => {
      const start = cursor;
      const end = cursor + s.pct;
      cursor = end;
      return `${s.shade} ${start}% ${end}%`;
    })
    .join(", ");

  const conic =
    breakdown.total > 0
      ? `conic-gradient(${gradientStops})`
      : "conic-gradient(hsl(var(--muted)) 0% 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card-premium p-5"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        Work Breakdown
      </span>

      <div className="mt-4 flex items-center gap-5">
        {/* Doughnut */}
        <div
          className="relative w-24 h-24 rounded-full flex-shrink-0"
          style={{ background: conic }}
        >
          <div className="absolute inset-[10px] rounded-full bg-card flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              MECE
            </span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 space-y-2 min-w-0">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center gap-2.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: s.shade }}
              />
              <span className="text-foreground font-medium flex-1 truncate">
                {WORK_INTENSITY_LABELS[s.key]}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {Math.round(s.pct)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default WorkBreakdown;
