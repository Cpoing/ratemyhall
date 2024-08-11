import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import Cookies from "js-cookie";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { MdOutlineManageAccounts } from "react-icons/md";
import "./Header.css";

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
    Cookies.remove("token");
    setDropdownOpen(false);
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (welcomeRef.current && dropdownRef.current) {
      dropdownRef.current.style.width = `${welcomeRef.current.offsetWidth}px`;
    }
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">RateMyHall</Link>
      </div>
      <nav className="nav">
        {user ? (
          <div className="dropdown">
            <span className="welcome" onClick={toggleDropdown} ref={welcomeRef}>
              Welcome, {user.name} 👋
              <span className="dropdown-arrow">{<MdKeyboardArrowDown />}</span>
            </span>
            <div
              className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="account-settings"
                onClick={handleAccountSettings}
              >
                {<MdOutlineManageAccounts />}&nbsp; Account Settings
              </button>
              <button onClick={handleLogout} className="logout-button">
                {<PiSignOut />}&nbsp; Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
