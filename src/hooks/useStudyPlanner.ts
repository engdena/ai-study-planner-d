import { useState, useMemo, useCallback } from "react";
import {
  Task,
  CalculatedTask,
  PlannerSettings,
  DaySchedule,
  calculateTotalWeight,
  processTask,
  getSubjectColor,
} from "@/types/studyPlanner";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export const useStudyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<PlannerSettings>({
    totalWeeklyHours: 10,
    studyDaysPerWeek: 5,
    dailyAvailableHours: 4,
    startTime: "09:00",
  });

  const totalWeight = useMemo(() => calculateTotalWeight(tasks), [tasks]);

  const calculatedTasks: CalculatedTask[] = useMemo(
    () => tasks.map((task) => processTask(task, totalWeight, settings)),
    [tasks, totalWeight, settings]
  );

  const weeklySchedule: DaySchedule[] = useMemo(() => {
    const studyDays = DAYS_OF_WEEK.slice(0, settings.studyDaysPerWeek);
    return studyDays.map((day) => {
      const dayTasks = calculatedTasks
        .map((task, index) => ({
          subject: task.subject,
          duration: Math.round(task.dailyStudyTime * 60),
          color: getSubjectColor(index),
        }))
        .filter((t) => t.duration > 0);
      const totalMinutes = dayTasks.reduce((s, t) => s + t.duration, 0);
      return { day, tasks: dayTasks, totalMinutes };
    });
  }, [calculatedTasks, settings.studyDaysPerWeek]);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const resetPlan = useCallback(() => {
    setTasks([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PlannerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    tasks,
    calculatedTasks,
    settings,
    weeklySchedule,
    totalWeight,
    addTask,
    removeTask,
    updateTask,
    toggleTaskCompleted,
    clearCompleted,
    resetPlan,
    updateSettings,
  };
};
