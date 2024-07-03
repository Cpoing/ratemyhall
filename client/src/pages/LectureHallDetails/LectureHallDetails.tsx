import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LectureHallDetails.css";
//dummy images below, remove later
import reviewhall from "../../images/reviewhall.png";
import deepPurple from "../../images/Deep Purple.jpg";

const LectureHallDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const reviews = [
    {
      user: "User 1",
      rating: 4,
      text: "Great hall, comfortable seats.",
      imageUrl: reviewhall,
    },
    {
      user: "User 2",
      rating: 3,
      text: "Average, could be better.",
      imageUrl: deepPurple,
    },
    {
      user: "User 3",
      rating: 4,
      text: "Meh",
    },
  ];

  const handleClick = () => {
    navigate(`/add-review/${name}`);
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
                />
              )}
              <div className="review-content">
                <div className="review-header">
                  <h3>{review.user}</h3>
                  <div className="review-rating">⭐ {review.rating}/5</div>
                </div>
                <p>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureHallDetails;
