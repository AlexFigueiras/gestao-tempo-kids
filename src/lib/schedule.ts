import type { Task, Weekday } from "../types";

export const todayWeekday = (d: Date = new Date()): Weekday => d.getDay() as Weekday;

export const isTaskScheduledToday = (task: Task, d: Date = new Date()) =>
  task.days.includes(todayWeekday(d));

export const nowHHMM = (d: Date = new Date()) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

/** Retorna "upcoming" | "active" | "past" | "anytime" com base na janela de horário da tarefa */
export const taskTimeStatus = (task: Task, d: Date = new Date()): "upcoming" | "active" | "past" | "anytime" => {
  if (!task.startTime) return "anytime";
  const now = nowHHMM(d);
  const end = task.endTime ?? task.startTime;
  if (now < task.startTime) return "upcoming";
  if (now > end) return "past";
  return "active";
};

export const formatTimeRange = (task: Task) => {
  if (!task.startTime) return "Qualquer horário";
  if (!task.endTime || task.endTime === task.startTime) return task.startTime;
  return `${task.startTime} - ${task.endTime}`;
};

export const formatMinutes = (totalMinutes: number) => {
  const m = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem} min`;
  return `${h}h ${rem}min`;
};

export const formatClock = (totalSeconds: number) => {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
