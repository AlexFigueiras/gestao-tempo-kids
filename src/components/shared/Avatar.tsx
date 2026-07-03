import { colorOf } from "../../lib/colors";

interface AvatarProps {
  emoji: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-9 h-9 text-lg",
  md: "w-12 h-12 text-2xl",
  lg: "w-20 h-20 text-4xl",
  xl: "w-28 h-28 text-6xl",
};

export function Avatar({ emoji, color = "violet", size = "md" }: AvatarProps) {
  const c = colorOf(color);
  return (
    <div
      className={`shrink-0 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-inner ${SIZE_CLASSES[size]}`}
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  );
}
