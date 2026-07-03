import { useState } from "react";
import { useStore } from "../store/useStore";

interface PinLockProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinLock({ onSuccess, onCancel }: PinLockProps) {
  const pin = useStore((s) => s.settings.parentPin);
  const isDefaultPin = pin === "0000";
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const press = (digit: string) => {
    setError(false);
    const next = (input + digit).slice(0, 4);
    setInput(next);
    if (next.length === 4) {
      if (next === pin) {
        setTimeout(onSuccess, 80);
      } else {
        setError(true);
        setTimeout(() => setInput(""), 400);
      }
    }
  };

  const backspace = () => setInput((i) => i.slice(0, -1));

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center px-6 py-10 text-white">
      <div className="text-4xl mb-3">🔒</div>
      <h1 className="text-xl font-bold mb-1">Área dos Pais</h1>
      <p className="text-slate-400 text-sm mb-6">Digite o PIN de 4 dígitos</p>

      <div className={`flex gap-4 mb-6 ${error ? "animate-[shake_0.3s]" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < input.length ? "bg-white border-white" : "border-slate-500"
            } ${error ? "!bg-red-500 !border-red-500" : ""}`}
          />
        ))}
      </div>

      {isDefaultPin && (
        <p className="text-xs text-amber-400 mb-4">Dica: PIN padrão é 0000 (altere em Configurações)</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-2xl font-semibold transition"
          >
            {d}
          </button>
        ))}
        <button
          onClick={onCancel}
          className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
        >
          Cancelar
        </button>
        <button
          onClick={() => press("0")}
          className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-2xl font-semibold transition"
        >
          0
        </button>
        <button
          onClick={backspace}
          className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-white text-xl"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
