import { useEffect, useRef, useState } from "react";
import type { Task } from "../../types";
import { formatClock } from "../../lib/schedule";
import { startAlarm, playBeep } from "../../lib/audio";
import { useStore } from "../../store/useStore";

interface TaskTimerModalProps {
  task: Task;
  childId: string;
  onClose: () => void;
}

type Phase = "setup" | "running" | "paused" | "finished";

export function TaskTimerModal({ task, childId, onClose }: TaskTimerModalProps) {
  const completeTask = useStore((s) => s.completeTask);
  const [totalSeconds, setTotalSeconds] = useState(task.durationMinutes * 60);
  const [remaining, setRemaining] = useState(task.durationMinutes * 60);
  const [phase, setPhase] = useState<Phase>("setup");
  const [done, setDone] = useState(false);
  const alarmStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && remaining === 0) {
      setPhase("finished");
      alarmStopRef.current = startAlarm();
    }
  }, [remaining, phase]);

  useEffect(() => {
    return () => {
      alarmStopRef.current?.();
    };
  }, []);

  const stopAlarm = () => {
    alarmStopRef.current?.();
    alarmStopRef.current = null;
  };

  const adjustSetup = (deltaSeconds: number) => {
    setTotalSeconds((t) => Math.max(30, t + deltaSeconds));
    setRemaining((t) => Math.max(30, t + deltaSeconds));
  };

  const start = () => {
    playBeep(660, 120);
    setPhase("running");
  };

  const pause = () => setPhase("paused");
  const resume = () => setPhase("running");

  const addMinuteWhileRunning = () => setRemaining((r) => r + 60);

  const restart = () => {
    stopAlarm();
    setRemaining(totalSeconds);
    setPhase("setup");
  };

  const finishTask = () => {
    stopAlarm();
    completeTask(task.id, childId);
    setDone(true);
    setPhase("setup");
  };

  const progress = totalSeconds > 0 ? 1 - remaining / totalSeconds : 0;

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-1">Muito bem!</h2>
          <p className="text-slate-500 mb-4">
            {task.title} concluída. {task.requiresApproval ? "Aguardando aprovação dos pais." : `Você ganhou ⭐ ${task.stars}!`}
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={`bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl transition ${
          phase === "finished" ? "animate-alarm ring-4 ring-red-400" : ""
        }`}
      >
        <div className="text-4xl mb-1">{task.icon}</div>
        <h2 className="text-lg font-extrabold text-slate-800 mb-4">{task.title}</h2>

        <div className="relative w-48 h-48 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={phase === "finished" ? "#ef4444" : "#8b5cf6"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-mono font-extrabold text-slate-800">
              {formatClock(phase === "setup" ? totalSeconds : remaining)}
            </span>
          </div>
        </div>

        {phase === "setup" && (
          <>
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={() => adjustSetup(-60)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-lg"
              >
                −1m
              </button>
              <button
                onClick={() => adjustSetup(-10)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-xs"
              >
                −10s
              </button>
              <button
                onClick={() => adjustSetup(10)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-xs"
              >
                +10s
              </button>
              <button
                onClick={() => adjustSetup(60)}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-lg"
              >
                +1m
              </button>
            </div>
            <button
              onClick={start}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg mb-2"
            >
              ▶️ Começar
            </button>
          </>
        )}

        {(phase === "running" || phase === "paused") && (
          <>
            <div className="flex gap-2 mb-2">
              {phase === "running" ? (
                <button
                  onClick={pause}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-white font-bold"
                >
                  ⏸️ Pausar
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                >
                  ▶️ Continuar
                </button>
              )}
              <button
                onClick={addMinuteWhileRunning}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                +1m
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 mb-2">
              Reiniciar timer
            </button>
          </>
        )}

        {phase === "finished" && (
          <div className="mb-2">
            <p className="text-red-500 font-extrabold mb-3 text-lg">⏰ Tempo esgotado!</p>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  stopAlarm();
                  setRemaining(300);
                  setTotalSeconds(300);
                  setPhase("running");
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                +5 min
              </button>
            </div>
          </div>
        )}

        <button
          onClick={finishTask}
          className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold mt-1"
        >
          ✅ Concluir tarefa
        </button>
        <button onClick={onClose} className="w-full py-2 mt-1 text-slate-400 hover:text-slate-600 text-sm">
          Fechar sem concluir
        </button>
      </div>
    </div>
  );
}
