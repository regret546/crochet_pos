import React, { useState, useEffect } from "react";
import {
  getSales,
  getSpecificSales,
  addSale,
  deleteSale,
  updateSale,
} from "../api/saleApi";
import Modal from "../components/Modal";

function Sales() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (err) {
      console.error("❌ Failed to load sales:", err);
    }
  };

  const fetchSpecificSales = async (id) => {
    try {
      const data = await getSpecificSales(id);
      setSelectedSale(data);
      setItemName(data.itemName);
      setPrice(data.price);
      setQuantity(data.quantity);
    } catch (err) {
      console.error("❌ Failed to load sales:", err);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!itemName || !price || !quantity) return alert("Fill all fields");
    setLoading(true);
    try {
      const newSale = await addSale({
        itemName,
        price: Number(price),
        quantity: Number(quantity),
      });
      // Add new sale to the top of the list
      setSales([newSale, ...sales]);
      setItemName("");
      setPrice("");
      setQuantity("");
    } catch (err) {
      console.error("❌ Failed to add sale:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    await deleteSale(id);
    fetchSales();
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      const updated = await updateSale(selectedSale._id, {
        itemName,
        quantity,
        price,
      });
      fetchSales();
      setLoading(false);
      toggleModal();
    } catch (err) {
      console.error("❌ Update failed:", err);
      setLoading(false);
    }
  };
  return (
    <div className="w-full bg-purple-200 text-white">
      <div className="grid justify-center w-full">
        <h2 className="my-[2rem]">Record a Sale</h2>
        <form className="grid gap-4" onSubmit={handleAddSale}>
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
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            className="record-input"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="global-button" type="submit">
            {loading ? "Saving..." : "Add Sale"}
          </button>
        </form>

        <h3 className="text-center mt-4">Sales History</h3>
        <div className="sales-table overflow-x-auto border-2 mt-2 ">
          <table className="border-separate border-spacing-y-4 w-full">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
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
                  <td>{s.total}</td>
                  <td>
                    <div className="flex gap-4">
                      <i
                        onClick={() => handleDelete(s._id)}
                        className="text-red-300 fa-solid fa-trash cursor-pointer"
                      ></i>
                      <i
                        onClick={() => {
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

          {modal && (
            <div className="modal">
              <div className="fixed inset-0 grid place-items-center bg-purple-500">
                <div className="relative text-center grid w-[300px] bg-gray-200 p-4">
                  <h2 className="my-[2rem]">Record a Sale</h2>
                  <form
                    className="grid gap-4 "
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdate(selectedSale._id, {
                        itemName,
                        quantity,
                        price,
                      });
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
                    <button className="global-button" type="submit">
                      {loading ? "Saving..." : "Update Sale"}
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
      </div>
    </div>
  );
}

export default Sales;
