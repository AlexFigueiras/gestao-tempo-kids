let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new AudioContext();
  return ctx;
};

/** Toca um único beep curto (usado em cliques/feedback). */
export const playBeep = (frequency = 880, durationMs = 150) => {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + durationMs / 1000 + 0.02);
};

/** Toca um alarme repetido (tripla batida) até ser parado. Retorna função de cleanup. */
export const startAlarm = (): (() => void) => {
  let stopped = false;
  const cycle = () => {
    if (stopped) return;
    playBeep(1046, 160);
    setTimeout(() => !stopped && playBeep(1046, 160), 220);
    setTimeout(() => !stopped && playBeep(1318, 220), 440);
  };
  cycle();
  const interval = setInterval(cycle, 1200);
  return () => {
    stopped = true;
    clearInterval(interval);
  };
};
