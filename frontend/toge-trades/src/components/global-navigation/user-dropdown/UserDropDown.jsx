import "./UserDropDown.css";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";

import { useAuth } from "../../../api/auth";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import LogoutButton from "../logout-button/LogoutButton";
import { USER_BY_ID_URL } from "../../../api/urls";
import useGet from "../../../hooks/useGet";

export default function UserDropDown({ isMobileOpen }) {
  const [showUserMenu, setUserMenu] = useState(false);
  const { user } = useAuth();
  // const [userInfo, setUserInfo] = useLocalStorage("userInfo");
  const { data: userInfo, refresh } = useGet(
    USER_BY_ID_URL(user._id),
    [],
    true
  );

  const toggleUserMenu = () => {
    if (!isMobileOpen) {
      setUserMenu(!showUserMenu);
    } else {
      setUserMenu(false);
    }
  };


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
