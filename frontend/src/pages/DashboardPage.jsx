import { useEffect, useState } from "react";
import { dashboardApi, projectApi, taskApi, userApi } from "../api/client";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/ui/Loader";
import Panel from "../components/ui/Panel";
import Select from "../components/ui/Select";
import SummaryCards from "../features/dashboard/SummaryCards";
import ProjectPanel from "../features/projects/ProjectPanel";
import TaskBoard from "../features/tasks/TaskBoard";
import { useAuth } from "../contexts/AuthContext";

const initialSummary = {
  total: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0
};

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState("All");
  const [summary, setSummary] = useState(initialSummary);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      try {
        setIsLoading(true);

        const [overviewResponse, projectsResponse, usersResponse] = await Promise.all([
          dashboardApi.getOverview(token, statusFilter === "All" ? {} : { status: statusFilter }),
          projectApi.list(token),
          userApi.list(token)
        ]);

        if (!isMounted) {
          return;
        }

        setSummary(overviewResponse.data.summary || initialSummary);
        setTasks(overviewResponse.data.tasks || []);
        setProjects(projectsResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch (error) {
        if (error.message.toLowerCase().includes("token")) {
          logout();
          return;
        }

        if (isMounted) {
          setNotice({
            type: "error",
            message: error.message
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [refreshTick, statusFilter, token]);

  function refreshWorkspace(message, type = "success") {
    setNotice(
      message
        ? {
            type,
            message
          }
        : null
    );
    setRefreshTick((previousValue) => previousValue + 1);
  }

  async function runAction(action, successMessage) {
    try {
      setIsSaving(true);
      await action();
      refreshWorkspace(successMessage, "success");
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="section-card flex min-h-[70vh] items-center justify-center">
        <Loader label="Loading workspace data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Panel className="overflow-hidden bg-slate-950 p-0 text-white">
        <div className="mesh-background grid gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">Delivery overview</p>
            <h1 className="mt-3 text-4xl font-bold">Keep work visible, assign fast, and catch risk early.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Filter the dashboard by status, watch overdue tasks stand out, and keep project ownership clear across the whole team.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="field-label text-slate-300">Task status filter</p>
            <Select
              className="border-white/10 bg-white/10 text-white focus:border-teal-300"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {["All", "Todo", "In Progress", "Completed"].map((option) => (
                <option key={option} value={option} className="text-slate-900">
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Panel>

      {notice ? (
        <div
          className={`rounded-3xl border px-5 py-4 text-sm ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <SummaryCards summary={summary} />

      <ProjectPanel
        currentUser={user}
        users={users}
        projects={projects}
        isBusy={isSaving}
        onCreateProject={(payload) => runAction(() => projectApi.create(token, payload), "Project created successfully.")}
        onUpdateProject={(projectId, payload) =>
          runAction(() => projectApi.update(token, projectId, payload), "Project updated successfully.")
        }
        onDeleteProject={(projectId) =>
          runAction(() => projectApi.remove(token, projectId), "Project deleted successfully.")
        }
        onUpdateProjectMembers={(projectId, action, userId) =>
          runAction(
            () => projectApi.updateMembers(token, projectId, { action, userId }),
            "Project members updated successfully."
          )
        }
      />

      <TaskBoard
        currentUser={user}
        projects={projects}
        tasks={tasks}
        isBusy={isSaving}
        onCreateTask={(payload) => runAction(() => taskApi.create(token, payload), "Task created successfully.")}
        onUpdateStatus={(taskId, status) =>
          runAction(() => taskApi.update(token, taskId, { status }), "Task status updated successfully.")
        }
        onDeleteTask={(taskId) => runAction(() => taskApi.remove(token, taskId), "Task deleted successfully.")}
        onAddComment={(taskId, message) =>
          runAction(() => taskApi.addComment(token, taskId, { message }), "Comment added successfully.")
        }
      />

      {!tasks.length && !projects.length ? (
        <EmptyState
          title="Your workspace is clean and ready"
          description="Create a project and assign the first task to start collaborating."
        />
      ) : null}
    </div>
  );
}
