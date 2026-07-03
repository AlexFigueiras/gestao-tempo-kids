export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo ... 6 = sábado

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: "Dom",
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
};

export interface Child {
  id: string;
  name: string;
  avatar: string; // emoji
  color: string; // tailwind color token, e.g. "violet"
  stars: number;
  screenTimeMinutes: number; // banco de tempo de tela acumulado (em minutos)
  moneyBalance: number; // em reais, acumulado de recompensas em dinheiro
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  icon: string; // emoji
  description?: string;
  stars: number; // valor em estrelas
  days: Weekday[]; // dias da semana em que a tarefa ocorre
  startTime?: string; // "HH:MM" opcional
  endTime?: string; // "HH:MM" opcional
  durationMinutes: number; // duração pré-definida para o timer
  assignedChildIds: string[];
  requiresApproval: boolean;
  active: boolean;
  createdAt: number;
}

export type CompletionStatus = "pending_approval" | "approved" | "rejected";

export interface TaskCompletion {
  id: string;
  taskId: string;
  childId: string;
  dateKey: string; // "YYYY-MM-DD" data em que foi concluída
  status: CompletionStatus;
  starsAwarded: number;
  completedAt: number;
  reviewedAt?: number;
}

export type RewardType = "screen_time" | "money" | "other";

export interface Reward {
  id: string;
  title: string;
  icon: string;
  type: RewardType;
  cost: number; // custo em estrelas
  amount?: number; // minutos (screen_time) ou valor em reais (money)
  requiresApproval: boolean;
  active: boolean;
  createdAt: number;
}

export type RedemptionStatus = "pending_approval" | "approved" | "rejected";

export interface RewardRedemption {
  id: string;
  rewardId: string;
  childId: string;
  status: RedemptionStatus;
  starsCost: number;
  createdAt: number;
  reviewedAt?: number;
}

export interface ScreenTimeLogEntry {
  id: string;
  childId: string;
  minutes: number; // positivo = ganho, negativo = usado
  reason: string;
  createdAt: number;
}

export interface Settings {
  parentPin: string;
  familyName: string;
}
