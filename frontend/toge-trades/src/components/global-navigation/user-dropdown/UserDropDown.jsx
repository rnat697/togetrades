import "./UserDropDown.css";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "../../../api/auth";
import LogoutButton from "../logout-button/LogoutButton";

export default function UserDropDown({ isOpen }) {
  const { user } = useAuth();
  return (
    <div className="user-container">
      <div className="nav-user">
        {/* TODO: change to use auth */}
        <img
          className="image-user"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
        />
        <h2 className="heading-username">{user.username}</h2>
        <IoIosArrowDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
      </div>
      <div className={`username-dropdown ${isOpen ? "open" : ""}`}>
        <div className="dropdown-content">
          {/* TODO: change to use auth */}
          <p className="user-email">johndoe@example.com</p>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
