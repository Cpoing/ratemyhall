import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" Component={Home} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
