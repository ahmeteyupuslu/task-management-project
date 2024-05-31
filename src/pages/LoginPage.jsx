import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import logo from "../assets/ankaSymbol.png";
import ankageo from "../assets/Ankageo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const notify = () => toast.error("Invalid username or password");
  const navigate = useNavigate();

  const handleInput = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/login", values)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          localStorage.setItem("token", res.data.accessToken);
          navigate("/welcome");
        } else {
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
        notify();
      });
  };

  useEffect(() => {
    document.body.setAttribute("class", "login-page");
    return () => {
      document.body.setAttribute("class", "");
    };
  });

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-logo">
            <img src={logo}></img>
            <img src={ankageo}></img>
          </div>
          <div className="vr"></div>
          <form onSubmit={handleInput} className="login-form">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default LoginPage;
