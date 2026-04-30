import { cn } from "../../utils/cn";

const tones = {
  slate: "bg-slate-100 text-slate-700",
  teal: "bg-teal-100 text-teal-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  emerald: "bg-emerald-100 text-emerald-800"
};

export default function Badge({ tone = "slate", className, children }) {
  return (
    <span
      className={cn(
        "status-ring inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

