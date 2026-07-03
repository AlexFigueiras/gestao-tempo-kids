import { useStore } from "../store/useStore";
import { Avatar } from "./shared/Avatar";

interface ProfileSelectorProps {
  onSelectChild: (childId: string) => void;
  onSelectParent: () => void;
}

export function ProfileSelector({ onSelectChild, onSelectParent }: ProfileSelectorProps) {
  const children = useStore((s) => s.children);
  const familyName = useStore((s) => s.settings.familyName);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-violet-50 via-white to-sky-50 flex flex-col items-center px-6 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-2">🌟</div>
        <h1 className="text-2xl font-extrabold text-slate-800">{familyName}</h1>
        <p className="text-slate-500 mt-1">Quem está usando o app?</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child.id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="transition group-hover:scale-105 group-active:scale-95">
              <Avatar emoji={child.avatar} color={child.color} size="xl" />
            </div>
            <span className="font-bold text-slate-700">{child.name}</span>
            <span className="text-sm text-amber-500 font-semibold">⭐ {child.stars}</span>
          </button>
        ))}

        {children.length === 0 && (
          <p className="text-slate-400 max-w-xs text-center">
            Nenhuma criança cadastrada ainda. Entre na área dos pais para adicionar.
          </p>
        )}
      </div>

      <button
        onClick={onSelectParent}
        className="mt-14 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 text-white font-semibold shadow-lg hover:bg-slate-700 active:scale-95 transition"
      >
        <span className="text-xl">🔒</span> Área dos Pais
      </button>
    </div>
  );
}
