import type { Task, TaskCompletion } from "../../types";
import { formatTimeRange } from "../../lib/schedule";

interface TaskCardProps {
  task: Task;
  completion?: TaskCompletion;
  onStart: () => void;
}

export function TaskCard({ task, completion, onStart }: TaskCardProps) {
  const status = completion?.status;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
      <div className="text-4xl">{task.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800">{task.title}</p>
        <p className="text-sm text-slate-500">
          {formatTimeRange(task)} · ⏱️ {task.durationMinutes} min
        </p>
        <p className="text-sm text-amber-500 font-semibold">⭐ {task.stars}</p>
      </div>

      {status === "approved" && (
        <span className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold whitespace-nowrap">
          ✅ Feito
        </span>
      )}
      {status === "pending_approval" && (
        <span className="px-3 py-2 rounded-xl bg-amber-100 text-amber-700 text-sm font-bold whitespace-nowrap">
          ⏳ Aguardando
        </span>
      )}
      {status === "rejected" && (
        <button
          onClick={onStart}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold whitespace-nowrap"
        >
          🔁 Refazer
        </button>
      )}
      {!status && (
        <button
          onClick={onStart}
          className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-2xl flex items-center justify-center shadow-lg transition"
          aria-label="Iniciar tarefa"
        >
          ▶️
        </button>
      )}
    </div>
  );
}
