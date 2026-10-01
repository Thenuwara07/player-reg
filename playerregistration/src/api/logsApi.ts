const API_BASE_URL = import.meta.env.VITE_API_URL;

export type ActivityLog = {
  id: number;
  createdAt: string; // ISO date-time, e.g. 2026-10-01T19:56:45.000Z
  userId: number | null;
  role: string; // player | admin | guest
  description: string;
  user: { firstName: string; lastName: string; email: string } | null;
};

export type ActivityLogFilters = {
  from?: string; // ISO date-time
  to?: string; // ISO date-time
  user?: string; // name / email search, or a user id
  role?: string;
  page?: number;
  pageSize?: number;
};

export type ActivityLogsResponse = {
  success: boolean;
  data: ActivityLog[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
};

// Admin only: activity logs, newest first
export const getActivityLogs = async (
  filters: ActivityLogFilters = {}
): Promise<ActivityLogsResponse> => {
  const token = sessionStorage.getItem("authToken");
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const response = await fetch(`${API_BASE_URL}/admin/logs?${params}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Failed to load logs");
  }
  return json as ActivityLogsResponse;
};
