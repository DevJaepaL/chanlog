export type AccentColor =
  | "sky"
  | "purple"
  | "pink"
  | "orange"
  | "teal"
  | "green";

const DOT: Record<AccentColor, string> = {
  sky: "bg-accent-sky",
  purple: "bg-accent-purple",
  pink: "bg-accent-pink",
  orange: "bg-accent-orange",
  teal: "bg-accent-teal",
  green: "bg-accent-green",
};

export const accentDotClass = (accent: AccentColor) => DOT[accent];
