const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  getUsers: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(`${API_BASE}/users?${params}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  saveUsers: async (rows: any[]): Promise<any> => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rows }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to save users");
    }

    return res.json();
  },
};
