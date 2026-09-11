import { PlayerAllData } from "../types/authTypes";
import { User1, RegRequest , ResponseupdateTableField, ClubRequest, UserUpdateDetails} from "../types/index";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const token = sessionStorage.getItem("authToken");
// console.log("puka", token);

export const regRequest = async (
  regRequest: RegRequest
): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      userId: regRequest.userId,
      slipImage: regRequest.slipImage,
      referenceNo: regRequest.reffernceNo,
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/user/regrequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("request occur error:", error);
    throw error;
  }
};

export const userdetailsUpdate = async (
  dataset: UserUpdateDetails

): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      userId: dataset.userId,
      firstName: dataset.firstName,
      email: dataset.email,
      contact: dataset.contact,
      weight: dataset.weight,
      height: dataset.height,
    };
    console.log("payload---------------yana", payload);
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/user/updateuserandplayer`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("request occur error:", error);
    throw error;
  }
};

export const clubchangeRequest = async (
  clubRequest: ClubRequest
): Promise<ResponseupdateTableField> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      userId: clubRequest.userId,
      type: clubRequest.type,
      newImage: clubRequest.newImage,
      newClubId: clubRequest.newClubId || null,
      newAssId: clubRequest.newAssId,
      newClub: clubRequest.newClub || null,
      newAss: clubRequest.newAss,
      newClubCode: clubRequest.newClubCode || null,
      newAssCode: clubRequest.newAssCode,
      currentImage: clubRequest.currentImage || null,
      currentClubId: clubRequest.currentClubId || null,
      currentAssId: clubRequest.currentAssId || null,
      currentClub: clubRequest.currentClub || null,
      currentAss: clubRequest.currentAss || null,
      currentClubCode: clubRequest.currentClubCode || null,
      currentAssCode: clubRequest.currentAssCode || null,
      resignDate: clubRequest.resignDate || null,
    };
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/user/clubchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("request occur error:", error);
    throw error;
  }
};

