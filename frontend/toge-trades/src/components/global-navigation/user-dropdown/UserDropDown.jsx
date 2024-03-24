import "./UserDropDown.css";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";

import { useAuth } from "../../../api/auth";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import LogoutButton from "../logout-button/LogoutButton";
import { userById } from "../../../api/api";

export default function UserDropDown({ isMobileOpen }) {
  const [showUserMenu, setUserMenu] = useState(false);
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useLocalStorage("userInfo");

  const toggleUserMenu = () => {
    if (!isMobile) {
      setUserMenu(!showUserMenu);
    } else {
      setUserMenu(false);
    }
  };

  useEffect(() => {
    // Fetch user's info from server and stores it in localstorage
    async function fetchUserInfo() {
      try {
        const userData = await userById(user._id);

        setUserInfo(userData.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserInfo();
  }, [user._id, setUserInfo]);

  return (
    <div className="user-container">
      <div className="nav-user" onClick={() => toggleUserMenu()}>
        <img className="image-user" src={userInfo.image} />
        <h2 className="heading-username">{userInfo.username}</h2>
        <IoIosArrowDown
          className={`arrow-icon ${showUserMenu ? "rotate" : ""}`}
        />
      </div>
      <div className={`username-dropdown ${showUserMenu ? "open" : ""}`}>
        <div className="dropdown-content">
          <p className="user-email">{userInfo.email}</p>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
