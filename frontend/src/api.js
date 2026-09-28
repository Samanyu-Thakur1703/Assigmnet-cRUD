const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = localStorage.getItem("accessToken");

export const setAccessToken = (token) => {
  accessToken = token;

  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

const request = async (path, options = {}, retry = true) => {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  // If the short-lived access token expired, silently refresh it once.
  if (response.status === 401 && retry && path !== "/auth/refresh-token" && path !== "/auth/login") {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include"
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      setAccessToken(refreshData.accessToken);
      return request(path, options, false);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: async (payload) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setAccessToken(data.accessToken);
    return data;
  },

  refresh: async () => {
    const data = await request("/auth/refresh-token", {
      method: "POST"
    }, false);
    setAccessToken(data.accessToken);
    return data;
  },

  logout: async () => {
    try {
      return await request("/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
    }
  },

  me: () => request("/auth/me"),

  getProducts: () => request("/products"),

  createProduct: (payload) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateProduct: (id, payload) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: "DELETE"
    })
};
