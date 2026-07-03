interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  options: string[];
}

export function EmojiPicker({ value, onChange, options }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {options.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition ${
            value === emoji
              ? "bg-violet-500 scale-110 shadow-md"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export const CHILD_AVATAR_OPTIONS = [
  "🦁", "🐯", "🐻", "🐼", "🦊", "🐰", "🐨", "🐸",
  "🐵", "🦄", "🐶", "🐱", "🐷", "🐹", "🦖", "🐙",
  "👦", "👧", "🧒", "👶", "🧑‍🎤", "🦸", "🧚", "🥷",
];

export const TASK_ICON_OPTIONS = [
  "📚", "🦷", "🛏️", "🧹", "🍽️", "🎒", "🧸", "🐕",
  "🌱", "🧺", "🚿", "✏️", "🎹", "⚽", "🧽", "🗑️",
  "🍎", "😴", "🧦", "🪥", "📖", "🎨", "🚲", "🧼",
];

export const REWARD_ICON_OPTIONS = [
  "🎮", "📱", "🍿", "🎬", "🎡", "🍦", "💰", "🧁",
  "🎁", "🏖️", "🎳", "🍕", "🧃", "🎨", "⭐", "🎉",
];
