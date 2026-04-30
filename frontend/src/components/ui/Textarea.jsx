import { cn } from "../../utils/cn";

export default function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
        className
      )}
      {...props}
    />
  );
}

