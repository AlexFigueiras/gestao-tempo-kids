import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Child,
  Reward,
  RewardRedemption,
  ScreenTimeLogEntry,
  Settings,
  Task,
  TaskCompletion,
} from "../types";

const uid = () => crypto.randomUUID();

const CHILD_COLORS = ["violet", "sky", "rose", "amber", "emerald", "orange"];

export const dateKey = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

interface StoreState {
  children: Child[];
  tasks: Task[];
  completions: TaskCompletion[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  screenTimeLog: ScreenTimeLogEntry[];
  settings: Settings;

  // children
  addChild: (name: string, avatar: string) => void;
  updateChild: (id: string, patch: Partial<Child>) => void;
  removeChild: (id: string) => void;

  // tasks
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;

  // rewards
  addReward: (reward: Omit<Reward, "id" | "createdAt">) => void;
  updateReward: (id: string, patch: Partial<Reward>) => void;
  removeReward: (id: string) => void;

  // task completions
  completeTask: (taskId: string, childId: string) => void;
  approveCompletion: (id: string) => void;
  rejectCompletion: (id: string) => void;

  // reward redemptions
  redeemReward: (rewardId: string, childId: string) => void;
  approveRedemption: (id: string) => void;
  rejectRedemption: (id: string) => void;

  // screen time bank
  addScreenTime: (childId: string, minutes: number, reason: string) => void;

  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  resetAllData: () => void;
}

const defaultSettings: Settings = {
  parentPin: "0000",
  familyName: "Nossa Família",
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      const grantReward = (reward: Reward, childId: string) => {
        if (reward.type === "screen_time" && reward.amount) {
          get().addScreenTime(childId, reward.amount, `Recompensa: ${reward.title}`);
        } else if (reward.type === "money" && reward.amount) {
          set((s) => ({
            children: s.children.map((c) =>
              c.id === childId
                ? { ...c, moneyBalance: c.moneyBalance + (reward.amount ?? 0) }
                : c
            ),
          }));
        }
      };

      return {
      children: [],
      tasks: [],
      completions: [],
      rewards: [],
      redemptions: [],
      screenTimeLog: [],
      settings: defaultSettings,

      addChild: (name, avatar) =>
        set((s) => ({
          children: [
            ...s.children,
            {
              id: uid(),
              name,
              avatar,
              color: CHILD_COLORS[s.children.length % CHILD_COLORS.length],
              stars: 0,
              screenTimeMinutes: 0,
              moneyBalance: 0,
              createdAt: Date.now(),
            },
          ],
        })),

      updateChild: (id, patch) =>
        set((s) => ({
          children: s.children.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      removeChild: (id) =>
        set((s) => ({
          children: s.children.filter((c) => c.id !== id),
          tasks: s.tasks.map((t) => ({
            ...t,
            assignedChildIds: t.assignedChildIds.filter((cid) => cid !== id),
          })),
          completions: s.completions.filter((c) => c.childId !== id),
          redemptions: s.redemptions.filter((r) => r.childId !== id),
          screenTimeLog: s.screenTimeLog.filter((l) => l.childId !== id),
        })),

      addTask: (task) =>
        set((s) => ({
          tasks: [...s.tasks, { ...task, id: uid(), createdAt: Date.now() }],
        })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
          completions: s.completions.filter((c) => c.taskId !== id),
        })),

      addReward: (reward) =>
        set((s) => ({
          rewards: [...s.rewards, { ...reward, id: uid(), createdAt: Date.now() }],
        })),

      updateReward: (id, patch) =>
        set((s) => ({
          rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      removeReward: (id) =>
        set((s) => ({
          rewards: s.rewards.filter((r) => r.id !== id),
          redemptions: s.redemptions.filter((r) => r.rewardId !== id),
        })),

      completeTask: (taskId, childId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const needsApproval = task.requiresApproval;
        const completion: TaskCompletion = {
          id: uid(),
          taskId,
          childId,
          dateKey: dateKey(),
          status: needsApproval ? "pending_approval" : "approved",
          starsAwarded: task.stars,
          completedAt: Date.now(),
          reviewedAt: needsApproval ? undefined : Date.now(),
        };
        set((s) => ({ completions: [...s.completions, completion] }));
        if (!needsApproval) {
          set((s) => ({
            children: s.children.map((c) =>
              c.id === childId ? { ...c, stars: c.stars + task.stars } : c
            ),
          }));
        }
      },

      approveCompletion: (id) => {
        const completion = get().completions.find((c) => c.id === id);
        if (!completion || completion.status !== "pending_approval") return;
        set((s) => ({
          completions: s.completions.map((c) =>
            c.id === id ? { ...c, status: "approved", reviewedAt: Date.now() } : c
          ),
          children: s.children.map((c) =>
            c.id === completion.childId
              ? { ...c, stars: c.stars + completion.starsAwarded }
              : c
          ),
        }));
      },

      rejectCompletion: (id) =>
        set((s) => ({
          completions: s.completions.map((c) =>
            c.id === id ? { ...c, status: "rejected", reviewedAt: Date.now() } : c
          ),
        })),

      redeemReward: (rewardId, childId) => {
        const reward = get().rewards.find((r) => r.id === rewardId);
        const child = get().children.find((c) => c.id === childId);
        if (!reward || !child || child.stars < reward.cost) return;

        // reserve stars immediately
        set((s) => ({
          children: s.children.map((c) =>
            c.id === childId ? { ...c, stars: c.stars - reward.cost } : c
          ),
        }));

        const needsApproval = reward.requiresApproval;
        const redemption: RewardRedemption = {
          id: uid(),
          rewardId,
          childId,
          status: needsApproval ? "pending_approval" : "approved",
          starsCost: reward.cost,
          createdAt: Date.now(),
          reviewedAt: needsApproval ? undefined : Date.now(),
        };
        set((s) => ({ redemptions: [...s.redemptions, redemption] }));

        if (!needsApproval) {
          grantReward(reward, childId);
        }
      },

      approveRedemption: (id) => {
        const redemption = get().redemptions.find((r) => r.id === id);
        const reward = get().rewards.find((r) => r.id === redemption?.rewardId);
        if (!redemption || !reward || redemption.status !== "pending_approval") return;
        set((s) => ({
          redemptions: s.redemptions.map((r) =>
            r.id === id ? { ...r, status: "approved", reviewedAt: Date.now() } : r
          ),
        }));
        grantReward(reward, redemption.childId);
      },

      rejectRedemption: (id) => {
        const redemption = get().redemptions.find((r) => r.id === id);
        if (!redemption || redemption.status !== "pending_approval") return;
        set((s) => ({
          redemptions: s.redemptions.map((r) =>
            r.id === id ? { ...r, status: "rejected", reviewedAt: Date.now() } : r
          ),
          children: s.children.map((c) =>
            c.id === redemption.childId
              ? { ...c, stars: c.stars + redemption.starsCost }
              : c
          ),
        }));
      },

      addScreenTime: (childId, minutes, reason) => {
        set((s) => ({
          children: s.children.map((c) =>
            c.id === childId
              ? { ...c, screenTimeMinutes: Math.max(0, c.screenTimeMinutes + minutes) }
              : c
          ),
          screenTimeLog: [
            ...s.screenTimeLog,
            { id: uid(), childId, minutes, reason, createdAt: Date.now() },
          ],
        }));
      },

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetAllData: () =>
        set({
          children: [],
          tasks: [],
          completions: [],
          rewards: [],
          redemptions: [],
          screenTimeLog: [],
          settings: defaultSettings,
        }),
      };
    },
    {
      name: "gestao-tempo-kids-storage",
      version: 1,
    }
  )
);
