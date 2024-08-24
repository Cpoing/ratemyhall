import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import { UserProvider } from "./components/UserContext/UserContext";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import Home from "./pages/Home/Home";
import LectureHallDetails from "./pages/LectureHallDetails/LectureHallDetails";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import AddReview from "./pages/addReview/addReview";
import Footer from "./components/Footer/Footer";
import SearchResults from "./pages/searchResults/searchResults";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <UserProvider>
        <Router>
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
              <Route path="/account-settings" element={<AccountSettings />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
