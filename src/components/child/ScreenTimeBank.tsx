import { useEffect, useRef, useState } from "react";
import { useStore } from "../../store/useStore";
import { formatClock, formatMinutes } from "../../lib/schedule";
import { startAlarm } from "../../lib/audio";

interface ScreenTimeBankProps {
  childId: string;
  balanceMinutes: number;
}

export function ScreenTimeBank({ childId, balanceMinutes }: ScreenTimeBankProps) {
  const addScreenTime = useStore((s) => s.addScreenTime);
  const [session, setSession] = useState<{ minutes: number; remaining: number; running: boolean } | null>(null);
  const alarmStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!session?.running) return;
    const interval = setInterval(() => {
      setSession((s) => {
        if (!s) return s;
        if (s.remaining <= 1) {
          clearInterval(interval);
          return { ...s, remaining: 0, running: false };
        }
        return { ...s, remaining: s.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.running]);

  useEffect(() => {
    if (session && session.remaining === 0 && !session.running && !alarmStopRef.current) {
      alarmStopRef.current = startAlarm();
    }
  }, [session]);

  useEffect(() => () => alarmStopRef.current?.(), []);

  const startSession = (minutes: number) => {
    if (minutes <= 0 || minutes > balanceMinutes) return;
    setSession({ minutes, remaining: minutes * 60, running: true });
  };

  const endSession = () => {
    if (!session) return;
    alarmStopRef.current?.();
    alarmStopRef.current = null;
    const usedSeconds = session.minutes * 60 - session.remaining;
    const usedMinutes = Math.max(1, Math.ceil(usedSeconds / 60));
    addScreenTime(childId, -usedMinutes, "Tempo de tela usado");
    setSession(null);
  };

  const quickAdd = (minutes: number) => addScreenTime(childId, minutes, "Adicionado pela criança");

  return (
    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg mb-6">
      <p className="text-sky-100 text-sm font-semibold mb-1">🕹️ Banco de tempo de tela</p>
      <p className="text-4xl font-extrabold mb-4">{formatMinutes(balanceMinutes)}</p>

      {!session && (
        <>
          <div className="flex gap-2 mb-3 flex-wrap">
            {[15, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => startSession(m)}
                disabled={m > balanceMinutes}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
              >
                ▶️ Usar {m} min
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => quickAdd(5)}
              className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm"
            >
              + Registrar 5 min ganho
            </button>
          </div>
        </>
      )}

      {session && (
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <p className="text-3xl font-mono font-extrabold mb-3">{formatClock(session.remaining)}</p>
          {session.remaining === 0 ? (
            <p className="font-bold mb-3 animate-pulse">⏰ Tempo acabou!</p>
          ) : (
            <div className="flex gap-2 justify-center mb-2">
              <button
                onClick={() => setSession((s) => (s ? { ...s, running: !s.running } : s))}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 font-bold text-sm"
              >
                {session.running ? "⏸️ Pausar" : "▶️ Continuar"}
              </button>
            </div>
          )}
          <button
            onClick={endSession}
            className="w-full py-2.5 rounded-xl bg-white text-sky-700 font-bold text-sm mt-1"
          >
            Encerrar
          </button>
        </div>
      )}
    </div>
  );
}
