import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Cart.css"; // Import CSS file
const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation popup
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const storedTableNumber = localStorage.getItem("tableNumber");
    if (storedTableNumber) {
      setTableNumber(storedTableNumber);
    }

    // Calculate total price
    const price = storedCart.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(price);
  }, []);

  const calculateTotalPrice = () => {
    return totalPrice;
  };

  const placeOrder = async () => {
    if (!tableNumber) {
      alert("Table number is missing!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/placeOrder`, {
        tableNumber,
        items: cartItems,
        totalPrice,
      });

      // Change table status to "waiting for food"
      await axios.put(`${API_URL}/api/tables/${tableNumber}`, { status: "waiting for food" });

      alert(response.data.message);
      setCartItems([]);
      localStorage.removeItem("cart"); // Clear cart after order
      navigate("/orders"); // Redirect to Orders Page
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order!");
    }
  };

  const handleConfirmOrder = () => {
    placeOrder();
    setShowConfirmation(false); // Close confirmation modal
  };

  const handleCancelOrder = () => {
    setShowConfirmation(false); // Close confirmation modal
  };

  return (
    <div>
      <Navbar />
      <h2>Cart</h2>
      <h1>Table Number: {tableNumber}</h1>
      <div className="cart-main">
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-items-list">
    {cartItems.map((item, index) => (
      <li key={index} className="cart-item">
        <div className="cart-item-details">
          {/* Rectangle container for the image */}
          <div className="cart-item-image-container">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
          </div>

          {/* Item details */}
          <span className="cart-item-info">
            {item.name} - ₹{item.price} x {item.quantity}
          </span>
        </div>
      </li>
    ))}
  </ul>
      )}
      <h3>Total Price: ₹{calculateTotalPrice()}</h3>
      {cartItems.length > 0 && (
        <button onClick={() => setShowConfirmation(true)}>Place Order</button>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirm Your Order</h3>
            <p><strong>Table Number:</strong> {tableNumber}</p>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p><strong>Total Price:</strong> ${calculateTotalPrice()}</p>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={handleConfirmOrder}>Confirm</button>
              <button className="cancel-btn" onClick={handleCancelOrder}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Cart;
