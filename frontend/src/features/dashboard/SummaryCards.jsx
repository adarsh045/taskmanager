import Panel from "../../components/ui/Panel";

const summaryItems = [
  { key: "total", label: "All tasks", accent: "from-slate-900 to-slate-700" },
  { key: "todo", label: "Todo", accent: "from-orange-500 to-amber-500" },
  { key: "inProgress", label: "In progress", accent: "from-teal-600 to-cyan-500" },
  { key: "completed", label: "Completed", accent: "from-emerald-600 to-lime-500" },
  { key: "overdue", label: "Overdue", accent: "from-rose-600 to-red-500" }
];

export default function SummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {summaryItems.map((item) => (
        <Panel key={item.key} className="overflow-hidden p-0">
          <div className={`h-2 w-full bg-gradient-to-r ${item.accent}`} />
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
            <p className="mt-4 text-4xl font-bold text-slate-950">{summary?.[item.key] ?? 0}</p>
          </div>
        </Panel>
      ))}
    </div>
  );
}

