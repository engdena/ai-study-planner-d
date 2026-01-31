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

const TaskList = ({ tasks, onRemoveTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <div className="text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tasks added yet</p>
          <p className="text-xs mt-1">Add your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Your Tasks ({tasks.length})
      </h3>
      
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="card-elevated p-4 flex items-center gap-4"
          >
            {/* Color indicator */}
            <div
              className="w-3 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: getSubjectColor(index) }}
            />

            {/* Task details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {task.subject}
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                <span>Difficulty: {task.difficulty}/5</span>
                <span>Priority: {task.priority}/5</span>
                <span className={task.daysLeft <= 3 ? "text-destructive font-medium" : ""}>
                  {task.daysLeft <= 0 ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Overdue
                    </span>
                  ) : (
                    `${task.daysLeft} days left`
                  )}
                </span>
              </div>
            </div>

            {/* Study time */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-primary">
                {formatDuration(task.studyHours)}
              </p>
              <p className="text-xs text-muted-foreground">per week</p>
            </div>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveTask(task.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
