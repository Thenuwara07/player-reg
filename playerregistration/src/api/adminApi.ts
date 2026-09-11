import {
  PlayerAllData,
  AdminSignupData,
  SignUpResponse,
} from "../types/authTypes";
import {
  User1,
  UpdateTableField,
  ResponseupdateTableField,
  Payment,
  Clubchangedetails,
  UpdateRegDate,
  GetAssClubDetails,
  UpdateTableFields,
} from "../types/index";
import {
  User1 as Player1,
  PlayersResponse,
} from "../types/playerViewDataTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const token = sessionStorage.getItem("authToken");
// console.log("puka", token);

export const Getpendingplayers = async (): Promise<User1[]> => {
  try {
    console.log("10");
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/pendingplayers`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};

export const GetpendingRegplayers = async (): Promise<Payment[]> => {
  try {
    console.log("10");
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/pendingreg`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};

export const GetclubgReq = async (): Promise<Clubchangedetails[]> => {
  try {
    console.log("10");
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/clubchangereq`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};

export const updateTableFeild = async (
  updateTableField: UpdateTableField
): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      id: updateTableField.id,
      table: updateTableField.table,
      column: updateTableField.column,
      value: updateTableField.value,
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/updatefield`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update error");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("update error:", error);
    throw error;
  }
};

export const updateRegDates = async (
  updateRegDate: UpdateRegDate
): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      id: updateRegDate.id,
      regDate: updateRegDate.regDate,
      expDate: updateRegDate.expDate,
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/updatereg`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update error");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("update error:", error);
    throw error;
  }
};

export const GetAssDetails = async (
  type: string,
  assId: number
): Promise<GetAssClubDetails> => {
  try {
    console.log("10");

    // Retrieve the auth token
    const token = sessionStorage.getItem("authToken");

    // Check if token is missing
    // if (!token) {
    //   throw new Error("Authorization token is missing.");
    // }

    // Make the fetch request
    const response = await fetch(
      `${API_BASE_URL}/admin/getassdetails/${type}/${assId}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
          // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "An error occurred while fetching the data.";
      throw new Error(errorMessage);
    }

    // Parse and return the data
    const data = await response.json();
    return data.data; // Assuming the data is inside `data`
  } catch (error) {
    console.error("Error fetching association details:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export const GetClubDetails = async (
  type: string,
  assId: number,
  clubId: number
): Promise<GetAssClubDetails> => {
  try {
    console.log("10");

    // Retrieve the auth token
    const token = sessionStorage.getItem("authToken");

    // Check if token is missing
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Make the fetch request
    const response = await fetch(
      `${API_BASE_URL}/admin/getclubdetails/${type}/${assId}/${clubId}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
          // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "An error occurred while fetching the data.";
      throw new Error(errorMessage);
    }

    // Parse and return the data
    const data = await response.json();
    return data.data; // Assuming the data is inside `data`
  } catch (error) {
    console.error("Error fetching club details:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export const updateTableFeilds = async (
  updateTableFields: UpdateTableFields
): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      id: updateTableFields.id,
      table: updateTableFields.table,
      updates: updateTableFields.updates, // <-- multiple fields
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/updatefields`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update error");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("update error:", error);
    throw error;
  }
};

export const registerAdmin = async (
  adminData: AdminSignupData
): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      fullName: adminData.fullName,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      dateofBirth: adminData.dateOfbirth,
      gender: adminData.gender,
      district: adminData.district,
      nicNum: adminData.idCardNumber,
      email: adminData.email,
      contact: adminData.contactNumber,
      password: adminData.password, // Use the uploaded profile
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/signupadmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const GetAdminDetails = async (): Promise<User1[]> => {
  try {
    console.log("10");

    // Retrieve the auth token
    const token = sessionStorage.getItem("authToken");

    // Check if token is missing
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Make the fetch request
    const response = await fetch(`${API_BASE_URL}/admin/alladmins`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "An error occurred while fetching the data.";
      throw new Error(errorMessage);
    }

    // Parse and return the data
    const data = await response.json();
    return data.data; // Assuming the data is inside `data`
  } catch (error) {
    console.error("Error fetching association details:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export const getNotRegisteredPlayerCount = async (): Promise<number> => {
  const token = sessionStorage.getItem("authToken");
  const response = await fetch(
    `${API_BASE_URL}/admin/notregisteredplayercount`,
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get not-registered count");
  }

  const json = await response.json();
  return json?.data?.count ?? 0;
};

export async function getAllPlayers(params?: {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PlayersResponse> {
  const token =
    sessionStorage.getItem("authToken") ??
    localStorage.getItem("authToken") ??
    "";

  const sortBy = params?.sortBy ?? "firstName";
  const sortOrder =
    (params?.sortOrder ?? "asc").toLowerCase() === "desc" ? "desc" : "asc";

  const url = new URL(`${API_BASE_URL}/admin/allplayers`);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("sortOrder", sortOrder);

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
      "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = (await resp.json()) as
    | PlayersResponse
    | { success: false; message?: string; error?: string };

  if (!resp.ok || (json as any).success === false) {
    const message =
      (json as any).message ||
      (json as any).error ||
      `Failed to fetch players (HTTP ${resp.status})`;
    throw new Error(message);
  }

  return json as PlayersResponse;
}

// ---- Table flatten helper (use with res.data)
export type PlayerRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  district: string;
  status: string;
  slbfId: string | null;
  openAssociationCode: string | null;
  closeAssociationCode: string | null;
  openClubCode: string | null;
  closeClubCode: string | null;
  regDate: string | null;
  regExpDate: string | null;
};

export function toPlayerRows(users: Player1[]): PlayerRow[] {
  return users.map((u) => {
    const p = u.player;
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      contact: u.contact,
      district: u.district,
      status: u.status,
      slbfId: p?.slbfId ?? null,
      openAssociationCode: p?.openAssociation?.code ?? null,
      closeAssociationCode: p?.closeAssociation?.code ?? null,
      openClubCode: p?.openClub?.code ?? null,
      closeClubCode: p?.closeClub?.code ?? null,
      regDate: p?.regDate ?? null,
      regExpDate: p?.regExpDate ?? null,
    };
  });
}
//--------------------------------------------
// types/api.ts (optional, but handy)
export type Clubchange = {
  id: number;
  userId: number;
  type: string;
  oldAssId?: number | null;
  oldAssCode?: string | null;
  oldAssName?: string | null;
  oldClubId?: number | null;
  oldClubCode?: string | null;
  oldClubName?: string | null;
  oldImage?: string | null;
  resignDate?: string | null;
  newAssId?: number | null;
  newAssCode?: string | null;
  newAssName?: string | null;
  newClubId?: number | null;
  newClubCode?: string | null;
  newClubName?: string | null;
  newImage?: string | null;
  status: string; // "approved"
  createdAt: string;
  updatedAt: string | null;
};

export type ApprovedClubchangesResponse = {
  success: boolean;
  message: string;
  count: number;
  data: Clubchange[];
};

//--------------------------------------------------
export const fetchApprovedClubchanges = async (
  userId: number
): Promise<ApprovedClubchangesResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/clubchanges/${userId}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
          // "User-Agent": "Custom User-Agent", // Optional, usually handled by browser
          // "Content-Type": "application/json",
        },
        credentials: "include", // keep/remove depending on your auth
      }
    );

    if (!response.ok) {
      // try to parse server error payload if any
      let message = "Fetching error";
      try {
        const err = await response.json();
        message = err?.message || message;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    const data: ApprovedClubchangesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching approved clubchanges error:", error);
    throw error;
  }
};
