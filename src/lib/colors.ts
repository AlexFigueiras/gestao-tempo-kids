export type ChildColor = "violet" | "sky" | "rose" | "amber" | "emerald" | "orange";

interface ColorSet {
  solid: string; // bg-*-500 text-white
  soft: string; // bg-*-100 text-*-700
  border: string;
  ring: string;
  text: string;
  gradient: string;
}

export const COLOR_SETS: Record<ChildColor, ColorSet> = {
  violet: {
    solid: "bg-violet-500 text-white",
    soft: "bg-violet-100 text-violet-700",
    border: "border-violet-300",
    ring: "ring-violet-400",
    text: "text-violet-600",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  sky: {
    solid: "bg-sky-500 text-white",
    soft: "bg-sky-100 text-sky-700",
    border: "border-sky-300",
    ring: "ring-sky-400",
    text: "text-sky-600",
    gradient: "from-sky-400 to-blue-500",
  },
  rose: {
    solid: "bg-rose-500 text-white",
    soft: "bg-rose-100 text-rose-700",
    border: "border-rose-300",
    ring: "ring-rose-400",
    text: "text-rose-600",
    gradient: "from-rose-400 to-pink-500",
  },
  amber: {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-100 text-amber-700",
    border: "border-amber-300",
    ring: "ring-amber-400",
    text: "text-amber-600",
    gradient: "from-amber-400 to-orange-500",
  },
  emerald: {
    solid: "bg-emerald-500 text-white",
    soft: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-300",
    ring: "ring-emerald-400",
    text: "text-emerald-600",
    gradient: "from-emerald-400 to-teal-500",
  },
  orange: {
    solid: "bg-orange-500 text-white",
    soft: "bg-orange-100 text-orange-700",
    border: "border-orange-300",
    ring: "ring-orange-400",
    text: "text-orange-600",
    gradient: "from-orange-400 to-red-500",
  },
};

export const colorOf = (color: string): ColorSet =>
  COLOR_SETS[color as ChildColor] ?? COLOR_SETS.violet;
