import axios from "axios";

const API_URL_AUTH = "http://localhost:5000/api/auth";

export const loginUser = async (credential) => {
  const res = await axios.post(`${API_URL_AUTH}/login`, credential);
};
