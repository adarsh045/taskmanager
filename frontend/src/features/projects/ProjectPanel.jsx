import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Panel from "../../components/ui/Panel";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function createInitialForm(currentUser) {
  return {
    name: "",
    description: "",
    owner: currentUser?._id || "",
    members: []
  };
}

export default function ProjectPanel({
  currentUser,
  users,
  projects,
  isBusy,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateProjectMembers
}) {
  const [form, setForm] = useState(createInitialForm(currentUser));
  const [editingProjectId, setEditingProjectId] = useState("");
  const [memberSelections, setMemberSelections] = useState({});
  const isAdminView = currentUser?.role === "Admin";

  useEffect(() => {
    setForm((previousValue) => ({
      ...previousValue,
      owner: previousValue.owner || currentUser?._id || ""
    }));
  }, [currentUser]);

  function resetForm() {
    setEditingProjectId("");
    setForm(createInitialForm(currentUser));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      owner: form.owner,
      members: form.members
    };

    if (editingProjectId) {
      await onUpdateProject(editingProjectId, {
        name: payload.name,
        description: payload.description,
        owner: payload.owner
      });
    } else {
      await onCreateProject(payload);
    }

    resetForm();
  }

  function startEditing(project) {
    setEditingProjectId(project._id);
    setForm({
      name: project.name,
      description: project.description || "",
      owner: project.owner?._id || "",
      members: project.members?.map((member) => member._id) || []
    });
  }

  async function handleMemberAdd(projectId) {
    const userId = memberSelections[projectId];

    if (!userId) {
      return;
    }

    await onUpdateProjectMembers(projectId, "add", userId);
    setMemberSelections((previousValue) => ({
      ...previousValue,
      [projectId]: ""
    }));
  }

  return (
    <div className={isAdminView ? "grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]" : "grid gap-6"}>
      {isAdminView ? (
        <Panel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Projects</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                {editingProjectId ? "Update project" : "Create project"}
              </h2>
            </div>
            {editingProjectId ? (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="project-name">
                Project name
              </label>
              <Input
                id="project-name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Website redesign"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="project-owner">
                Owner
              </label>
              <Select
                id="project-owner"
                value={form.owner}
                onChange={(event) => setForm({ ...form, owner: event.target.value })}
              >
                <option value="">Select an owner</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="field-label" htmlFor="project-description">
                Description
              </label>
              <Textarea
                id="project-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="What is this project delivering?"
              />
            </div>

            {!editingProjectId ? (
              <div>
                <span className="field-label">Team members</span>
                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  {users.map((user) => {
                    const checked = form.members.includes(user._id);

                    return (
                      <label
                        key={user._id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      >
                        <span>
                          {user.name}
                          <span className="ml-2 text-slate-400">{user.role}</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const nextMembers = event.target.checked
                              ? [...form.members, user._id]
                              : form.members.filter((memberId) => memberId !== user._id);

                            setForm({ ...form, members: nextMembers });
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Button className="w-full" type="submit" disabled={isBusy}>
              {isBusy ? "Saving..." : editingProjectId ? "Update project" : "Create project"}
            </Button>
          </form>
        </Panel>
      ) : null}

      <Panel>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Project list</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Active delivery tracks</h2>
          </div>
          <Badge tone="teal">{projects.length} projects</Badge>
        </div>

        <div className="mt-6 space-y-4">
          {projects.length === 0 ? (
            <EmptyState title="No projects yet" description="Create your first project to start assigning work." />
          ) : (
            projects.map((project) => {
              const ownerId = project.owner?._id;
              const availableUsers = users.filter(
                (user) => !(project.members || []).some((member) => member._id === user._id)
              );

              return (
                <div key={project._id} className="rounded-[28px] border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-950">{project.name}</h3>
                        <Badge tone="slate">Owner: {project.owner?.name}</Badge>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {project.description || "No project description added yet."}
                      </p>
                    </div>

                    {isAdminView ? (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => startEditing(project)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => onDeleteProject(project._id)} disabled={isBusy}>
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <p className="field-label">Members</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.members || []).map((member) => (
                        <span
                          key={member._id}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
                        >
                          {member.name}
                          {isAdminView && member._id !== ownerId ? (
                            <button
                              className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-red-600"
                              onClick={() => onUpdateProjectMembers(project._id, "remove", member._id)}
                            >
                              x
                            </button>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isAdminView ? (
                    <div className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_auto]">
                      <Select
                        value={memberSelections[project._id] || ""}
                        onChange={(event) =>
                          setMemberSelections((previousValue) => ({
                            ...previousValue,
                            [project._id]: event.target.value
                          }))
                        }
                      >
                        <option value="">Add a team member</option>
                        {availableUsers.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.role})
                          </option>
                        ))}
                      </Select>
                      <Button
                        variant="secondary"
                        onClick={() => handleMemberAdd(project._id)}
                        disabled={!memberSelections[project._id] || isBusy}
                      >
                        Add member
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </Panel>
    </div>
  );
}
