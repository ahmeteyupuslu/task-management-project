import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LoginPage = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  
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
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleInput}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
