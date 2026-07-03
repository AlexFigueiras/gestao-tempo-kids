import { useState } from "react";
import { useStore } from "../../store/useStore";
import { ChildrenTab } from "./ChildrenTab";
import { TasksTab } from "./TasksTab";
import { RewardsTab } from "./RewardsTab";
import { ApprovalsTab } from "./ApprovalsTab";
import { SettingsTab } from "./SettingsTab";

interface ParentDashboardProps {
  onExit: () => void;
}

type Tab = "children" | "tasks" | "rewards" | "approvals" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "children", label: "Filhos", icon: "👨‍👩‍👧‍👦" },
  { id: "tasks", label: "Tarefas", icon: "✅" },
  { id: "rewards", label: "Recompensas", icon: "🎁" },
  { id: "approvals", label: "Aprovações", icon: "🔔" },
  { id: "settings", label: "Config", icon: "⚙️" },
];

export function ParentDashboard({ onExit }: ParentDashboardProps) {
  const [tab, setTab] = useState<Tab>("children");
  const pendingCount = useStore(
    (s) =>
      s.completions.filter((c) => c.status === "pending_approval").length +
      s.redemptions.filter((r) => r.status === "pending_approval").length
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <h1 className="font-extrabold text-slate-800 text-lg">Área dos Pais</h1>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm"
        >
          Sair
        </button>
      </header>

      <nav className="bg-white border-b border-slate-200 px-2 sm:px-6 flex gap-1 overflow-x-auto sticky top-[65px] z-20">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              tab === t.id
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
            {t.id === "approvals" && pendingCount > 0 && (
              <span className="absolute -top-1 right-0 sm:-right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto">
        {tab === "children" && <ChildrenTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "rewards" && <RewardsTab />}
        {tab === "approvals" && <ApprovalsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
