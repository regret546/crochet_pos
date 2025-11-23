import React, { useState, useEffect } from "react";
import {
  getSales,
  getSpecificSales,
  addSale,
  deleteSale,
  updateSale,
} from "../api/saleApi";
import { motion, AnimatePresence } from "motion/react";
import { getCategory } from "../api/categoryApi";
import { confirmDelete, capitalizeFirstWord } from "../utils";

function Sales() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalMode, setModalMode] = useState("");

  const resetField = () => {
    setItemName("");
    setPrice("");
    setQuantity("");
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchSales();
    fetchCategory();
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load category:", err);
    }
  };
  const fetchSpecificSales = async (id) => {
    try {
      const data = await getSpecificSales(id);
      setSelectedSale(data);
      setItemName(data.itemName);
      setPrice(data.price);
      setQuantity(data.quantity);
      setCategory(data.category ? data.category : categories[0]);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  const handleAddSale = async () => {
    if (!itemName || !price || !quantity) return alert("Fill all fields");
    setLoading(true);
    try {
      const newSale = await addSale({
        itemName,
        price: Number(price),
        quantity: Number(quantity),
        category: category ? category : categories[0],
      });
      setSales([newSale, ...sales]);
      toggleModal();
    } catch (err) {
      console.error("Failed to add sale:", err);
    } finally {
      setLoading(false);
      loadData();
    }
  };

  const handleDeleteSale = async (id) => {
    await confirmDelete(async () => {
      await deleteSale(id);
      fetchSales();
    }, "sale");
  };

  const handleUpdateSale = async (id) => {
    try {
      setLoading(true);
      const updated = await updateSale(selectedSale._id, {
        itemName,
        quantity,
        price,
        category,
      });
      fetchSales();
      setLoading(false);
      toggleModal();
    } catch (err) {
      console.error("Update failed:", err);
      setLoading(false);
    }
  };
  return (
    <motion.div 
      layout 
      className="w-full min-h-screen p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Record a Sale</h2>
          <button
            onClick={() => {
              resetField();
              setModalMode("add");
              toggleModal();
            }}
            className="global-button w-full md:w-auto"
            type="button"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add Sale
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">Sales History</h3>
          <div className="table-wrapper">
            <table className="sales-table w-full">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Category</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      No sales recorded yet. Add your first sale!
                    </td>
                  </tr>
                ) : (
                  sales.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td data-label="Name" className="font-medium text-slate-700">{s.itemName}</td>
                      <td data-label="Quantity">{s.quantity}</td>
                      <td data-label="Price">₱{s.price?.toLocaleString()}</td>
                      <td data-label="Category">
                        <span className="px-2 py-1 bg-lavender-100 text-lavender-500 rounded-full text-sm">
                          {s.category?.name || "No category"}
                        </span>
                      </td>
                      <td data-label="Total" className="font-semibold text-rose-500">₱{s.total?.toLocaleString()}</td>
                      <td data-label="Actions">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDeleteSale(s._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            onClick={() => {
                              setModalMode("edit");
                              toggleModal();
                              fetchSpecificSales(s._id);
                            }}
                            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*  Update/Add modal sale */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ duration: 0.2, ease: "backInOut" }}
            onClick={(e) => setModal(false)}
            className="fixed inset-0 grid place-items-center backdrop-blur-sm bg-black/30 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative text-center md:max-w-[500px] w-full mx-4 grid bg-white rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {modalMode === "add" ? "Add" : "Edit"} a Sale
              </h2>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  {
                    modalMode === "add"
                      ? handleAddSale()
                      : handleUpdateSale(selectedSale._id, {
                          itemName,
                          quantity,
                          price,
                          category,
                        });
                  }
                }}
              >
                <input
                  className="record-input"
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <input
                  className="record-input"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  className="record-input"
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <label className="text-left text-slate-700 font-medium" htmlFor="categories">
                  Choose a Category:
                </label>
                <select
                  className="record-input"
                  id="categories"
                  value={category?.name || ""}
                  onChange={(e) =>
                    setCategory(
                      categories.find(
                        (cat) =>
                          cat.name === capitalizeFirstWord(e.target.value)
                      )
                    )
                  }
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>
                      {capitalizeFirstWord(cat.name)}
                    </option>
                  ))}
                </select>

                <button className="global-button mt-2" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Saving...
                    </span>
                  ) : (
                    <span>{modalMode === "add" ? "Add Sale" : "Update Sale"}</span>
                  )}
                </button>
              </form>
              <button
                onClick={toggleModal}
                className="mt-4 p-3 px-6 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Sales;
