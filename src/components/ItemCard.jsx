import React from "react";
import axios from "axios";
import "../styles/ItemCard.css";
const API_URL = import.meta.env.VITE_API_URL;

const ItemCard = ({ item, tableNumber }) => {
  const handleAddToCart = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/cart`, {
        tableNumber,
        itemId: item._id,
        name: item.name,
        price: item.price,
      });

      alert(response.data.message); // ✅ Show confirmation message
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item!");
    }
  };

  return (
    <div className="item-card">
      <img src={item.imageUrl} alt={item.name} className="item-image" /> {/* Display the item image */}
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ItemCard;
