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
import {
  DailyBlock,
  BlockOverride,
  generateBlocksForDate,
  studyDatesForWeek,
  dateKey,
  timeToMinutes,
} from "@/lib/dailyPlan";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface SubjectProgress {
  subject: string;
  color: string;
  doneMinutes: number;
  totalMinutes: number;
}

export const useStudyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<PlannerSettings>({
    totalWeeklyHours: 10,
    studyDaysPerWeek: 5,
  });
  const [overrides, setOverrides] = useState<Record<string, BlockOverride>>({});
  const [manualBlocks, setManualBlocks] = useState<DailyBlock[]>([]);

  const totalWeight = useMemo(() => calculateTotalWeight(tasks), [tasks]);

  const calculatedTasks: CalculatedTask[] = useMemo(
    () => tasks.map((task) => processTask(task, totalWeight, settings)),
    [tasks, totalWeight, settings]
  );

  const getBlocksForDate = useCallback(
    (date: Date): DailyBlock[] => {
      const key = dateKey(date);
      const generated = generateBlocksForDate(date, calculatedTasks, settings.studyDaysPerWeek)
        .map((b) => ({ ...b, ...overrides[b.id] }))
        .filter((b) => !(b as BlockOverride).deleted);
      const manual = manualBlocks.filter((b) => b.date === key);
      return [...generated, ...manual]
        .map(({ ...b }) => {
          delete (b as BlockOverride).deleted;
          return b as DailyBlock;
        })
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    },
    [calculatedTasks, settings.studyDaysPerWeek, overrides, manualBlocks]
  );

  // Current week's daily blocks → drives Weekly Overview so both views stay in sync
  const weekDates = useMemo(
    () => studyDatesForWeek(new Date(), settings.studyDaysPerWeek),
    [settings.studyDaysPerWeek]
  );

  const weeklySchedule: DaySchedule[] = useMemo(() => {
    return weekDates.map((d) => {
      const blocks = getBlocksForDate(d);
      const map = new Map<string, { subject: string; duration: number; color: string }>();
      blocks.forEach((b) => {
        const cur = map.get(b.subject);
        if (cur) cur.duration += b.duration;
        else map.set(b.subject, { subject: b.subject, duration: b.duration, color: b.color });
      });
      const dayTasks = Array.from(map.values());
      return {
        day: DAYS_OF_WEEK[d.getDay()],
        tasks: dayTasks,
        totalMinutes: dayTasks.reduce((s, t) => s + t.duration, 0),
      };
    });
  }, [weekDates, getBlocksForDate]);

  const subjectProgress: SubjectProgress[] = useMemo(() => {
    const map = new Map<string, SubjectProgress>();
    weekDates.forEach((d) =>
      getBlocksForDate(d).forEach((b) => {
        const cur = map.get(b.subject) ?? { subject: b.subject, color: b.color, doneMinutes: 0, totalMinutes: 0 };
        cur.totalMinutes += b.duration;
        if (b.done) cur.doneMinutes += b.duration;
        map.set(b.subject, cur);
      })
    );
    return Array.from(map.values());
  }, [weekDates, getBlocksForDate]);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PlannerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const clearAllTasks = useCallback(() => setTasks([]), []);

  const isManual = useCallback((id: string) => manualBlocks.some((b) => b.id === id), [manualBlocks]);

  const updateBlock = useCallback(
    (id: string, updates: Partial<DailyBlock>) => {
      if (isManual(id)) {
        setManualBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      } else {
        setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
      }
    },
    [isManual]
  );

  const addBlock = useCallback(
    (block: Omit<DailyBlock, "id" | "color" | "done">) => {
      const idx = calculatedTasks.findIndex((t) => t.subject.toLowerCase() === block.subject.toLowerCase());
      const color = getSubjectColor(idx >= 0 ? idx : calculatedTasks.length + manualBlocks.length);
      setManualBlocks((prev) => [...prev, { ...block, id: crypto.randomUUID(), color, done: false }]);
    },
    [calculatedTasks, manualBlocks.length]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      if (isManual(id)) setManualBlocks((prev) => prev.filter((b) => b.id !== id));
      else setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], deleted: true } }));
    },
    [isManual]
  );

  return {
    tasks,
    calculatedTasks,
    settings,
    weeklySchedule,
    subjectProgress,
    totalWeight,
    addTask,
    removeTask,
    updateTask,
    updateSettings,
    clearAllTasks,
    getBlocksForDate,
    addBlock,
    updateBlock,
    deleteBlock,
  };
};
