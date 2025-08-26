import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

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

  <h2 className="login-heading text-center">Restaurant Management System</h2>
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
    </div>
  );
};

export default Login;
