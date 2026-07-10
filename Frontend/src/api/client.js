const DEFAULT_BASE_URL = "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    body = null;
  }
  if (!res.ok) {
    const detail =
      body && body.detail
        ? typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail)
        : null;
    throw new ApiError(detail || `Request failed (${res.status})`, res.status);
  }
  return body;
}

export function createApiClient(getBaseUrl, getToken) {
  const authHeaders = (extra = {}) => {
    const token = getToken();
    return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
  };

  return {
    async register(email, password) {
      const res = await fetch(`${getBaseUrl()}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return parseResponse(res);
    },

    async login(email, password) {
      const form = new URLSearchParams();
      form.set("username", email);
      form.set("password", password);
      const res = await fetch(`${getBaseUrl()}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      return parseResponse(res);
    },

    async uploadFiles(files) {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f, f.name));
      const res = await fetch(`${getBaseUrl()}/codebase/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      return parseResponse(res);
    },

    async ask(query) {
      const res = await fetch(`${getBaseUrl()}/codebase/ask`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ query }),
      });
      return parseResponse(res);
    },

    async viva() {
      const res = await fetch(`${getBaseUrl()}/codebase/viva`, {
        method: "POST",
        headers: authHeaders(),
      });
      return parseResponse(res);
    },

    async status() {
      const res = await fetch(`${getBaseUrl()}/codebase/status`, {
        headers: authHeaders(),
      });
      return parseResponse(res);
    },

    async endSession() {
      const res = await fetch(`${getBaseUrl()}/codebase/session`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      return parseResponse(res);
    },
  };
}

export { ApiError, DEFAULT_BASE_URL };
