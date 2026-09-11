import { PlayerAllData, User } from "../types/authTypes";
import { User1, Closeclub, Openclub, University, School, MercClub} from "../types/index";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const playerDetails = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};

export const AllplayerDetails = async (): Promise<User1[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/players`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllCloseclubsDetails = async (): Promise<Closeclub[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allcloseclubs`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllOpenclubsDetails = async (): Promise<Openclub[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allopenclubs`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllSchools = async (): Promise<School[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allschools`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllUniversities = async (): Promise<University[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/alluniversities`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllMercClubs = async (): Promise<MercClub[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allmercclubs`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllAssociations = async (): Promise<MercClub[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allassociations`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
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

export const AllOpenClubsByAssociationId = async (assId: number): Promise<MercClub[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/associations/${assId}/openclubs`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",  // Skip ngrok browser warning
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data: { data: MercClub[] } = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};
