import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import SearchResults from "./pages/searchResults/searchResults";
import LectureHallDetails from "./pages/LectureHallDetails/LectureHallDetails";
import AddReview from "./pages/addReview/addReview";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { UserProvider } from "./components/UserContext/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/building/:id/:name"
                element={<LectureHallDetails />}
              />
              <Route path="/add-review/:name" element={<AddReview />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
};
export default App;
