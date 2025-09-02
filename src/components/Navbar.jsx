import React, { useEffect, useState } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { tableNumber } = useParams();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showMenuCart = !location.pathname.startsWith("/home");

  return (
    <>
      <style>
        {`
          .navbar-custom {
            transition: all 0.4s ease-in-out;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            z-index: 1030;
            padding: 14px 20px;
          }

          .navbar-shrink {
            padding: 8px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            backdrop-filter: blur(6px);
          }

          .navbar-brand {
            font-size: 1.8rem;
            font-weight: bold;
            color: #FFD700 !important;
            letter-spacing: 1px;
          }

          .nav-link {
            color: #f0f0f0 !important;
            font-size: 16px;
            font-weight: 500;
            margin: 0 14px;
            position: relative;
            text-decoration: none;
            transition: color 0.3s;
          }

          .nav-link:hover {
            color: #FFD700 !important;
          }

          .nav-link.active {
            font-weight: 600;
            color: #FFD700 !important;
          }

          .nav-link::after {
            content: "";
            display: block;
            height: 2px;
            width: 0%;
            background: #FFD700;
            transition: width 0.3s;
            margin-top: 5px;
          }

          .nav-link:hover::after,
          .nav-link.active::after {
            width: 100%;
          }

          /* Mobile styles */
          @media (max-width: 991px) {
            .mobile-toggle {
              display: block;
              font-size: 28px;
              border: none;
              background: none;
              color: #FFD700;
              cursor: pointer;
            }
            .navbar-bottom {
              display: ${isOpen ? "block" : "none"};
              background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
              padding: 15px;
              border-top: 1px solid rgba(255, 215, 0, 0.3);
            }
            .navbar-bottom ul {
              flex-direction: column !important;
              align-items: flex-start;
            }
            .nav-link {
              margin: 12px 0;
            }
          }

          @media (min-width: 992px) {
            .mobile-toggle {
              display: none;
            }
          }
        `}
      </style>

      <nav
        className={`fixed-top navbar-custom ${
          scrolled ? "navbar-shrink" : ""
        }`}
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Brand Logo / Title (left) */}
          <NavLink to="/" className="navbar-brand">
            🍽️ Royal Dining
          </NavLink>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center ms-auto">
            <ul className="navbar-nav d-flex flex-row align-items-center mb-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </li>

              {showMenuCart && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={tableNumber ? `/menu/${tableNumber}` : "/home"}
                    >
                      Menu
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={tableNumber ? `/cart/${tableNumber}` : "/home"}
                    >
                      Cart
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" to="/orders">
                  Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/owner-dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Mobile toggle (right aligned) */}
          <div className="d-lg-none ms-auto">
            <button
              className="mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="navbar-bottom d-lg-none">
          <ul className="navbar-nav d-flex flex-column mb-0">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/home"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>

            {showMenuCart && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={tableNumber ? `/menu/${tableNumber}` : "/home"}
                    onClick={() => setIsOpen(false)}
                  >
                    Menu
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={tableNumber ? `/cart/${tableNumber}` : "/home"}
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/orders"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/owner-dashboard"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: scrolled ? "70px" : "100px" }}></div>
    </>
  );
}

export default Navbar;
