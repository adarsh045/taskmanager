export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-teal-600" />
      <span>{label}</span>
    </div>
  );
}

