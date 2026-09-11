import { Filename } from "../types/index";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const imageUpload = async (file: File): Promise<Filename> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fetching error");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
};

export const saveFileLocally = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = new Date().getTime();
      const extension = file.name.split(".").pop();
      const filename = `file_${timestamp}.${extension}`;
      resolve(filename);
    } catch (error) {
      reject(error);
    }
  });
};
