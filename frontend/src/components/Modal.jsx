import React from "react";

const Modal = ({
  salesFunction,
  id,
  itemName,
  setItemName,
  price,
  setPrice,
  quantity,
  setQuantity,
  loading,
  toggleModal,
}) => {
  return (
    <div className="fixed inset-0 grid place-items-center bg-purple-500">
      <div className="relative text-center grid w-[300px] bg-gray-200 p-4">
        <h2 className="my-[2rem]">Edit a Sale</h2>
        <form
          className="grid gap-4 "
          onSubmit={(e) => {
            e.preventDefault();
            salesFunction(id, {
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
  );
};

export default Modal;
