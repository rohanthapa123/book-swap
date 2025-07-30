import { myAxios } from "../axios"; // Assuming this imports your axios instance

export const login = async (data: Record<string, unknown>) => {
  try {
    const response = await myAxios.post(`/auth/login`, data, {
      withCredentials: true, // Proper usage for credentials
    });
    return response.data; // Returning the response data directly
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch About data: " + error.message); // Now you can access error.message
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const registerApi = async (data: Record<string, unknown>) => {
  try {
    const response = await myAxios.post(`/auth/register`, data, {
      withCredentials: true, // Proper usage for credentials
    });
    return response.data; // Returning the response data directly
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch About data: " + error.message); // Now you can access error.message
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const logout = async () => {
  try {
    console.log("login out")
    const response = await myAxios.post(`/auth/logout`, {
      withCredentials: true, // Proper usage for credentials
    });
    return response.data; // Returning the response data directly
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch About data: " + error.message); // Now you can access error.message
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const checkAuth = async () => {
  try {
    const response = await myAxios.post(`/auth/get-me`, {
      withCredentials: true, // Proper usage for credentials
    });
    return response.data; // Returning the response data directly
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch About data: " + error.message); // Now you can access error.message
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateUserPreferences = async ({ id, preferences }: {
  id: string;
  preferences: string[]
}) => {
  return myAxios.put(`/user/${id}`, { preferences });
};
