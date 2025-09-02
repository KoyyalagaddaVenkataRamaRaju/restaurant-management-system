import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const { token, role } = response.data;

      if (!token || !role) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setTimeout(() => {
        if (role === "owner") navigate("/owner-dashboard");
        else if (role === "waiter") navigate("/home");
        else if (role === "cook") navigate("/orders");
        else setError("Invalid user role.");
      }, 100);
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container d-flex flex-column justify-content-center align-items-center">
      <div className="stars"></div>
      <div className="twinkle"></div>

      {/* Heading */}
      <h2 className="login-heading text-center">
        ✨ Royal Dining – Secure Login
      </h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="login-form shadow-lg">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Enter Username"
            onChange={handleChange}
            required
            className="form-control form-control-lg glow-input"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
            className="form-control form-control-lg glow-input"
          />
        </div>
        <button type="submit" className="btn btn-lg w-100 glow-btn">
          Login
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="error mt-3">{error}</p>}

      {/* Internal Styling */}
      <style>{`
        /* Container */
        .login-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
          color: white;
          overflow: hidden;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }

        /* Stars Layer */
        .stars {
          position: absolute;
          top: 0; left: 0;
          width: 200%; height: 200%;
          background:
            radial-gradient(circle 1.5px at 5% 10%, #fff, transparent),
            radial-gradient(circle 2.5px at 15% 70%, #eee, transparent),
            radial-gradient(circle 1px at 25% 30%, #ddd, transparent),
            radial-gradient(circle 2px at 35% 60%, #ccc, transparent),
            radial-gradient(circle 1px at 45% 20%, #fff, transparent),
            radial-gradient(circle 2px at 55% 75%, #eee, transparent);
          background-size: 150px 150px;
          animation: starsMove 60s linear infinite, zoomInOut 40s ease-in-out infinite alternate;
          opacity: 0.6;
          z-index: 0;
        }

        /* Twinkle Layer */
        .twinkle {
          position: absolute;
          top: 0; left: 0;
          width: 200%; height: 200%;
          background:
            radial-gradient(circle 3px at 10% 40%, rgba(255,255,255,0.8), transparent),
            radial-gradient(circle 4px at 25% 70%, rgba(255,255,255,0.6), transparent),
            radial-gradient(circle 2px at 50% 50%, rgba(255,255,255,0.7), transparent);
          background-size: 200px 200px;
          animation: twinkleFlicker 2s ease-in-out infinite alternate, zoomInOut 50s ease-in-out infinite alternate;
          opacity: 0.5;
          z-index: 1;
        }

        @keyframes starsMove {
          from { background-position: 0 0; }
          to { background-position: 0 -300px; }
        }
        @keyframes twinkleFlicker {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        @keyframes zoomInOut {
          0% { transform: scale(1); }
          100% { transform: scale(1.3); }
        }

        /* Heading */
        .login-heading {
          font-size: 2.6rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: #FFD700;
          z-index: 2;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
        }

        /* Form */
        .login-form {
          background: rgba(255, 255, 255, 0.08);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          width: 95%;
          max-width: 420px;
          z-index: 2;
        }

        /* Inputs */
        .glow-input {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          font-size: 1rem;
          padding: 14px;
          transition: all 0.3s ease;
        }
        .glow-input:focus {
          border-color: #FFD700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
          outline: none;
        }

        /* Button */
        .glow-btn {
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 14px;
          font-size: 1.2rem;
          color: #000;
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          background: linear-gradient(90deg, #FFA500, #FFD700);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
          transform: translateY(-3px);
        }

        /* Error */
        .error {
          color: #ff6b6b;
          font-size: 0.9rem;
          margin-top: 15px;
          z-index: 2;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-heading { font-size: 2rem; }
          .login-form { padding: 30px; }
        }
        @media (max-width: 480px) {
          .login-heading { font-size: 1.6rem; }
          .glow-btn { font-size: 1rem; padding: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Login;
