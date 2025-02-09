import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState(""); // Role of the current user (Cook, Waiter, Owner)
  const [alert, setAlert] = useState(null); // To handle alerts
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current user's role from localStorage or JWT
    const storedRole = localStorage.getItem("role") || "guest"; // Assume "guest" if no role found
    setUserRole(storedRole);

    // Redirect to a different page if the user is not a Cook
    if (storedRole !== "cook") {
      navigate("/orders"); // Redirect to Unauthorized page (you can create one)
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [navigate]);

  const markAsPrepared = async (orderId, tableNumber) => {
    try {
      // Update the order status to "Prepared"
      const orderResponse = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: "prepared" });
      console.log("Order update response:", orderResponse.data);

      // Change table status to "Eating"
      const tableResponse = await axios.put(`http://localhost:5000/api/tables/${tableNumber}`, { status: "eating" });
      console.log("Table update response:", tableResponse.data);
      setTimeout(async () => {
        try {
          // Change table status to "Free" after 1 minute
          const freeTableResponse = await axios.put(`http://localhost:5000/api/tables/${tableNumber}`, { status: "free" });
          console.log("Table status updated to Free:", freeTableResponse.data);
        } catch (error) {
          console.error("Error updating table status to Free:", error);
        }
      }, 60000); 
      // Show success alert
      setAlert({ message: "Order marked as Prepared and Table is Eating now!", type: "success" });

      // Refresh the orders list by filtering out the prepared order
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error updating order status:", error);
      // Show error alert
      setAlert({ message: "Failed to update order status!", type: "error" });
    }
  };

  return (
    <div className="orders-container">
      <Navbar />
      <h2>Orders Page</h2>

      {/* Display alert if it exists */}
      {alert && (
        <div className={`alert ${alert.type}`}>
          <span>{alert.message}</span>
          <span className="alert-close" onClick={() => setAlert(null)}>×</span>
        </div>
      )}

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h4>Table {order.tableNumber}</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total Price:</strong> ${order.totalPrice}</p>
              <p><strong>Status:</strong> {order.status}</p>

              {/* Show "Mark as Prepared" button only if user is a Cook and order is not yet prepared */}
              {userRole === "cook" && order.status !== "prepared" && (
                <button
                  onClick={() => markAsPrepared(order._id, order.tableNumber)}
                  className="mark-prepared-btn"
                >
                  Mark as Prepared
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
