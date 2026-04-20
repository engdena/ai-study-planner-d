// Study Planner Types - based on Excel logic

export type WorkIntensity = "deep" | "admin" | "review";

export const WORK_INTENSITY_LABELS: Record<WorkIntensity, string> = {
  deep: "Deep Work",
  admin: "Administrative",
  review: "Review",
};

export interface Task {
  id: string;
  subject: string;
  difficulty: number; // 1-5
  priority: number; // 1-5
  deadline: Date;
  workIntensity: WorkIntensity;
  completed?: boolean;
}

export interface CalculatedTask extends Task {
  daysLeft: number;
  urgencyScore: number; // 0-1 (percentage)
  baseWeight: number;
  finalWeight: number;
  studyHours: number;
  dailyStudyTime: number;
}

export interface PlannerSettings {
  totalWeeklyHours: number;
  studyDaysPerWeek: number;
  dailyAvailableHours: number; // for capacity utilization
  startTime: string; // "HH:MM" 24h, for projected completion
}

export interface DaySchedule {
  day: string;
  tasks: {
    subject: string;
    duration: number; // in minutes
    color: string;
  }[];
  totalMinutes: number;
}

// Calculation functions based on Excel formulas
export const calculateDaysLeft = (deadline: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateUrgencyScore = (daysLeft: number): number => {
  if (daysLeft <= 0) return 1;
  if (daysLeft >= 30) return 0.1;
  return Math.max(0.1, 1 - daysLeft / 30);
};

export const calculateBaseWeight = (difficulty: number, priority: number): number =>
  difficulty * priority;

export const calculateFinalWeight = (baseWeight: number, urgencyScore: number): number =>
  baseWeight * (1 + urgencyScore);

export const calculateStudyHours = (
  finalWeight: number,
  totalWeight: number,
  totalWeeklyHours: number
): number => {
  if (totalWeight === 0) return 0;
  return (finalWeight / totalWeight) * totalWeeklyHours;
};

export const calculateDailyStudyTime = (
  studyHours: number,
  studyDaysPerWeek: number
): number => {
  if (studyDaysPerWeek === 0) return 0;
  return studyHours / studyDaysPerWeek;
};

export const processTask = (
  task: Task,
  totalWeight: number,
  settings: PlannerSettings
): CalculatedTask => {
  const daysLeft = calculateDaysLeft(task.deadline);
  const urgencyScore = calculateUrgencyScore(daysLeft);
  const baseWeight = calculateBaseWeight(task.difficulty, task.priority);
  const finalWeight = calculateFinalWeight(baseWeight, urgencyScore);
  const studyHours = calculateStudyHours(finalWeight, totalWeight, settings.totalWeeklyHours);
  const dailyStudyTime = calculateDailyStudyTime(studyHours, settings.studyDaysPerWeek);
  return {
    ...task,
    daysLeft,
    urgencyScore,
    baseWeight,
    finalWeight,
    studyHours,
    dailyStudyTime,
  };
};

export const calculateTotalWeight = (tasks: Task[]): number =>
  tasks.reduce((total, task) => {
    const daysLeft = calculateDaysLeft(task.deadline);
    const urgencyScore = calculateUrgencyScore(daysLeft);
    const baseWeight = calculateBaseWeight(task.difficulty, task.priority);
    return total + calculateFinalWeight(baseWeight, urgencyScore);
  }, 0);

export const formatDuration = (hours: number): string => {
  if (hours <= 0) return "0 min";
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

export const formatDurationFromMinutes = (minutes: number): string => {
  if (minutes <= 0) return "0 min";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

// Project completion time given start time HH:MM and total hours of work
export const projectCompletionTime = (startTime: string, totalHours: number): string => {
  if (totalHours <= 0) return "—";
  const [h, m] = startTime.split(":").map(Number);
  const start = new Date();
  start.setHours(h || 9, m || 0, 0, 0);
  const end = new Date(start.getTime() + totalHours * 60 * 60 * 1000);
  const day =
    end.getDate() !== start.getDate()
      ? ` (+${Math.floor((end.getTime() - start.getTime()) / 86400000) || 1}d)`
      : "";
  const hh = end.getHours().toString().padStart(2, "0");
  const mm = end.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}${day}`;
};

export const SUBJECT_COLORS = [
  "hsl(0, 0%, 9%)",
  "hsl(0, 0%, 25%)",
  "hsl(0, 0%, 40%)",
  "hsl(0, 0%, 55%)",
  "hsl(0, 0%, 70%)",
  "hsl(0, 0%, 18%)",
  "hsl(0, 0%, 32%)",
  "hsl(0, 0%, 48%)",
];

export const getSubjectColor = (index: number): string =>
  SUBJECT_COLORS[index % SUBJECT_COLORS.length];
