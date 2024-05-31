import React from "react";
import AnkaGeo from "../assets/Ankageo.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/navbar.css";
import LogOut from "./LogOut";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const isAdmin = decoded.isAdmin;
  const navigate = useNavigate();
  const handleUsersClick = () => {
    navigate("/users");
  };

  const handleProjectClick = () => {
    navigate("/projects");
  };
  return (
    <nav className="navbar">
      <div className="logo"><img src={AnkaGeo} alt="AnkaGeo" /></div>
      <div className="navbar-nav">
        <div className="navbar-btns-project" onClick={handleProjectClick}>
          <p>Projects</p><FontAwesomeIcon icon={faBriefcase}/>
        </div>
        {isAdmin === true ? (
          <div className="navbar-btns-users" onClick={handleUsersClick}>
            <p>Users</p><FontAwesomeIcon icon={faUser}/>
          </div>
        ) : null}
        <div className="logout">
        <LogOut/>
      </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
