import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import "./Home.css";

const buildings = [
  {
    id: "1",
    name: "PSE 210",
    image: "TODO: IMPORT THE IMAGE HERE",
    rating: 4.5,
    reviews: 12,
    description: "Spacious and modern",
    tags: ["Chargers", "Cold"],
  },
  {
    id: "2",
    name: "LAS B",
    image: "TODO: IMPORT THE IMAGE HERE",
    rating: 4.0,
    reviews: 24,
    description:
      "State-of-the-art facilities for engineering students, very large lecture halls and comfortable seats",
    tags: ["Spacious", "Chargers", "Hot"],
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
          <BuildingCard key={building.id} hall={building} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
