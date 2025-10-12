import React from "react";
import { useState } from "react";
import { getCategory, addCategory, deleteCategory } from "../api/categoryApi";
import { useEffect } from "react";
import { confirmDelete } from "../utils";
import { addSale } from "../api/saleApi";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load sales:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!category) return;
    try {
      const newCategory = await addCategory({ name: category });
      setCategories([newCategory, ...categories]);
      toggleModal();
    } catch (err) {
      console.error("Failed to add category:", err);
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
        onClick={toggleModal}
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
                <td>
                  <i
                    onClick={() => {
                      handleDeleteCategory(cat._id);
                    }}
                    className="fa-solid fa-trash text-red-500 hover:opacity-70 cursor-pointer"
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
              <h2 className="my-[2rem]">Add Category</h2>
              <form
                className="grid gap-4 "
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCategory();
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
