import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { getSales } from "../api/saleApi";
import { getCategory } from "../api/categoryApi";

const Home = ({ setSelected }) => {
  const [numberOfSales, setNumberOfSales] = useState();
  const [numberOfCategory, setNumberOfCategory] = useState();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchSales();
    fetchCategory();
  };

  const viewPage = (page) => {
    setSelected(page);
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setNumberOfSales(data.length);
      setSales(data);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setNumberOfCategory(data.length);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  return (
    <motion.div layout className="bg-purple-300 w-full p-4 z-10">
      <h3 className="text-left text-2xl my-4">Dashboard</h3>
      <div className="dashboard flex flex-wrap gap-4">
        <div className="dashboard-card grid bg-sky-200 relative">
          <i className="fa-solid fa-boxes-packing"></i>
          <div className="grid text-left gap-4 text-white">
            <h2>{numberOfCategory}</h2>
            <p>Total Categories </p>
          </div>
          <button
            onClick={() => {
              viewPage("Category");
            }}
          >
            View
          </button>
        </div>

        <div className="dashboard-card grid bg-sky-200 relative">
          <i className="fa-solid fa-boxes-stacked"></i>
          <div className="grid text-left gap-4 text-white">
            <h2>{numberOfSales}</h2>
            <p>Number of Sale Items </p>
          </div>
          <button
            onClick={() => {
              viewPage("Sales");
            }}
          >
            View
          </button>
        </div>

        <div className="dashboard-card grid bg-sky-200 relative">
          <i className="fa-solid fa-peso-sign"></i>
          <div className="grid text-left gap-4 text-white">
            <h2>{sales.reduce((sum, sale) => sum + sale.total, 0)}</h2>
            <p>Total Sales </p>
          </div>
          <button
            onClick={() => {
              viewPage("Sales");
            }}
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
