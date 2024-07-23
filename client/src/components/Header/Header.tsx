import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import Cookies from "js-cookie";
import "./Header.css";

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
    Cookies.remove("token");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Rate My Hall</Link>
      </div>
      <nav className="nav">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
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
