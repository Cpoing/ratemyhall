import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import "./searchResults.css";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(
        `https://ratemyhall-api.onrender.com/api/search?q=${query}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Failed to fetch search results:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="search-results">
      <h2>Search Results For "{query}"</h2>
      <div className="results-list">
        {searchResults.map((building) => (
          <BuildingCard
            key={building.id}
            id={building.id}
            name={building.name}
            reviews={building.reviewCount}
            rating={building.averageRating}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
