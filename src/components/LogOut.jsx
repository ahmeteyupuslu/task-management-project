import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
const LogOut = () => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <FontAwesomeIcon
      icon={faRightFromBracket}
      onClick={handleLogOut}
      className="logout-icon"
      title="Log Out"
    />
  );
};

export default LogOut;
