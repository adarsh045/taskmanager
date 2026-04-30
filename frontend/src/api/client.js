const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function buildUrl(path, query = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString();
  return `${API_BASE_URL}${path}${suffix ? `?${suffix}` : ""}`;
}

async function request(path, options = {}) {
  const { token, method = "GET", body, query, headers = {} } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response."
  }));

  if (!response.ok) {
    const details = payload.details?.length ? ` ${payload.details.join(" ")}` : "";
    throw new Error(`${payload.message || "Request failed."}${details}`.trim());
  }

  return payload;
}

export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token })
};

export const dashboardApi = {
  getOverview: (token, query) => request("/dashboard/overview", { token, query })
};

export const projectApi = {
  list: (token) => request("/projects", { token }),
  create: (token, payload) => request("/projects", { token, method: "POST", body: payload }),
  update: (token, id, payload) => request(`/projects/${id}`, { token, method: "PUT", body: payload }),
  remove: (token, id) => request(`/projects/${id}`, { token, method: "DELETE" }),
  updateMembers: (token, id, payload) =>
    request(`/projects/${id}/members`, { token, method: "PATCH", body: payload })
};

export const taskApi = {
  list: (token, query) => request("/tasks", { token, query }),
  create: (token, payload) => request("/tasks", { token, method: "POST", body: payload }),
  update: (token, id, payload) => request(`/tasks/${id}`, { token, method: "PUT", body: payload }),
  remove: (token, id) => request(`/tasks/${id}`, { token, method: "DELETE" }),
  addComment: (token, id, payload) =>
    request(`/tasks/${id}/comments`, { token, method: "POST", body: payload })
};

export const userApi = {
  list: (token) => request("/users", { token })
};

