import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  secondary: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  subtle: "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
};

export default function Button({
  type = "button",
  variant = "primary",
  className,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

