import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/Menu.css"

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [alertMessage, setAlertMessage] = useState(""); // State to handle alert message
  const navigate = useNavigate();

  const tableNumber = localStorage.getItem("tableNumber"); // Get stored table number

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Add item to the cart with the table number
  const addToCart = (item) => {
    const newItem = { ...item, quantity }; // Add quantity to the item
    const updatedCart = [...cart, newItem];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Store cart in localStorage

    // Show alert message
    setAlertMessage(`${item.name} added to cart!`);

    // Hide the alert message after 3 seconds
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  return (
    <div className="menu-container">
      <Navbar />
      <h2>Menu - Table {tableNumber}</h2>

      {/* Show alert if item is added to the cart */}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item">
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <div>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="quantity-input"
              />
              <button onClick={() => addToCart(item)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/cart")} className="go-to-cart-btn">
        Go to Cart
      </button>
    </div>
  );
};

export default Menu;
