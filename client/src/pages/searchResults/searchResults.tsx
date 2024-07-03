import React from "react";
import { Link, useLocation } from "react-router-dom";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import "./searchResults.css";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "ACW";

  const buildings = [
    { id: 1, name: "Accolade West (ACW103)", reviews: 23, rating: 4 },
    { id: 2, name: "Accolade West (ACW104)", reviews: 23, rating: 4 },
    { id: 3, name: "Accolade West (ACW105)", reviews: 23, rating: 4 },
  ];

  return (
    <div className="search-results">
      <h2>Search Results For "{query}"</h2>
      <div className="results-list">
        {buildings.map((building) => (
          <BuildingCard
            id={building.id}
            name={building.name}
            reviews={building.reviews}
            rating={building.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
