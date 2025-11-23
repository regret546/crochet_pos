import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getCategory,
  addCategory,
  deleteCategory,
  getSpecificCategory,
  updateCategory,
} from "../api/categoryApi";
import { useEffect } from "react";
import { confirmDelete } from "../utils";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedCategory, setSelectedSCategory] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const resetField = () => {
    setCategory("");
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load category:", err);
    }
  };

  const fetchSpecificCategory = async (id) => {
    const data = await getSpecificCategory(id);
    setSelectedSCategory(data);
    setCategory(data.name);

    try {
    } catch (err) {
      console.error("Failed to load category:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!category) return;
    try {
      const newCategory = await addCategory({ name: category });
      setCategories([newCategory, ...categories]);
      fetchCategory();
      toggleModal();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const updated = await updateCategory(id, { name: category });
      fetchCategory();
      toggleModal();
    } catch (error) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    await confirmDelete(async () => {
      await deleteCategory(id);
      fetchCategory();
    }, "category");
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">Manage Category</h3>
          <button
            onClick={() => {
              toggleModal();
              resetField();
              setModalMode("add");
            }}
            className="global-button w-full md:w-auto"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add Category
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="table-wrapper">
            <table className="sales-table w-full">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-8 text-slate-400">
                      No categories yet. Add your first category!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td data-label="Category" className="font-medium text-slate-700">
                        <span className="px-3 py-1.5 bg-lavender-100 text-lavender-600 rounded-full text-sm font-semibold inline-block">
                          {cat.name}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="flex gap-3 justify-start md:justify-start">
                          <button
                            onClick={() => {
                              handleDeleteCategory(cat._id);
                            }}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            onClick={() => {
                              fetchSpecificCategory(cat._id);
                              setModalMode("edit");
                              toggleModal();
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
                {modalMode == "add" ? "Add" : "Edit"} Category
              </h2>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  {
                    modalMode == "add"
                      ? handleAddCategory()
                      : handleUpdateCategory(selectedCategory._id);
                  }
                }}
              >
                <input
                  className="record-input"
                  type="text"
                  placeholder="Category Name"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />

                <button className="global-button mt-2" type="submit">
                  {modalMode == "add" ? "Add Category" : "Update Category"}
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
    </div>
  );
};

export default Category;
