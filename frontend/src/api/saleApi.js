import axios from "axios";

const API_URL_SALES = "http://localhost:5000/api/sales";

export const getSales = async () => {
  const res = await axios.get(API_URL_SALES);
  return res.data;
};

export const getSpecificSales = async (id) => {
  const res = await axios.get(`${API_URL_SALES}/${id}`);
  return res.data;
};

export const addSale = async (saleData) => {
  const res = await axios.post(API_URL_SALES, saleData);
  return res.data;
};

export const deleteSale = async (id) => {
  const res = await axios.delete(`${API_URL_SALES}/${id}`);
  return res.data;
};

export const updateSale = async (id, updatedData) => {
  const res = await axios.put(`${API_URL_SALES}/${id}`, updatedData);
  return res.data;
};
