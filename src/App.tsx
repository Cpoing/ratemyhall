import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SearchResults from "./pages/searchResults/searchResults";
import LectureHallDetails from "./pages/LectureHallDetails/LectureHallDetails";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/search" Component={SearchResults} />
            <Route path="/building/:id/:name" Component={LectureHallDetails} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
