import React, { useEffect, useState } from "react";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Home.css";

const Home: React.FC = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/lecture-halls`);
        const data = await response.json();
        setBuildings(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div className="home-page">
      <div className="home-divider">
        {" "}
        <div className="search-section">
          <h1>Enter your Lecture Hall</h1>
          <SearchBar />
        </div>
        <div className="building-list">
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              id={building.id}
              name={building.name}
              rating={building.averageRating}
              reviews={building.reviewCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
