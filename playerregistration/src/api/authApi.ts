import { FormData, SignUpResponse, SigninData } from "../types/authTypes";
import { imageUpload } from "./fileApi";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (
  formData: FormData, front: string, back: string, profile: string | null): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      fullName: formData.fullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateofBirth: formData.dateOfBirth,
      gender: formData.gender,
      district: formData.district,
      nicNum: formData.idCardNumber,
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      profilePictureName: profile, // Use the uploaded profile picture name if available
      role: "player",
      weight: formData.weight,
      height: formData.height,
      idType: formData.idType,
      idFrontImage: front, // Use the uploaded front ID image name if available
      idBackImage: back, // Use the uploaded back ID image name if available
    };

    // Remove empty fields
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === "" &&
        delete payload[key as keyof typeof payload]
    );

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const signin = async (
  signinData: SigninData
): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      username: signinData.username,
      password: signinData.password,
    };

    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signin failed");
    }
    const data = await response.json();
    if (data.token && data.user) {
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userData", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
};
