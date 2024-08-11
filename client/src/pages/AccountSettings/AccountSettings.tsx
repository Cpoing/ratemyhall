import React, { useState, useEffect } from "react";
import { useUser } from "../../components/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import ImageModal from "../../components/ImageModal/ImageModal";
import "./AccountSettings.css";

const AccountSettings: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("settings");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
          setName(user?.name || "");
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
  }, [backendUrl, user?.name]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${backendUrl}/api/user-reviews`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError("Failed to fetch user reviews");
      }
    };
    if (currentSection === "reviews") {
      fetchUserReviews();
    }
  }, [currentSection, backendUrl]);

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

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="account-settings-page">
      <div className="account-settings-nav">
        <button onClick={() => setCurrentSection("settings")}>
          Account Settings
        </button>
        <button onClick={() => setCurrentSection("reviews")}>Reviews</button>
      </div>
      <div className="account-divider"></div>
      <div className="account-content">
        {currentSection === "settings" && (
          <div className="account-settings">
            {user && (
              <div>
                <p>
                  <strong>Name:</strong> {name}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Password:</strong> ********
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
        )}
        {currentSection === "reviews" && (
          <div className="account-reviews">
            {reviews.length === 0 ? (
              <p>No reviews found</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  user={user}
                  onDelete={() => {}}
                  onImageClick={handleImageClick}
                />
              ))
            )}
          </div>
        )}
      </div>
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AccountSettings;
