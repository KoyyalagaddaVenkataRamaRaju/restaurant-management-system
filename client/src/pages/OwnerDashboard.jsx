import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/OwnerDashboard.css";
import TableStatus from "../components/Tablestatus";

const OwnerDashboard = () => {
  const [numTables, setNumTables] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddMenuItemForm, setShowAddMenuItemForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: "",
    price: 0,
    category: "",
    type: "",
    imageUrl: "",
  });

  // Fetch total revenue on page load
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        const total = response.data.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  // Handle adding tables
  const handleTableSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/addTables", {
        numberOfTables: parseInt(numTables),
      });
      alert(response.data.message);
      setNumTables("");
    } catch (error) {
      console.error(
        "Error adding tables:",
        error.response?.data || error.message
      );
      alert("Failed to add tables!");
    }
  };

  // Handle adding a user (Waiter, Cook, etc.)
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        userFormData
      );
      alert(response.data.message);
      setUserFormData({ name: "", email: "", password: "", role: "waiter" });
      setShowAddUserForm(false); // Close the form
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      alert("Failed to add user!");
    }
  };

  // Handle adding a menu item
  const handleAddMenuItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/menu",
        menuItemFormData
      );
      alert(response.data.message);
      setMenuItemFormData({
        name: "",
        price: 0,
        category: "",
        type: "",
        imageUrl: "",
      });
      setShowAddMenuItemForm(false); // Close the form
    } catch (error) {
      console.error(
        "Error adding menu item:",
        error.response?.data || error.message
      );
      alert("Failed to add menu item!");
    }
  };

  return (
    <div className="owner-dashboard">
      <h2>Owner Dashboard</h2>
      <Navbar />
      <div className="dash-cont">
        <div className="cont1">
          <TableStatus />
        </div>

        {/* Flex Layout for Revenue and Tables */}
        <div className="revenue-table-container">
          {/* Total Revenue Section */}
          <div className="total-revenue">
            <h3>Total Revenue: ${totalRevenue}</h3>
          </div>
        </div>

        {/* Set Number of Tables Form */}
        <div className="set-tables">
          <h3>Set Number of Tables</h3>
          <form onSubmit={handleTableSubmit}>
            <input
              type="number"
              value={numTables}
              onChange={(e) => setNumTables(e.target.value)}
              placeholder="Enter number of tables"
              required
            />
            <button type="submit">Set Tables</button>
          </form>
        </div>
      </div>

      {/* Flex Layout for Forms */}
      <div className="dashboard-flex">
        {/* Add User Button */}
        <div className="section">
          <button onClick={() => setShowAddUserForm(!showAddUserForm)}>
            {showAddUserForm ? "Cancel" : "Add User"}
          </button>

          {/* Add User Form */}
          {showAddUserForm && (
            <form onSubmit={handleAddUserSubmit}>
              <input
                type="text"
                value={userFormData.name}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, name: e.target.value })
                }
                placeholder="Enter user name"
                required
              />
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, email: e.target.value })
                }
                placeholder="Enter email"
                required
              />
              <input
                type="password"
                value={userFormData.password}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, password: e.target.value })
                }
                placeholder="Enter password"
                required
              />
              <select
                value={userFormData.role}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, role: e.target.value })
                }
                required
              >
                <option value="waiter">Waiter</option>
                <option value="cook">Cook</option>
                <option value="owner">Owner</option>
              </select>
              <button type="submit">Add User</button>
            </form>
          )}
        </div>

        {/* Add Menu Item Button */}
        <div className="section">
          <button onClick={() => setShowAddMenuItemForm(!showAddMenuItemForm)}>
            {showAddMenuItemForm ? "Cancel" : "Add Menu Item"}
          </button>

          {/* Add Menu Item Form */}
          {showAddMenuItemForm && (
            <form onSubmit={handleAddMenuItemSubmit}>
              <input
                type="text"
                value={menuItemFormData.name}
                onChange={(e) =>
                  setMenuItemFormData({
                    ...menuItemFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter menu item name"
                required
              />
              <input
                type="number"
                value={menuItemFormData.price}
                onChange={(e) =>
                  setMenuItemFormData({
                    ...menuItemFormData,
                    price: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter menu item price"
                required
              />
              <input
                type="text"
                value={menuItemFormData.category}
                onChange={(e) =>
                  setMenuItemFormData({
                    ...menuItemFormData,
                    category: e.target.value,
                  })
                }
                placeholder="Enter category"
                required
              />
              <input
                type="text"
                value={menuItemFormData.type}
                onChange={(e) =>
                  setMenuItemFormData({
                    ...menuItemFormData,
                    type: e.target.value,
                  })
                }
                placeholder="Enter type"
                required
              />
              <input
                type="text"
                value={menuItemFormData.imageUrl}
                onChange={(e) =>
                  setMenuItemFormData({
                    ...menuItemFormData,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="Enter image URL"
                required
              />
              <button type="submit">Add Menu Item</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
