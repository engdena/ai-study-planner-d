import { format, startOfWeek, addDays } from "date-fns";
import { CalculatedTask, getSubjectColor } from "@/types/studyPlanner";

export type BlockPriority = "High" | "Medium" | "Low";

export interface DailyBlock {
  id: string;
  date: string; // yyyy-MM-dd (Gregorian)
  start: string; // HH:mm
  duration: number; // minutes
  subject: string;
  activity: string;
  priority: BlockPriority;
  done: boolean;
  taskId?: string;
  color: string;
}

export type BlockOverride = Partial<Omit<DailyBlock, "id">> & { deleted?: boolean };

export const DAY_START_MINUTES = 8 * 60;
export const BREAK_MINUTES = 30;

const ACTIVITIES = [
  "Review lecture notes",
  "Practice problem set",
  "Deep work: core concepts",
  "Past exam drills",
  "Summarize & flashcards",
];

export const toPriority = (p: number): BlockPriority =>
  p >= 4 ? "High" : p === 3 ? "Medium" : "Low";

export const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

export const minutesToTime = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Study days of the week containing `date` (week starts Sunday). */
export const studyDatesForWeek = (date: Date, studyDaysPerWeek: number) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: studyDaysPerWeek }, (_, i) => addDays(start, i));
};

/** Break each subject's daily allocation into a chronological time block for a given date. */
export const generateBlocksForDate = (
  date: Date,
  tasks: CalculatedTask[],
  studyDaysPerWeek: number
): DailyBlock[] => {
  const dow = date.getDay();
  if (dow >= studyDaysPerWeek) return [];
  const key = dateKey(date);
  const sorted = tasks
    .map((t, i) => ({ t, color: getSubjectColor(i) }))
    .filter(({ t }) => Math.round(t.dailyStudyTime * 60) > 0)
    .sort((a, b) => b.t.finalWeight - a.t.finalWeight);
  let cursor = DAY_START_MINUTES;
  return sorted.map(({ t, color }, i) => {
    const duration = Math.max(5, Math.round((t.dailyStudyTime * 60) / 5) * 5);
    const block: DailyBlock = {
      id: `${t.id}_${key}`,
      date: key,
      start: minutesToTime(cursor),
      duration,
      subject: t.subject,
      activity: ACTIVITIES[(dow + i) % ACTIVITIES.length],
      priority: toPriority(t.priority),
      done: false,
      taskId: t.id,
      color,
    };
    cursor += duration + BREAK_MINUTES;
    return block;
  });
};
