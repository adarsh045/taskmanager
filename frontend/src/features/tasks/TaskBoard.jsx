import { useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Panel from "../../components/ui/Panel";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import TaskCard from "./TaskCard";

function buildInitialTaskForm() {
  return {
    project: "",
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assignedTo: ""
  };
}

export default function TaskBoard({
  currentUser,
  projects,
  tasks,
  isBusy,
  onCreateTask,
  onUpdateStatus,
  onDeleteTask,
  onAddComment
}) {
  const [form, setForm] = useState(buildInitialTaskForm());
  const selectedProject = projects.find((project) => project._id === form.project);
  const assigneeOptions = selectedProject?.members || [];
  const isAdminView = currentUser?.role === "Admin";

  const orderedTasks = [...tasks].sort(
    (leftTask, rightTask) => new Date(leftTask.deadline) - new Date(rightTask.deadline)
  );

  async function handleSubmit(event) {
    event.preventDefault();

    await onCreateTask({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : ""
    });

    setForm(buildInitialTaskForm());
  }

  return (
    <div className={isAdminView ? "grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]" : "grid gap-6"}>
      {isAdminView ? (
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Tasks</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Create and assign work</h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="task-project">
                Project
              </label>
              <Select
                id="task-project"
                value={form.project}
                onChange={(event) =>
                  setForm({
                    ...form,
                    project: event.target.value,
                    assignedTo: ""
                  })
                }
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="field-label" htmlFor="task-title">
                Task title
              </label>
              <Input
                id="task-title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Prepare staging release notes"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="task-description">
                Description
              </label>
              <Textarea
                id="task-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Describe the expected deliverable and any dependencies."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="task-priority">
                  Priority
                </label>
                <Select
                  id="task-priority"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  {["Low", "Medium", "High", "Urgent"].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="field-label" htmlFor="task-deadline">
                  Deadline
                </label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(event) => setForm({ ...form, deadline: event.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="task-assignee">
                Assign to
              </label>
              <Select
                id="task-assignee"
                value={form.assignedTo}
                onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
                required
                disabled={!selectedProject}
              >
                <option value="">{selectedProject ? "Select a member" : "Choose a project first"}</option>
                {assigneeOptions.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </Select>
            </div>

            <Button className="w-full" type="submit" disabled={isBusy}>
              {isBusy ? "Saving..." : "Create task"}
            </Button>
          </form>
        </Panel>
      ) : null}

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Task board</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Execution across the team</h2>
          </div>
          <Badge tone="orange">{tasks.length} visible tasks</Badge>
        </div>

        <div className="mt-6 space-y-4">
          {orderedTasks.length === 0 ? (
            <EmptyState title="No tasks match this filter" description="Change the status filter or create a task to get started." />
          ) : (
            orderedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                currentUser={currentUser}
                isBusy={isBusy}
                onUpdateStatus={onUpdateStatus}
                onDeleteTask={onDeleteTask}
                onAddComment={onAddComment}
              />
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
