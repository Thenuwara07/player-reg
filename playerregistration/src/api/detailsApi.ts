import { idrestgenerator } from "@/lib/idGenerator";
import { DefaultDetails, Post, SignUpResponse } from "../types/authTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const GetdeafaultDetails = async (): Promise<DefaultDetails[]> => {
  try {
    console.log("default details fetching...");

    // Uncomment if you're using authentication
    // const token = sessionStorage.getItem("authToken");
    // if (!token) {
    //   throw new Error("Authorization token is missing.");
    // }

    const response = await fetch(`${API_BASE_URL}/user/defaultdetails`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        // "Authorization": `Bearer ${token}`,  // Uncomment if using token
        "User-Agent": "Custom User-Agent",  // Optional, usually handled by browser
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the raw response text
      throw new Error(
        errorMessage || "An error occurred while fetching the default details."
      );
    }

    const data = await response.json();
    console.log("default details fetched:", data);
    console.log("default details fetched:", data?.data);
    return data.data; // Adjust according to actual response structure
  } catch (error) {
    console.error("Error fetching default details:", error);
    throw error; // Re-throw the error to propagate it
  }
};


export const updateDetails = async (Details: DefaultDetails): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      herotitle: Details.herotitle,
      herosubtitle: Details?.herosubtitle,
      imageName: Details.imageName,
      openclubchangeperiodMonths: Details.openclubchangeperiodMonths,
      userId: Details.userId,
    };

    // Remove empty fields
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === "" &&
        delete payload[key as keyof typeof payload]
    );
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/details`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};
