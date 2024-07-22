import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext/UserContext";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUser();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logged in successfully");
        setError("");

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);

        setUser(data);

        navigate("/");
      } else {
        console.error("Login failed");
        setError("Wrong Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occured while logging in");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        Don't have an account?&nbsp;{" "}
        <Link to={"/register"}> register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
