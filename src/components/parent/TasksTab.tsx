import { useState } from "react";
import { useStore } from "../../store/useStore";
import { Modal } from "../shared/Modal";
import { EmojiPicker, TASK_ICON_OPTIONS } from "../shared/EmojiPicker";
import { Avatar } from "../shared/Avatar";
import { WEEKDAY_LABELS, type Task, type Weekday } from "../../types";
import { formatTimeRange } from "../../lib/schedule";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS_ONLY: Weekday[] = [1, 2, 3, 4, 5];
const WEEKEND_ONLY: Weekday[] = [0, 6];

const emptyForm = {
  title: "",
  icon: TASK_ICON_OPTIONS[0],
  description: "",
  stars: 1,
  days: [...WEEKDAYS_ONLY] as Weekday[],
  startTime: "",
  endTime: "",
  durationMinutes: 15,
  assignedChildIds: [] as string[],
  requiresApproval: true,
  active: true,
};

export function TasksTab() {
  const tasks = useStore((s) => s.tasks);
  const children = useStore((s) => s.children);
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);
  const removeTask = useStore((s) => s.removeTask);

  const [editing, setEditing] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm({ ...emptyForm, assignedChildIds: children.map((c) => c.id) });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setForm({
      title: task.title,
      icon: task.icon,
      description: task.description ?? "",
      stars: task.stars,
      days: task.days,
      startTime: task.startTime ?? "",
      endTime: task.endTime ?? "",
      durationMinutes: task.durationMinutes,
      assignedChildIds: task.assignedChildIds,
      requiresApproval: task.requiresApproval,
      active: task.active,
    });
    setEditing(task);
    setShowForm(true);
  };

  const toggleDay = (d: Weekday) =>
    setForm((f) => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d].sort(),
    }));

  const toggleChild = (id: string) =>
    setForm((f) => ({
      ...f,
      assignedChildIds: f.assignedChildIds.includes(id)
        ? f.assignedChildIds.filter((x) => x !== id)
        : [...f.assignedChildIds, id],
    }));

  const save = () => {
    if (!form.title.trim() || form.days.length === 0 || form.assignedChildIds.length === 0) return;
    const payload = {
      title: form.title.trim(),
      icon: form.icon,
      description: form.description.trim() || undefined,
      stars: form.stars,
      days: form.days,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      durationMinutes: form.durationMinutes,
      assignedChildIds: form.assignedChildIds,
      requiresApproval: form.requiresApproval,
      active: form.active,
    };
    if (editing) {
      updateTask(editing.id, payload);
    } else {
      addTask(payload);
    }
    setShowForm(false);
  };

  const handleRemove = (task: Task) => {
    if (confirm(`Excluir a tarefa "${task.title}"?`)) removeTask(task.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Tarefas</h2>
        <button
          onClick={openAdd}
          disabled={children.length === 0}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-semibold text-sm shadow"
        >
          + Nova tarefa
        </button>
      </div>

      {children.length === 0 && (
        <p className="text-slate-400 text-center py-6">Cadastre ao menos um filho antes de criar tarefas.</p>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-3 ${
              !task.active ? "opacity-50" : ""
            }`}
          >
            <div className="text-3xl">{task.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-800">{task.title}</p>
                <span className="text-amber-500 font-semibold text-sm">⭐ {task.stars}</span>
                {!task.active && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Inativa</span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {task.days.map((d) => WEEKDAY_LABELS[d]).join(", ")} · {formatTimeRange(task)} · ⏱️{" "}
                {task.durationMinutes} min
              </p>
              <div className="flex gap-1 mt-1.5">
                {task.assignedChildIds.map((cid) => {
                  const c = children.find((ch) => ch.id === cid);
                  if (!c) return null;
                  return <Avatar key={cid} emoji={c.avatar} color={c.color} size="sm" />;
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => openEdit(task)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
              >
                Editar
              </button>
              <button
                onClick={() => updateTask(task.id, { active: !task.active })}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-semibold"
              >
                {task.active ? "Pausar" : "Ativar"}
              </button>
              <button
                onClick={() => handleRemove(task)}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {children.length > 0 && tasks.length === 0 && (
          <p className="text-slate-400 text-center py-10">Nenhuma tarefa cadastrada ainda.</p>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? "Editar tarefa" : "Nova tarefa"} onClose={() => setShowForm(false)} wide>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Nome da tarefa</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Escovar os dentes"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Ícone</label>
              <EmojiPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} options={TASK_ICON_OPTIONS} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Valor em estrelas</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, stars: Math.max(1, f.stars - 1) }))}
                    disabled={form.stars <= 1}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-bold text-lg text-amber-500">⭐ {form.stars}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, stars: f.stars + 1 }))}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Duração do timer (min)</label>
                <input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Math.max(1, Number(e.target.value)) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Dias da semana</label>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {ALL_DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold transition ${
                      form.days.includes(d)
                        ? "bg-violet-500 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {WEEKDAY_LABELS[d]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => setForm((f) => ({ ...f, days: WEEKDAYS_ONLY }))} className="text-violet-600 font-semibold hover:underline">
                  Dias de semana
                </button>
                <button type="button" onClick={() => setForm((f) => ({ ...f, days: WEEKEND_ONLY }))} className="text-violet-600 font-semibold hover:underline">
                  Fim de semana
                </button>
                <button type="button" onClick={() => setForm((f) => ({ ...f, days: ALL_DAYS }))} className="text-violet-600 font-semibold hover:underline">
                  Todos os dias
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Horário início (opcional)</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Horário fim (opcional)</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Atribuir a</label>
              <div className="flex gap-2 flex-wrap">
                {children.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChild(c.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition ${
                      form.assignedChildIds.includes(c.id)
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Avatar emoji={c.avatar} color={c.color} size="sm" />
                    <span className="text-sm font-semibold text-slate-700">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requiresApproval}
                onChange={(e) => setForm((f) => ({ ...f, requiresApproval: e.target.checked }))}
                className="w-5 h-5 rounded accent-violet-600"
              />
              <span className="text-sm font-semibold text-slate-600">Requer aprovação dos pais ao concluir</span>
            </label>

            <button
              onClick={save}
              disabled={!form.title.trim() || form.days.length === 0 || form.assignedChildIds.length === 0}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold"
            >
              Salvar tarefa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
