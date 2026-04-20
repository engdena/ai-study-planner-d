import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CalculatedTask,
  formatDuration,
} from "@/types/studyPlanner";

interface TaskListProps {
  tasks: CalculatedTask[];
  onRemoveTask: (id: string) => void;
}

const PriorityBadge = ({ priority }: { priority: number }) => {
  // Monochrome: 5=Critical (black), 4=High (dark), 3=Standard (outlined), 2-1=Low (muted)
  const config =
    priority >= 5
      ? { label: "Critical", cls: "bg-foreground text-background border-foreground" }
      : priority >= 4
      ? { label: "High", cls: "bg-foreground/85 text-background border-foreground/85" }
      : priority >= 3
      ? { label: "Standard", cls: "bg-background text-foreground border-foreground" }
      : { label: "Low", cls: "bg-muted text-muted-foreground border-border" };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-[0.1em] ${config.cls}`}
    >
      {config.label}
    </span>
  );
};

const MiniBar = ({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) => {
  const pct = Math.max(4, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground w-10 flex-shrink-0">
        {label}
      </span>
      <div className="h-[3px] flex-1 bg-muted rounded-full overflow-hidden min-w-[30px]">
        <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onRemoveTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <Clock
          className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40"
          strokeWidth={1.25}
        />
        <p className="text-sm text-foreground font-medium">No tasks yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Add your first subject to generate a study plan.
        </p>
      </div>
    );
  }

  // Sort by finalWeight desc for executive-style ranking
  const ordered = [...tasks].sort((a, b) => b.finalWeight - a.finalWeight);
  const maxWeight = Math.max(...ordered.map((t) => t.finalWeight), 1);

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30">
        <h3 className="text-[11px] font-semibold text-foreground tracking-[0.16em] uppercase">
          Task Roster
        </h3>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {tasks.length} {tasks.length === 1 ? "subject" : "subjects"}
        </span>
      </div>

      <ul className="divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {ordered.map((task) => {
            const completion = (task.finalWeight / maxWeight) * 100;
            return (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.18 }}
                className="group relative px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                {/* Thin progress bar at the bottom — completion/weight indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-muted">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Subject + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-medium text-foreground tracking-tight truncate text-sm">
                        {task.subject}
                      </h4>
                      <PriorityBadge priority={task.priority} />
                      <span
                        className={`text-[11px] tabular-nums ${
                          task.daysLeft <= 3
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {task.daysLeft <= 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Overdue
                          </span>
                        ) : (
                          `${task.daysLeft}d left`
                        )}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-1 max-w-md">
                      <MiniBar label="Diff" value={task.difficulty} max={5} />
                      <MiniBar label="Urg" value={Math.round(task.urgencyScore * 5)} max={5} />
                      <MiniBar
                        label="Wt"
                        value={Math.round(task.finalWeight)}
                        max={Math.round(maxWeight)}
                      />
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-foreground tabular-nums">
                      {formatDuration(task.studyHours)}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
                      per week
                    </p>
                  </div>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveTask(task.id)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${task.subject}`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default TaskList;
