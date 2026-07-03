import { useState } from "react";
import { useStore } from "../../store/useStore";

export function SettingsTab() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetAllData = useStore((s) => s.resetAllData);

  const [familyName, setFamilyName] = useState(settings.familyName);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const saveFamilyName = () => {
    if (!familyName.trim()) return;
    updateSettings({ familyName: familyName.trim() });
    setMessage("Nome da família atualizado!");
    setTimeout(() => setMessage(null), 2000);
  };

  const savePin = () => {
    if (!/^\d{4}$/.test(pin)) {
      setMessage("O PIN deve ter exatamente 4 números.");
      return;
    }
    if (pin !== pinConfirm) {
      setMessage("Os PINs não coincidem.");
      return;
    }
    updateSettings({ parentPin: pin });
    setPin("");
    setPinConfirm("");
    setMessage("PIN atualizado com sucesso!");
    setTimeout(() => setMessage(null), 2000);
  };

  const handleReset = () => {
    if (confirm("Isso vai apagar TODOS os dados (filhos, tarefas, recompensas, histórico). Tem certeza?")) {
      if (confirm("Última confirmação: apagar tudo permanentemente?")) {
        resetAllData();
      }
    }
  };

  return (
    <div className="max-w-lg space-y-8">
      <h2 className="text-xl font-bold text-slate-800">Configurações</h2>

      {message && (
        <div className="bg-violet-50 text-violet-700 px-4 py-3 rounded-xl text-sm font-semibold">{message}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-700">Nome da família</h3>
        <div className="flex gap-2">
          <input
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
          />
          <button
            onClick={saveFamilyName}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm"
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-700">Alterar PIN de acesso</h3>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="Novo PIN (4 dígitos)"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
        />
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="Confirme o novo PIN"
          value={pinConfirm}
          onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:outline-none"
        />
        <button
          onClick={savePin}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm"
        >
          Atualizar PIN
        </button>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-200 p-5 space-y-3">
        <h3 className="font-bold text-red-700">Zona de perigo</h3>
        <p className="text-sm text-red-600">
          Apaga todos os filhos, tarefas, recompensas e histórico salvos neste dispositivo.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm"
        >
          Apagar todos os dados
        </button>
      </div>
    </div>
  );
}
