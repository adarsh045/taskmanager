import { useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { formatDate } from "../../utils/date";

const taskStatusOptions = ["Todo", "In Progress", "Completed"];

function getPriorityTone(priority) {
  if (priority === "Urgent" || priority === "High") {
    return "red";
  }

  if (priority === "Medium") {
    return "orange";
  }

  return "teal";
}

function getStatusTone(status) {
  if (status === "Completed") {
    return "emerald";
  }

  if (status === "In Progress") {
    return "teal";
  }

  return "slate";
}

export default function TaskCard({
  task,
  currentUser,
  isBusy,
  onUpdateStatus,
  onDeleteTask,
  onAddComment
}) {
  const [comment, setComment] = useState("");
  const canUpdateStatus =
    currentUser?.role === "Admin" || currentUser?._id === task.assignedTo?._id;
  const canDeleteTask = currentUser?.role === "Admin";
  const hasTaskActions = canUpdateStatus || canDeleteTask;
  const isMemberView = currentUser?.role === "Member";

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    await onAddComment(task._id, comment);
    setComment("");
  }

  return (
    <div
      className={`rounded-[30px] border p-5 transition ${
        task.isOverdue
          ? "border-red-200 bg-red-50/70"
          : "border-slate-200 bg-white/90"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-xl font-bold text-slate-950">{task.title}</h3>
            <Badge tone={getPriorityTone(task.priority)}>{task.priority}</Badge>
            <Badge tone={getStatusTone(task.status)}>{task.status}</Badge>
            {task.isOverdue ? <Badge tone="red">Overdue</Badge> : null}
          </div>

          <p className="mt-3 break-words text-sm leading-6 text-slate-500">
            {task.description || "No task description added."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Project: {task.project?.name}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Assigned: {task.assignedTo?.name}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Deadline: {formatDate(task.deadline)}</span>
          </div>
        </div>

        {hasTaskActions ? (
          <div className="flex min-w-[220px] max-w-full flex-col gap-3 lg:w-[240px]">
            {canUpdateStatus ? (
              <Select
                value={task.status}
                onChange={(event) => onUpdateStatus(task._id, event.target.value)}
                disabled={isBusy}
              >
                {taskStatusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </Select>
            ) : null}

            {canDeleteTask ? (
              <Button variant="danger" onClick={() => onDeleteTask(task._id)} disabled={isBusy}>
                Delete task
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className={`mt-6 grid items-start gap-4 rounded-[26px] border border-slate-200 bg-slate-50 p-4 ${
          isMemberView
            ? "md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_280px]"
            : "lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]"
        }`}
      >
        <div className="min-w-0">
          <p className="field-label">Comments</p>

          <div className={`space-y-3 ${isMemberView ? "md:max-h-[260px] md:overflow-y-auto md:pr-1" : ""}`}>
            {task.comments?.length ? (
              task.comments.map((entry) => (
                <div key={entry._id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="min-w-0 break-words text-sm font-semibold text-slate-800">
                      {entry.author?.name || "Team member"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-500">
                    {entry.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                No comments yet. Start the task conversation here.
              </div>
            )}
          </div>
        </div>

        <form className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4" onSubmit={handleCommentSubmit}>
          <p className="field-label">Add comment</p>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share a progress update or blocker..."
            className={isMemberView ? "min-h-[96px] resize-y md:min-h-[120px]" : "min-h-[120px] resize-y lg:min-h-[180px]"}
          />
          <Button className="mt-4 w-full" type="submit" disabled={isBusy}>
            Add comment
          </Button>
        </form>
      </div>
    </div>
  );
}
