import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/privacy">Privacy</a>•<a href="/terms">Terms</a> •
        <a className="rights">All Rights Reserved</a>
      </div>
    </footer>
  );
};

export default Footer;
