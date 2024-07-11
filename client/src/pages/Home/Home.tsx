import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import "./Home.css";

const Home: React.FC = () => {
  const [buildings, setBuildings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/lecture-halls");
        const data = await response.json();
        setBuildings(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  });

  return (
    <div className="home-page">
      <div className="search-section">
        <h1>Enter your building or Lecture Hall</h1>
        <SearchBar />
      </div>
      <div className="building-list">
        {buildings.map((building) => (
          <BuildingCard
            key={building.id}
            id={building.id}
            name={building.name}
            rating={building.rating}
            reviews={building.reviews}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
