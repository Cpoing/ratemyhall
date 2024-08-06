import React, { useEffect, useState } from "react";
import { useUser } from "../../components/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./AccountSettings.css";

const AccountSettings: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${backendUrl}/api/user-info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info");
      }
    };

    fetchUserInfo();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${backendUrl}/api/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account");
    }
  };

  return (
    <div className="account-settings-page">
      <h1>Account Settings</h1>
      {error && <p className="error-message">{error}</p>}
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button
            onClick={handleDeleteAccount}
            className="delete-account-button"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
