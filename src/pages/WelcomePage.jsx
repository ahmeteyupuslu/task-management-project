import { useNavigate } from 'react-router-dom';
import '../styles/welcomepage.css';
import { jwtDecode } from 'jwt-decode';

const WelcomePage = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    const decoded = jwtDecode(token);
    console.log(decoded);
    const isAdmin = decoded.isAdmin;
    const fullName = decoded.name;
    console.log(fullName);
    const navigate = useNavigate();
    
    const handleUsersClick = () => {
        navigate('/users');
    }

    const handleProjectClick = () => {
        navigate('/projects');
    }
  return (
    <div>
      <h1>Welcome {fullName}!</h1>
      <div className="box1">
      <div className='box2' onClick={handleProjectClick}>Projects</div>
      {isAdmin === true ? (
        <div className='box2' onClick={handleUsersClick}>Users</div>
      ):null}
      </div>
    </div>
  );
};

export default WelcomePage;
