const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ошибка запроса");
  }
  return data;
}

export const api = {
  API_URL,
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  changePassword: (payload) => request("/api/auth/password", { method: "PUT", body: payload }),

  topics: () => request("/api/problems/topics"),
  practiceSet: (count, topic) =>
    request(`/api/problems/practice-set?count=${count}${topic ? `&topic=${encodeURIComponent(topic)}` : ""}`),

  startSession: () => request("/api/practice/start", { method: "POST" }),
  submitAttempt: (payload) => request("/api/practice/attempt", { method: "POST", body: payload }),
  finishSession: (sessionId) => request("/api/practice/finish", { method: "POST", body: { sessionId } }),
  leaderboard: () => request("/api/practice/leaderboard"),
  history: () => request("/api/practice/history"),

  adminList: () => request("/api/problems/admin/all"),
  adminCreate: (formData) => request("/api/problems/admin", { method: "POST", body: formData, isForm: true }),
  adminUpdate: (id, formData) => request(`/api/problems/admin/${id}`, { method: "PUT", body: formData, isForm: true }),
  adminDelete: (id) => request(`/api/problems/admin/${id}`, { method: "DELETE" }),
};
