import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/Menu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
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

  // Add item to the cart
  const addToCart = (item) => {
    // Check if item already exists in the cart
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      // If the item already exists, increase its quantity
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Store updated cart in localStorage
    } else {
      // If the item doesn't exist, add it to the cart with quantity 1
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Store updated cart in localStorage
    }

    // Show alert message
    setAlertMessage(`${item.name} added to cart!`);

    // Hide the alert message after 3 seconds
    setTimeout(() => {
      setAlertMessage("");
    }, 300);
  };

  return (
    <div className="menu-container">
      <Navbar />
      <h2>Menu - Table {tableNumber}</h2>

      {/* Show alert if item is added to the cart */}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item-card">
            <div className="menu-item-content">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="menu-item-image"
              />
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)} // Add item to the cart with quantity 1
                >
                  Add to Cart
                </button>
              </div>
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
