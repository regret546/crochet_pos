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
    <div className="w-full bg-slate-300 text-white p-4">
      <div className="grid ">
        <h2 className="text-left text-2xl my-4">Record a Sale</h2>

        <button
          onClick={() => {
            resetField();
            setModalMode("add");
            toggleModal();
          }}
          className="bg-lavender-100 w-[200px] p-2 rounded-md cursor-pointer"
          type="submit"
        >
          Add Sale
        </button>

        <h3 className="text-center mt-4">Sales History</h3>
        <div className="sales-table overflow-x-auto mt-2 ">
          <table className="border-separate border-spacing-y-4 w-full">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Category</th>
                <th scope="col">Total</th>
                <th scope="col">ID</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i}>
                  <td>{s.itemName}</td>
                  <td>{s.quantity}</td>
                  <td>{s.price}</td>
                  <td>{s.category?.name || "No category"}</td>
                  <td>{s.total}</td>
                  <td>
                    <div className="flex gap-4">
                      <i
                        onClick={() => handleDeleteSale(s._id)}
                        className="text-red-300 fa-solid fa-trash cursor-pointer"
                      ></i>
                      <i
                        onClick={() => {
                          setModalMode("edit");
                          toggleModal();
                          fetchSpecificSales(s._id);
                        }}
                        className="text-blue-300 fa-solid fa-pen cursor-pointer"
                      ></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/*  Update/Add modal sale */}
          <AnimatePresence>
            {modal && (
              <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                transition={{ duration: 0.2, ease: "backInOut" }}
                onClick={(e) => setModal(false)}
                className="fixed inset-0 grid place-items-center backdrop-blur"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative text-center md:max-w-[450px] w-full grid bg-sky-300 rounded-lg p-4 shadow-xl "
                >
                  <h2 className=" text-black mt-[1.5rem] mb-[1rem]">
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
                    <label className="text-left text-black" for="cars">
                      Choose a Category:
                    </label>
                    <select
                      className="text-black"
                      id="categories"
                      value={category.name}
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

                    <button className="global-button" type="submit">
                      {modalMode === "add" ? "Add" : "Update"}
                      {loading && "Saving..."}
                    </button>
                  </form>
                  <div
                    onClick={toggleModal}
                    className="global-button bg-red-400 text-white mb-[1.5rem]"
                  >
                    Close
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Sales;
