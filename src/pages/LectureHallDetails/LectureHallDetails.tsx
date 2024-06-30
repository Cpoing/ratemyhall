import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LectureHallDetails.css";

const LectureHallDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const reviews = [
    { user: "User 1", rating: 4, text: "Great hall, comfortable seats." },
    { user: "User 2", rating: 3, text: "Average, could be better." },
    { user: "User 3", rating: 4, text: "Good acoustics." },
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
              <div className="review-header">
                <h3>{review.user}</h3>
                <div className="review-rating">⭐ {review.rating}/5</div>
              </div>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureHallDetails;
