import React from "react";
import "./ImageModal.css";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="image-modal">
      <div className="image-modal-content">
        <span className="image-modal-close" onClick={onClose}>
          &times;
        </span>
        <img
          src={`https://ratemyhall-api.onrender.com${imageUrl}`}
          alt="Expanded View"
          className="image-modal-image"
        />
      </div>
    </div>
  );
};

export default ImageModal;
