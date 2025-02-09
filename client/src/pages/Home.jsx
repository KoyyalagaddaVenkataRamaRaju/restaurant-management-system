import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const Home = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // Fetching updated table statuses
        const response = await axios.get("http://localhost:5000/api/tables");
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables(); // Initial fetch on load
    const interval = setInterval(() => {
      fetchTables(); // Polling every 10 seconds to update table statuses
    }, 1000); // 10 seconds interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleTableClick = (tableNumber, status) => {
    if (status === "free") {
      localStorage.setItem("tableNumber", tableNumber); // Store the selected table number
      navigate(`/menu/${tableNumber}`); // Redirect to menu page
    } else {
      alert("This table is not available. Please choose a different table.");
    }
  };

  return (
    <div className="home">
      <Navbar />
      <h2>Welcome to Our Restaurant</h2>
      <p>Choose a table and place your order.</p>

      <div className="tables-container">
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            className={`table-box ${table.status}`}
            onClick={() => handleTableClick(table.tableNumber, table.status)}
          >
            <h3>Table {table.tableNumber}</h3>
            <p>Status: {table.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
