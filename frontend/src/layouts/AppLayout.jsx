import { NavLink, Outlet } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="section-card mesh-background flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white">
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">Assignment 1</p>
              <h1 className="mt-3 text-3xl font-bold">Team Task Manager</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                A focused workspace for projects, tasks, comments, and delivery accountability.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-teal-500 text-white" : "bg-white/5 text-slate-200 hover:bg-white/10"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Signed in</p>
            <p className="mt-3 text-lg font-semibold">{user?.name}</p>
            <p className="mt-1 text-sm text-slate-300">{user?.email}</p>
            <p className="mt-1 text-sm text-teal-200">{user?.role}</p>
            <Button className="mt-5 w-full" variant="subtle" onClick={logout}>
              Log out
            </Button>
          </div>
        </aside>

        <main className="overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

