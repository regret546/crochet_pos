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
    <motion.div 
      layout 
      className="w-full p-4 md:p-6 lg:p-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <h3 className="text-left text-3xl md:text-4xl font-bold text-slate-800 mb-6 md:mb-8">
          Dashboard
        </h3>
        <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <motion.div 
            className="dashboard-card"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fa-solid fa-boxes-packing"></i>
            <div className="grid text-left gap-2 text-white">
              <h2>{numberOfCategory ?? 0}</h2>
              <p>Total Categories</p>
            </div>
            <button
              onClick={() => {
                viewPage("Category");
              }}
            >
              View Categories
            </button>
          </motion.div>

          <motion.div 
            className="dashboard-card"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fa-solid fa-boxes-stacked"></i>
            <div className="grid text-left gap-2 text-white">
              <h2>{numberOfSales ?? 0}</h2>
              <p>Number of Sale Items</p>
            </div>
            <button
              onClick={() => {
                viewPage("Sales");
              }}
            >
              View Sales
            </button>
          </motion.div>

          <motion.div 
            className="dashboard-card"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fa-solid fa-peso-sign"></i>
            <div className="grid text-left gap-2 text-white">
              <h2>₱{sales.reduce((sum, sale) => sum + (sale.total || 0), 0).toLocaleString()}</h2>
              <p>Total Sales</p>
            </div>
            <button
              onClick={() => {
                viewPage("Sales");
              }}
            >
              View Sales
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
