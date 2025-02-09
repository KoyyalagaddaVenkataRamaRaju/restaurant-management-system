import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState(""); // To display error messages
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
  
      // Save token & role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      console.log("Login Successful - Role Set:", localStorage.getItem("role")); // Debugging log
  
      // Delay navigation to ensure localStorage updates
      setTimeout(() => {
        if (role === "owner") {
          navigate("/owner-dashboard");
        } else if (role === "waiter") {
          navigate("/home");
        } else if (role === "cook") {
          navigate("/orders");
        } else {
          setError("Invalid user role.");
        }
      }, 100); // 100ms delay for storage update
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      setError("Invalid credentials. Please try again.");
    }
  };
  
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
