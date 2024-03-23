import "./LogoutButton.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../api/auth";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const handleLogout = () => {
    console.log("logging out");
    setToken(null);
    navigate("/login");
  };
  return (
    <div className="logout-container">
      <button className="logout-btn" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
