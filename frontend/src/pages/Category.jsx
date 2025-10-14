import React from "react";
import { useState } from "react";
import {
  getCategory,
  addCategory,
  deleteCategory,
  getSpecificCategory,
  updateCategory,
} from "../api/categoryApi";
import { useEffect } from "react";
import { confirmDelete } from "../utils";
import { addSale } from "../api/saleApi";

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
    <div className="bg-purple-300 w-full p-4">
      <h3 className="text-left text-2xl mt-4">Manage Category</h3>
      <button
        onClick={() => {
          toggleModal();
          resetField();
          setModalMode("add");
        }}
        className="p-2 bg-pink-400 rounded-md text-white my-4 cursor-pointer hover:bg-pink-400/80"
      >
        Add Category
      </button>
      <div className="overflow-x-auto  mt-2 ">
        <table className="border-separate border-spacing-y-4 w-full">
          <thead>
            <tr className="text-left">
              <th scope="col">Category</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={i}>
                <td>{cat.name}</td>
                <td className="flex gap-2">
                  <i
                    onClick={() => {
                      handleDeleteCategory(cat._id);
                    }}
                    className="fa-solid fa-trash text-red-500 hover:opacity-70 cursor-pointer"
                  ></i>
                  <i
                    onClick={() => {
                      fetchSpecificCategory(cat._id);
                      setModalMode("edit");
                      toggleModal();
                    }}
                    class="cursor-pointer fa-solid fa-pen text-gray-700"
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal">
          <div className="fixed inset-0 grid place-items-center bg-purple-500">
            <div className="relative text-center grid w-[300px] bg-gray-200 p-4">
              <h2 className="my-[2rem]">
                {modalMode == "add" ? "Add" : "Edit"} Category
              </h2>
              <form
                className="grid gap-4 "
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
                  className=""
                  type="text"
                  placeholder="Category Name"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <button className="global-button" type="submit">
                  Add
                </button>
              </form>
              <div
                onClick={toggleModal}
                className="global-button bg-red-400 text-white"
              >
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
