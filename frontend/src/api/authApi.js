import axios from "axios";

const API_URL_AUTH = "http://localhost:5000/api/auth";

export const loginUser = async (credential) => {
  const res = await axios.post(`${API_URL_AUTH}/login`, credential);
  return res.data;
};

export const resetPassword = async (currentPassword, newPassword) => {
  try {
    const userInfoStr = localStorage.getItem("userInfo");
    
    if (!userInfoStr) {
      throw new Error("No authentication token found. Please login again.");
    }

    const userInfo = JSON.parse(userInfoStr);
    
    if (!userInfo || !userInfo.token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const token = userInfo.token;

    const res = await axios.post(
      `${API_URL_AUTH}/reset-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // Re-throw with better error message
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Request made but no response
      throw new Error("Network error. Please check your connection and ensure the backend server is running.");
    } else {
      // Error setting up request
      throw error;
    }
  }
};
