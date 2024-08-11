import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import "./ReviewCard.css";

interface ReviewCardProps {
  review: any;
  user: any;
  onDelete: (reviewId: string) => void;
  onImageClick: (imageUrl: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  user,
  onDelete,
  onImageClick,
}) => {
  return (
    <div className="review-card">
      {review.imageUrl && (
        <img
          src={review.imageUrl}
          alt="Review"
          className="review-image"
          onClick={() => onImageClick(review.imageUrl)}
        />
      )}
      <div className="header-content">
        <div className="review-header">
          <div className="review-rating">
            {"★".repeat(Math.round(review.rating)) +
              "☆".repeat(5 - Math.round(review.rating))}{" "}
            {review.rating}/5
          </div>
          <div className="review-buttons-date">
            {user && review.userId._id === user.userId && (
              <MdDeleteOutline
                className="delete-review-button"
                onClick={() => onDelete(review._id)}
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
  );
};

export default ReviewCard;
