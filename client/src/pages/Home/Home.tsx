import React, { useEffect, useState } from "react";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import homeImage from "../../Images/home.png";
import "./Home.css";

const Home: React.FC = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/lecture-halls`);
        const data = await response.json();
        setBuildings(data.slice(0, 6));
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
      <div className="home-info">
        <div className="column-image">
          <img src={homeImage} className="home-info-image" />
          <a
            href="https://www.freepik.com/free-vector/students-studying-textbooks_7732667.htm#fromView=image_search_similar&page=1&position=0&uuid=3dda194a-59f6-43d6-8ac1-e9dc16c7ee1e"
            className="copyright"
          >
            Image by pch.vector on Freepik
          </a>
        </div>
        <div className="home-info-text">
          <h3>Leave a review</h3>
          <p>
            Want to make a change in your lecture hall? Leave a review and let
            others know! This platform gives notice about various issues
            students may have within their learning environments, or just leave
            a review about a particularly good lecture hall too!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
