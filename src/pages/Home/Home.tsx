import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import "./Home.css";

const buildings = [
  {
    id: "1",
    name: "PSE 210",
    rating: 4,
    reviews: 12,
  },
  {
    id: "2",
    name: "LAS B",
    rating: 4,
    reviews: 24,
  },
];

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
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
      <Footer />
    </div>
  );
};

export default Home;
