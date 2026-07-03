import { useStore } from "../../store/useStore";
import { Avatar } from "../shared/Avatar";

export function ApprovalsTab() {
  const completions = useStore((s) => s.completions);
  const redemptions = useStore((s) => s.redemptions);
  const tasks = useStore((s) => s.tasks);
  const rewards = useStore((s) => s.rewards);
  const children = useStore((s) => s.children);
  const approveCompletion = useStore((s) => s.approveCompletion);
  const rejectCompletion = useStore((s) => s.rejectCompletion);
  const approveRedemption = useStore((s) => s.approveRedemption);
  const rejectRedemption = useStore((s) => s.rejectRedemption);

  const pendingCompletions = completions
    .filter((c) => c.status === "pending_approval")
    .sort((a, b) => b.completedAt - a.completedAt);
  const pendingRedemptions = redemptions
    .filter((r) => r.status === "pending_approval")
    .sort((a, b) => b.createdAt - a.createdAt);

  const recentDecided = [
    ...completions
      .filter((c) => c.status !== "pending_approval")
      .map((c) => ({
        id: c.id,
        childId: c.childId,
        status: c.status,
        when: c.reviewedAt ?? c.completedAt,
        label: tasks.find((t) => t.id === c.taskId)?.title ?? "",
      })),
    ...redemptions
      .filter((r) => r.status !== "pending_approval")
      .map((r) => ({
        id: r.id,
        childId: r.childId,
        status: r.status,
        when: r.reviewedAt ?? r.createdAt,
        label: rewards.find((rw) => rw.id === r.rewardId)?.title ?? "",
      })),
  ]
    .sort((a, b) => b.when - a.when)
    .slice(0, 8);

  const empty = pendingCompletions.length === 0 && pendingRedemptions.length === 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-5">Aprovações</h2>

      {empty && (
        <p className="text-slate-400 text-center py-10">Nenhuma aprovação pendente no momento. 🎉</p>
      )}

      {pendingCompletions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Tarefas concluídas</h3>
          <div className="space-y-3">
            {pendingCompletions.map((c) => {
              const task = tasks.find((t) => t.id === c.taskId);
              const child = children.find((ch) => ch.id === c.childId);
              if (!task || !child) return null;
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                  <Avatar emoji={child.avatar} color={child.color} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">
                      {child.name} concluiu <span className="text-slate-600">{task.icon} {task.title}</span>
                    </p>
                    <p className="text-sm text-amber-500 font-semibold">⭐ {c.starsAwarded}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveCompletion(c.id)}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => rejectCompletion(c.id)}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pendingRedemptions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Resgates de recompensa</h3>
          <div className="space-y-3">
            {pendingRedemptions.map((r) => {
              const reward = rewards.find((rw) => rw.id === r.rewardId);
              const child = children.find((ch) => ch.id === r.childId);
              if (!reward || !child) return null;
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                  <Avatar emoji={child.avatar} color={child.color} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">
                      {child.name} quer resgatar <span className="text-slate-600">{reward.icon} {reward.title}</span>
                    </p>
                    <p className="text-sm text-amber-500 font-semibold">⭐ -{r.starsCost}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveRedemption(r.id)}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => rejectRedemption(r.id)}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentDecided.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Histórico recente</h3>
          <div className="space-y-2">
            {recentDecided.map((entry) => {
              const child = children.find((ch) => ch.id === entry.childId);
              if (!child) return null;
              return (
                <div key={entry.id} className="flex items-center gap-2 text-sm text-slate-500 px-1">
                  <Avatar emoji={child.avatar} color={child.color} size="sm" />
                  <span>
                    {child.name} · {entry.label} ·{" "}
                    <span className={entry.status === "approved" ? "text-emerald-600" : "text-red-500"}>
                      {entry.status === "approved" ? "Aprovado" : "Rejeitado"}
                    </span>
                  </span>
                  <span className="ml-auto text-xs text-slate-300">
                    {new Date(entry.when).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
