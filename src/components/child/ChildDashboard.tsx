import { useMemo, useState } from "react";
import { useStore, dateKey } from "../../store/useStore";
import { Avatar } from "../shared/Avatar";
import { TaskCard } from "./TaskCard";
import { TaskTimerModal } from "./TaskTimerModal";
import { RewardsStore } from "./RewardsStore";
import { isTaskScheduledToday } from "../../lib/schedule";
import type { Task } from "../../types";

interface ChildDashboardProps {
  childId: string;
  onExit: () => void;
}

type Tab = "tasks" | "rewards";

export function ChildDashboard({ childId, onExit }: ChildDashboardProps) {
  const child = useStore((s) => s.children.find((c) => c.id === childId));
  const allTasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const [tab, setTab] = useState<Tab>("tasks");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const today = dateKey();

  const todaysTasks = useMemo(
    () =>
      allTasks
        .filter((t) => t.active && t.assignedChildIds.includes(childId) && isTaskScheduledToday(t))
        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? "")),
    [allTasks, childId]
  );

  const completionFor = (taskId: string) =>
    completions.find((c) => c.taskId === taskId && c.childId === childId && c.dateKey === today);

  if (!child) {
    onExit();
    return null;
  }

  const doneCount = todaysTasks.filter((t) => completionFor(t.id)?.status === "approved").length;

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b from-violet-50 to-white flex flex-col`}>
      <header className="px-4 sm:px-6 py-4 flex items-center gap-3 bg-white border-b border-slate-100 sticky top-0 z-30">
        <Avatar emoji={child.avatar} color={child.color} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-slate-800 truncate">{child.name}</p>
          <p className="text-xs text-slate-400">
            {doneCount}/{todaysTasks.length} missões hoje
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
          <span>⭐</span>
          <span className="font-bold text-amber-600">{child.stars}</span>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-semibold"
        >
          Sair
        </button>
      </header>

      <nav className="bg-white border-b border-slate-100 px-4 sm:px-6 flex gap-1 sticky top-[73px] z-20">
        <button
          onClick={() => setTab("tasks")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            tab === "tasks" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400"
          }`}
        >
          ✅ Missões
        </button>
        <button
          onClick={() => setTab("rewards")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            tab === "rewards" ? "border-violet-500 text-violet-600" : "border-transparent text-slate-400"
          }`}
        >
          🎁 Prêmios
        </button>
      </nav>

      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        {tab === "tasks" && (
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                completion={completionFor(task.id)}
                onStart={() => setActiveTask(task)}
              />
            ))}
            {todaysTasks.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🌈</div>
                <p className="text-slate-400">Nenhuma missão para hoje. Aproveite o dia!</p>
              </div>
            )}
          </div>
        )}

        {tab === "rewards" && <RewardsStore child={child} />}
      </main>

      {activeTask && (
        <TaskTimerModal task={activeTask} childId={childId} onClose={() => setActiveTask(null)} />
      )}
    </div>
  );
}
