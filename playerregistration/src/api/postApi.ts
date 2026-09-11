import { idrestgenerator } from "@/lib/idGenerator";
import { DefaultDetails, Post, SignUpResponse } from "../types/authTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const createPost = async (postData: Post): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const payload = {
      title: postData.title,
      subtitle: postData?.subtitle,
      content: postData.content,
      imageName: postData.imageName,
      userId: postData.userId,
    };

    // Remove empty fields
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === "" &&
        delete payload[key as keyof typeof payload],
    );
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create post");
    }

    return await response.json();
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const GetPosts = async (): Promise<Post[]> => {
  try {
    console.log("10");

    // Uncomment if you're using authentication
    // const token = sessionStorage.getItem("authToken");
    // if (!token) {
    //   throw new Error("Authorization token is missing.");
    // }

    const response = await fetch(`${API_BASE_URL}/admin/posts`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        // "Authorization": `Bearer ${token}`,  // Uncomment if using token
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the raw response text
      throw new Error(
        errorMessage || "An error occurred while fetching the data.",
      );
    }

    const data = await response.json();
    return data.data || data; // Adjust according to actual response structure
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // Re-throw the error to propagate it
  }
};

export const updatePost = async (postData: Post): Promise<SignUpResponse> => {
  try {
    // Prepare the payload without changing variable names
    const id = postData.id;
    const payload = {
      title: postData.title,
      subtitle: postData?.subtitle,
      content: postData.content,
      imageName: postData.imageName,
      userId: postData.userId,
    };

    // Remove empty fields
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === "" &&
        delete payload[key as keyof typeof payload],
    );
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/post/${id}`, {
      method: "PATCH",
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

export const deletePost = async (postId: number): Promise<SignUpResponse> => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/admin/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete post");
    }
    return await response.json();
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const getPostCount = async (params?: {
  userId?: number | string;
  q?: string;
}): Promise<number> => {
  const token = sessionStorage.getItem("authToken");

  const qs = new URLSearchParams();
  if (params?.userId !== undefined && params?.userId !== null) {
    qs.set("userId", String(params.userId));
  }
  if (params?.q && params.q.trim()) {
    qs.set("q", params.q.trim());
  }

  const url = `${API_BASE_URL}/admin/posts/count${
    qs.toString() ? `?${qs}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
      "User-Agent": "Custom User-Agent",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json(); // <-- parse the body

  if (!res.ok) {
    throw new Error(json?.message || "Failed to get post count");
  }

  return Number(json?.data?.count ?? 0);
};

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

    // const response = await fetch(`${API_BASE_URL}/api/user/defaultdetails`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "ngrok-skip-browser-warning": "true",
    //     // "Authorization": `Bearer ${token}`,
    //   },
    //   credentials: "include",
    // });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the raw response text
      throw new Error(
        errorMessage || "An error occurred while fetching the default details.",
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
