import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageModal from "../../components/ImageModal/ImageModal";
import { useUser } from "../../components/UserContext/UserContext";
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
                  src={review.imageUrl}
                  alt="Review"
                  className="review-image"
                  onClick={() => handleImageClick(review.imageUrl)}
                />
              )}
              <div className="review-content">
                <div className="review-header">
                  <div className="review-rating">⭐ {review.rating}/5</div>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <p>{review.text}</p>
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
