import React from "react";
import { useNavigate } from "react-router-dom";
import "./BuildingCard.css";

interface BuildingCardProps {
  id: number;
  name: string;
  rating: number;
  reviews: number;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  id,
  name,
  rating,
  reviews,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/building/${id}/${encodeURIComponent(name)}`);
  };

  return (
    <div className="building-card" onClick={handleClick}>
      <h2>{name}</h2>
      <div className="building-card-rating">
        {"★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))}
        <span>{reviews} reviews</span>
      </div>
    </div>
  );
};

export default BuildingCard;
