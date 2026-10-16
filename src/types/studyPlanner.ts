// Study Planner Types - based on Excel logic

export interface Task {
  id: string;
  subject: string;
  difficulty: number; // 1-5
  priority: number; // 1-5
  deadline: Date;
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
  // Urgency increases as deadline approaches
  // Using inverse relationship: closer deadline = higher urgency
  if (daysLeft <= 0) return 1; // Max urgency for overdue
  if (daysLeft >= 30) return 0.1; // Minimum urgency for far deadlines
  return Math.max(0.1, 1 - (daysLeft / 30));
};

export const calculateBaseWeight = (difficulty: number, priority: number): number => {
  // BaseWeight = Difficulty × Priority
  return difficulty * priority;
};

export const calculateFinalWeight = (
  baseWeight: number,
  urgencyScore: number
): number => {
  // FinalWeight = BaseWeight × (1 + UrgencyScore)
  // This gives more weight to urgent tasks
  return baseWeight * (1 + urgencyScore);
};

export const calculateStudyHours = (
  finalWeight: number,
  totalWeight: number,
  totalWeeklyHours: number
): number => {
  if (totalWeight === 0) return 0;
  // Proportional distribution based on weight
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

export const calculateTotalWeight = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => {
    const daysLeft = calculateDaysLeft(task.deadline);
    const urgencyScore = calculateUrgencyScore(daysLeft);
    const baseWeight = calculateBaseWeight(task.difficulty, task.priority);
    const finalWeight = calculateFinalWeight(baseWeight, urgencyScore);
    return total + finalWeight;
  }, 0);
};

export const formatDuration = (hours: number): string => {
  if (hours === 0) return "0 min";
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

export const formatDurationFromMinutes = (minutes: number): string => {
  if (minutes === 0) return "0 min";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

// Colors for different subjects
export const SUBJECT_COLORS = [
  "hsl(160, 84%, 39%)", // Primary emerald
  "hsl(200, 80%, 45%)", // Blue
  "hsl(280, 70%, 50%)", // Purple
  "hsl(340, 75%, 55%)", // Pink
  "hsl(30, 90%, 50%)",  // Orange
  "hsl(180, 70%, 40%)", // Teal
  "hsl(50, 90%, 45%)",  // Yellow
  "hsl(220, 70%, 55%)", // Indigo
];

export const getSubjectColor = (index: number): string => {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
};
