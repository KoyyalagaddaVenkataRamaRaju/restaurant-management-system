import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tables`);
        const sortedTables = response.data.sort(
          (a, b) => a.tableNumber - b.tableNumber
        );
        setTables(sortedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTableClick = (tableNumber, status) => {
    if (status === "free") {
      localStorage.setItem("tableNumber", tableNumber);
      navigate(`/menu/${tableNumber}`);
    } else {
      alert("This table is not available. Please choose a different table.");
    }
  };

  // 🎨 Gradient luxury styles for statuses
  const getCardGradient = (status) => {
    switch (status) {
      case "free":
        return "bg-gradient-success"; // emerald green gradient
      case "waiting":
        return "bg-gradient-warning"; // golden yellow gradient
      case "eating":
        return "bg-gradient-danger"; // deep red gradient
      default:
        return "bg-gradient-secondary"; // gray fallback
    }
  };

  return (
    <div
      className="min-vh-100 text-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
      }}
    >
      <Navbar />

      {/* Hero section */}
      <header className="py-5 mb-4">
        <h1 className="fw-bold display-4">🍽️ Welcome to Royal Dining</h1>
        <p className="lead text-light">
          Choose your table and enjoy a luxurious dining experience.
        </p>
      </header>

      {/* Tables */}
      <div className="container pb-5">
        <div className="row g-4 justify-content-center">
          {tables.map((table) => (
            <div className="col-6 col-md-4 col-lg-3" key={table.tableNumber}>
              <div
                className={`card h-100 rounded-4 shadow-lg border-0 ${getCardGradient(
                  table.status
                )}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
                onClick={() =>
                  handleTableClick(table.tableNumber, table.status)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h3 className="fw-bold mb-2">Table {table.tableNumber}</h3>
                  <span className="badge bg-light text-dark fs-6 px-3 py-2 rounded-pill">
                    {table.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 mt-auto text-light small">
        © 2025 Royal Dining | Crafted for a 5⭐ Experience
      </footer>

      {/* Extra Bootstrap gradient classes */}
      <style>{`
        .bg-gradient-success {
          background: linear-gradient(135deg, #1d976c, #93f9b9);
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #ffb347, #ffcc33);
        }
        .bg-gradient-danger {
          background: linear-gradient(135deg, #cb2d3e, #ef473a);
        }
        .bg-gradient-secondary {
          background: linear-gradient(135deg, #757f9a, #d7dde8);
        }
      `}</style>
    </div>
  );
};

export default Home;
