import { useState } from "react";
import { useStore } from "../../store/useStore";
import { Avatar } from "../shared/Avatar";
import { Modal } from "../shared/Modal";
import { CHILD_AVATAR_OPTIONS, EmojiPicker } from "../shared/EmojiPicker";
import { formatMinutes } from "../../lib/schedule";

export function ChildrenTab() {
  const children = useStore((s) => s.children);
  const addChild = useStore((s) => s.addChild);
  const updateChild = useStore((s) => s.updateChild);
  const removeChild = useStore((s) => s.removeChild);
  const addScreenTime = useStore((s) => s.addScreenTime);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(CHILD_AVATAR_OPTIONS[0]);
  const [timeChildId, setTimeChildId] = useState<string | null>(null);
  const [timeAmount, setTimeAmount] = useState(15);

  const openAdd = () => {
    setName("");
    setAvatar(CHILD_AVATAR_OPTIONS[0]);
    setShowAdd(true);
  };

  const openEdit = (id: string) => {
    const child = children.find((c) => c.id === id);
    if (!child) return;
    setName(child.name);
    setAvatar(child.avatar);
    setEditingId(id);
  };

  const saveNew = () => {
    if (!name.trim()) return;
    addChild(name.trim(), avatar);
    setShowAdd(false);
  };

  const saveEdit = () => {
    if (!editingId || !name.trim()) return;
    updateChild(editingId, { name: name.trim(), avatar });
    setEditingId(null);
  };

  const handleRemove = (id: string, childName: string) => {
    if (confirm(`Remover ${childName}? Isso apaga o histórico dela também.`)) {
      removeChild(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Meus Filhos</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow"
        >
          + Adicionar filho
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {children.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar emoji={child.avatar} color={child.color} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{child.name}</p>
                <p className="text-sm text-amber-500 font-semibold">⭐ {child.stars} estrelas</p>
                <p className="text-sm text-sky-600 font-semibold">
                  🕹️ {formatMinutes(child.screenTimeMinutes)} de tela
                </p>
                {child.moneyBalance > 0 && (
                  <p className="text-sm text-emerald-600 font-semibold">
                    💰 R$ {child.moneyBalance.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openEdit(child.id)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold"
              >
                Editar
              </button>
              <button
                onClick={() => setTimeChildId(child.id)}
                className="flex-1 px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm font-semibold"
              >
                + Tempo de tela
              </button>
              <button
                onClick={() => handleRemove(child.id, child.name)}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold"
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {children.length === 0 && (
          <p className="text-slate-400 col-span-2 text-center py-10">
            Nenhum filho cadastrado. Clique em "Adicionar filho" para começar.
          </p>
        )}
      </div>

      {(showAdd || editingId) && (
        <Modal title={editingId ? "Editar filho" : "Adicionar filho"} onClose={() => { setShowAdd(false); setEditingId(null); }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da criança"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Avatar</label>
              <EmojiPicker value={avatar} onChange={setAvatar} options={CHILD_AVATAR_OPTIONS} />
            </div>
            <button
              onClick={editingId ? saveEdit : saveNew}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold"
            >
              Salvar
            </button>
          </div>
        </Modal>
      )}

      {timeChildId && (
        <Modal title="Adicionar tempo de tela" onClose={() => setTimeChildId(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Some minutos ao banco de tempo de tela de{" "}
              <strong>{children.find((c) => c.id === timeChildId)?.name}</strong>.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setTimeAmount((v) => Math.max(5, v - 5))}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-xl font-bold"
              >
                −
              </button>
              <span className="text-3xl font-extrabold text-slate-800 w-24 text-center">
                {timeAmount} min
              </span>
              <button
                onClick={() => setTimeAmount((v) => v + 5)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-xl font-bold"
              >
                +
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  addScreenTime(timeChildId, timeAmount, "Adicionado manualmente pelos pais");
                  setTimeChildId(null);
                  setTimeAmount(15);
                }}
                className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
              >
                Adicionar
              </button>
              <button
                onClick={() => {
                  addScreenTime(timeChildId, -timeAmount, "Removido manualmente pelos pais");
                  setTimeChildId(null);
                  setTimeAmount(15);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                Remover
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
