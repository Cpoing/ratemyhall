import React, { useState } from "react";
import "./addReview.css";
import { useNavigate } from "react-router-dom";

const AddReview: React.FC = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    if (review.trim() && rating > 0) {
      const newReview = {
        rating,
        review,
        user: "Current User", // Replace with actual user data later
      };

      console.log("Review Submitted:", newReview);
      // Implement API call to submit the review

      navigate(-1);
    } else {
      alert("Please provide a rating and review text.");
    }
  };

  return (
    <div className="add-review">
      <h1>Add a Review</h1>
      <div className="rating-container">
        <label>Give this lecture hall a rating:</label>
        <div className="rating-boxes">
          {[0, 1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`rating-box ${num <= rating ? "selected" : ""}`}
              onClick={() => handleRatingChange(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="review-container">
        <div className="give-review">
          <label htmlFor="review">Write a review:</label>
        </div>
        <textarea
          id="review"
          placeholder="What do you want others to know about this lecture hall?"
          value={review}
          onChange={handleReviewChange}
          maxLength={200}
        />
        <div className="word-count">{review.split(" ").length}/200</div>
      </div>
      <button className="submit-review-btn" onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
