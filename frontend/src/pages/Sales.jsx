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
import logoImage from "../assets/logo.png";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");
  const itemsPerPage = 5;

  const resetField = () => {
    setItemName("");
    setPrice("");
    setQuantity("");
    setPicture(null);
    setPicturePreview("");
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchSales();
    fetchCategory();
  };

  const toggleModal = () => {
    if (modal) {
      // Reset fields when closing modal
      resetField();
    }
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
      setPicturePreview(data.picture ? `http://localhost:5000${data.picture}` : "");
      setPicture(null);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  const handleAddSale = async () => {
    if (!itemName || !price || !quantity) return alert("Fill all fields");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("itemName", itemName);
      formData.append("price", Number(price));
      formData.append("quantity", Number(quantity));
      const categoryId = category?._id || category || (categories[0]?._id);
      if (categoryId) {
        formData.append("category", categoryId);
      }
      if (picture) {
        formData.append("picture", picture);
      }
      
      const newSale = await addSale(formData);
      setSales([newSale, ...sales]);
      setCurrentPage(1); // Reset to first page after adding
      toggleModal();
      resetField();
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
      setCurrentPage(1); // Reset to first page after deletion
    }, "sale");
  };

  const handleUpdateSale = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("itemName", itemName);
      formData.append("quantity", Number(quantity));
      formData.append("price", Number(price));
      const categoryId = category?._id || category;
      if (categoryId) {
        formData.append("category", categoryId);
      }
      if (picture) {
        formData.append("picture", picture);
      }
      
      const updated = await updateSale(selectedSale._id, formData);
      fetchSales();
      setLoading(false);
      setCurrentPage(1); // Reset to first page after updating
      toggleModal();
      resetField();
    } catch (err) {
      console.error("Update failed:", err);
      setLoading(false);
    }
  };

  // Filter sales based on search term (searches item name and category)
  const filteredSales = sales.filter((sale) => {
    const matchesItemName = sale.itemName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = sale.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesItemName || matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Format date for display (mobile-friendly)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    // Format: "Dec 25, 2024, 02:30 PM"
    return date.toLocaleString('en-US', options);
  };

  // Handle picture file selection
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <motion.div 
      layout 
      className="w-full min-h-screen p-4 md:p-6 lg:p-8 pt-20 md:pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 pl-16 md:pl-0">Record a Sale</h2>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Sales History</h3>
            {/* Search Input */}
            <div className="relative w-full md:w-auto md:min-w-[250px]">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by item or category..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="record-input w-full pl-10 pr-4"
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="sales-table w-full">
              <thead>
                <tr>
                  <th scope="col">Picture</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Category</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400">
                      {searchTerm
                        ? `No sales found matching "${searchTerm}"`
                        : "No sales recorded yet. Add your first sale!"}
                    </td>
                  </tr>
                ) : (
                  paginatedSales.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td data-label="Picture">
                        <img
                          src={s.picture ? `http://localhost:5000${s.picture}` : logoImage}
                          alt={s.itemName}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = logoImage;
                          }}
                        />
                      </td>
                      <td data-label="Name" className="font-medium text-slate-700">{s.itemName}</td>
                      <td data-label="Date" className="text-sm text-slate-600">
                        <span className="block md:inline">{formatDate(s.date || s.createdAt)}</span>
                      </td>
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

          {/* Pagination Controls */}
          {filteredSales.length > itemsPerPage && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)} of{" "}
                {filteredSales.length} sales
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <i className="fa-solid fa-chevron-left mr-1"></i>
                  Previous
                </button>
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg border transition-colors font-medium ${
                        currentPage === page
                          ? "bg-gradient-to-r from-rose-400 to-lavender-400 text-white border-transparent"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Next
                  <i className="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          )}
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

                <label className="text-left text-slate-700 font-medium" htmlFor="picture">
                  Add Picture (Optional):
                </label>
                <input
                  className="record-input"
                  type="file"
                  id="picture"
                  accept="image/*"
                  onChange={handlePictureChange}
                />
                <div className="mt-2">
                  <img
                    src={picturePreview || logoImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-slate-300"
                    onError={(e) => {
                      e.target.src = logoImage;
                    }}
                  />
                </div>

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
