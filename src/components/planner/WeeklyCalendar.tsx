import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { DaySchedule, formatDurationFromMinutes } from "@/types/studyPlanner";

interface WeeklyCalendarProps {
  schedule: DaySchedule[];
}

const WeeklyCalendar = ({ schedule }: WeeklyCalendarProps) => {
  const maxMinutes = Math.max(...schedule.map((d) => d.totalMinutes), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          Weekly Schedule
        </h3>
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Load Balanced
        </span>
      </div>

      {schedule.length === 0 || schedule.every((d) => d.tasks.length === 0) ? (
        <div className="text-center py-12 text-muted-foreground">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Your schedule will appear here</p>
          <p className="text-xs mt-1">Add tasks to see your weekly plan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedule.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {day.day}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDurationFromMinutes(day.totalMinutes)}
                </span>
              </div>

              {/* Stacked bar chart */}
              <div className="h-10 rounded-lg overflow-hidden bg-muted flex">
                {day.tasks.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-xs text-muted-foreground">
                    No study time
                  </div>
                ) : (
                  day.tasks.map((task, taskIndex) => {
                    const widthPercent = (task.duration / day.totalMinutes) * 100;
                    return (
                      <motion.div
                        key={`${day.day}-${task.subject}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ delay: dayIndex * 0.05 + taskIndex * 0.02, duration: 0.3 }}
                        className="h-full flex items-center justify-center overflow-hidden group relative"
                        style={{ backgroundColor: task.color }}
                      >
                        {widthPercent > 15 && (
                          <span className="text-xs font-medium text-white truncate px-2">
                            {task.subject}
                          </span>
                        )}
                        
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">
                            {task.subject}: {formatDurationFromMinutes(task.duration)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ))}

          {/* Legend */}
          <div className="pt-4 border-t border-border mt-6">
            <p className="text-xs text-muted-foreground mb-2">Legend</p>
            <div className="flex flex-wrap gap-3">
              {schedule[0]?.tasks.map((task) => (
                <div key={task.subject} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyCalendar;
