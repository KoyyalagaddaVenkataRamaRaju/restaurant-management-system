import React, { useState } from "react";
import { Link,useParams } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tableNumber } = useParams(); // Get tableNumber from URL
  return (
    <nav className="navbar">
      <div className="logo">🍽️ Restaurant</div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <ul className={menuOpen ? "active" : ""}>
        <li><Link to="/home">Home</Link></li>
        <li>
          <Link to={tableNumber ? `/menu/${tableNumber}` : "/home"}>Menu</Link>
        </li>
        <li>
          <Link to={tableNumber ? `/cart/${tableNumber}` : "/home"}>Cart</Link>
        </li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
