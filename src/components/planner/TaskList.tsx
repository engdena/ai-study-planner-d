import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CalculatedTask,
  formatDuration,
  getSubjectColor,
} from "@/types/studyPlanner";

interface TaskListProps {
  tasks: CalculatedTask[];
  onRemoveTask: (id: string) => void;
}

const ScoreBar = ({
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
      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground w-14 flex-shrink-0">
        {label}
      </span>
      <div className="h-[3px] flex-1 bg-muted rounded-full overflow-hidden min-w-[40px]">
        <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-foreground tabular-nums w-6 text-right">
        {value}
      </span>
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

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          Task Manager
        </h3>
        <span className="text-xs text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "subject" : "subjects"}
        </span>
      </div>

      <ul className="divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-1 h-12 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: getSubjectColor(index) }}
                />

                <div className="flex-1 min-w-0 grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-6 items-center">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h4 className="font-medium text-foreground tracking-tight truncate">
                        {task.subject}
                      </h4>
                      <span
                        className={`text-xs ${
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
                          `${task.daysLeft} days remaining`
                        )}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-x-6 gap-y-1.5 max-w-md">
                      <ScoreBar label="Diff" value={task.difficulty} max={5} />
                      <ScoreBar label="Prio" value={task.priority} max={5} />
                      <ScoreBar
                        label="Urg"
                        value={Math.round(task.urgencyScore * 5)}
                        max={5}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {formatDuration(task.studyHours)}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-0.5">
                        per week
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveTask(task.id)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default TaskList;
