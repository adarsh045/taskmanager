import { cn } from "../../utils/cn";

export default function Panel({ className, children }) {
  return <div className={cn("section-card p-6", className)}>{children}</div>;
}

