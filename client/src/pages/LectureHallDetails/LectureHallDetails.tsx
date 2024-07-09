import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageModal from "../../components/ImageModal/ImageModal";
import { useUser } from "../../components/UserContext/UserContext";
import { MdDeleteOutline } from "react-icons/md";
import "./LectureHallDetails.css";

const LectureHallDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reviews/${name}`,
        );
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
        const response = await fetch(
          `http://localhost:3000/api/reviews/${reviewId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

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
        <h1>{name}</h1>
        <button className="add-review-button" onClick={handleClick}>
          Add Review
        </button>
        <div className="reviews">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              {review.imageUrl && (
                <img
                  src={`http://localhost:3000${review.imageUrl}`}
                  alt="Review"
                  className="review-image"
                  onClick={() => handleImageClick(review.imageUrl)}
                />
              )}
              <div className="header-content">
                {" "}
                <div className="review-header">
                  <div className="review-rating">
                    {"★".repeat(Math.round(review.rating)) +
                      "☆".repeat(5 - Math.round(review.rating))}{" "}
                    {review.rating}/5
                  </div>
                  <div className="review-buttons-date">
                    {" "}
                    {user && review.userId._id === user.userId && (
                      <MdDeleteOutline
                        className="delete-review-button"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </MdDeleteOutline>
                    )}
                    <div className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default LectureHallDetails;
