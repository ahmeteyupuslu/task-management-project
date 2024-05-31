import "../styles/welcomepage.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";

const WelcomePage = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const fullName = decoded.name;

  return (
    <>
      <Navbar />
      <div className="welcome-text">
        <h1>Welcome {fullName}!</h1>
        <h4>
          With this app you can access project that you included.Also you can
          see all task in project. You can comment these tasks.
        </h4>
        <h4>If you have permission you can create projects, users and task.</h4>
      </div>
    </>
  );
};

export default WelcomePage;
