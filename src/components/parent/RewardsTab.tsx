import { useState } from "react";
import { useStore } from "../../store/useStore";
import { Modal } from "../shared/Modal";
import { EmojiPicker, REWARD_ICON_OPTIONS } from "../shared/EmojiPicker";
import type { Reward, RewardType } from "../../types";

const emptyForm = {
  title: "",
  icon: REWARD_ICON_OPTIONS[0],
  type: "screen_time" as RewardType,
  cost: 5,
  amount: 15,
  requiresApproval: true,
  active: true,
};

const TYPE_LABELS: Record<RewardType, string> = {
  screen_time: "Tempo de tela/jogo",
  money: "Dinheiro",
  other: "Outro",
};

export function RewardsTab() {
  const rewards = useStore((s) => s.rewards);
  const addReward = useStore((s) => s.addReward);
  const updateReward = useStore((s) => s.updateReward);
  const removeReward = useStore((s) => s.removeReward);

  const [editing, setEditing] = useState<Reward | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (reward: Reward) => {
    setForm({
      title: reward.title,
      icon: reward.icon,
      type: reward.type,
      cost: reward.cost,
      amount: reward.amount ?? 0,
      requiresApproval: reward.requiresApproval,
      active: reward.active,
    });
    setEditing(reward);
    setShowForm(true);
  };

  const save = () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      icon: form.icon,
      type: form.type,
      cost: form.cost,
      amount: form.type === "other" ? undefined : form.amount,
      requiresApproval: form.requiresApproval,
      active: form.active,
    };
    if (editing) {
      updateReward(editing.id, payload);
    } else {
      addReward(payload);
    }
    setShowForm(false);
  };

  const handleRemove = (reward: Reward) => {
    if (confirm(`Excluir a recompensa "${reward.title}"?`)) removeReward(reward.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Recompensas</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow"
        >
          + Nova recompensa
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-sm ${
              !reward.active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{reward.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{reward.title}</p>
                <p className="text-sm text-slate-500">
                  {TYPE_LABELS[reward.type]}
                  {reward.type === "screen_time" && ` · ${reward.amount} min`}
                  {reward.type === "money" && ` · R$ ${reward.amount?.toFixed(2)}`}
                </p>
                <p className="text-sm text-amber-500 font-semibold">⭐ {reward.cost} estrelas</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openEdit(reward)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold"
              >
                Editar
              </button>
              <button
                onClick={() => updateReward(reward.id, { active: !reward.active })}
                className="flex-1 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 text-sm font-semibold"
              >
                {reward.active ? "Pausar" : "Ativar"}
              </button>
              <button
                onClick={() => handleRemove(reward)}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {rewards.length === 0 && (
          <p className="text-slate-400 col-span-2 text-center py-10">Nenhuma recompensa cadastrada ainda.</p>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? "Editar recompensa" : "Nova recompensa"} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Nome da recompensa</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: 30 min de videogame"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Ícone</label>
              <EmojiPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} options={REWARD_ICON_OPTIONS} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Tipo de recompensa</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TYPE_LABELS) as RewardType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                      form.type === t ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Custo em estrelas</label>
                <input
                  type="number"
                  min={1}
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: Math.max(1, Number(e.target.value)) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                />
              </div>
              {form.type !== "other" && (
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    {form.type === "screen_time" ? "Minutos concedidos" : "Valor (R$)"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={form.type === "money" ? "0.01" : "1"}
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: Math.max(0, Number(e.target.value)) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requiresApproval}
                onChange={(e) => setForm((f) => ({ ...f, requiresApproval: e.target.checked }))}
                className="w-5 h-5 rounded accent-violet-600"
              />
              <span className="text-sm font-semibold text-slate-600">Requer aprovação dos pais ao resgatar</span>
            </label>

            <button
              onClick={save}
              disabled={!form.title.trim()}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold"
            >
              Salvar recompensa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
