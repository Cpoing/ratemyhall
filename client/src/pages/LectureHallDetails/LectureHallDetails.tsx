import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageModal from "../../components/ImageModal/ImageModal";
import { useUser } from "../../components/UserContext/UserContext";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { PiNotePencilBold } from "react-icons/pi";
import "./LectureHallDetails.css";

const LectureHallDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/reviews/${name}`);
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [name]);

  const handleClick = () => {
    if (user) {
      navigate(`/add-review/${name}`);
    } else {
      navigate("/login");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDelete = async (reviewId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone.",
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${backendUrl}/api/reviews/${reviewId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setReviews(reviews.filter((review) => review._id !== reviewId));
        } else {
          const errorData = await response.json();
          console.error(`Error: ${errorData.message}`);
          alert(`Error: ${errorData.message}`);
        }
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Error deleting review");
      }
    }
  };

  return (
    <div className="Lecture-hall-details">
      <div className="lecture-wrapper">
        <div className="lecture-divider">
          <div className="lecture-header">
            <h1>{name}</h1>
            <button className="add-review-button" onClick={handleClick}>
              <PiNotePencilBold /> &nbsp;Rate this hall
            </button>
          </div>
        </div>
        {reviews.length === 0 ? (
          <p className="empty">
            😥 No reviews yet, be the first to review this lecture hall
          </p>
        ) : (
          <div className="reviews">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                review={review}
                user={user}
                onDelete={handleDelete}
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        )}
      </div>
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default LectureHallDetails;
