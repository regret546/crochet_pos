import axios from "axios";

const API_URL_CATEGORY = "http://localhost:5000/api/category";

export const getCategory = async () => {
  const res = await axios.get(API_URL_CATEGORY);
  return res.data;
};

export const getSpecificCategory = async (id) => {
  const res = await axios.get(`${API_URL_CATEGORY}/${id}`);
  return res.data;
};

export const addCategory = async (categoryData) => {
  const res = await axios.post(API_URL_CATEGORY, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_URL_CATEGORY}/${id}`);
  return res.data;
};

export const updateCategory = async (id, updatedData) => {
  const res = await axios.put(`${API_URL_CATEGORY}/${id}`, updatedData);
  return res.data;
};
