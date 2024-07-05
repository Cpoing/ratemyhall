import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LectureHallDetails.css";
import ImageModal from "../../components/ImageModal/ImageModal";
//dummy images below, remove later
import reviewhall from "../../images/reviewhall.png";
import deepPurple from "../../images/Deep Purple.jpg";

const LectureHallDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const reviews = [
    {
      rating: 4,
      text: "Great hall, comfortable seats.",
      imageUrl: reviewhall,
      date: "2024-07-01",
    },
    {
      rating: 3,
      text: "Average, could be better.",
      imageUrl: deepPurple,
      date: "2024-07-02",
    },
    {
      rating: 4,
      text: "Meh",
      imageUrl: "",
      date: "2024-07-03",
    },
  ];

  const handleClick = () => {
    navigate(`/add-review/${name}`);
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
