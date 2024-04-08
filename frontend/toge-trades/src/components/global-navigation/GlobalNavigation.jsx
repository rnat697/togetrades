import "./GlobalNavigation.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

import Logo from "../logo/Logo";
import UserDropDown from "./user-dropdown/UserDropDown";
import NotificationDropDown from "../notifications/notification-dropdown/NotificationDropDown";
import LogoutButton from "./logout-button/LogoutButton";

export default function GlobalNavigation() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  return (
    <header className="nav-header">
      <nav className="nav-container">
        <NavLink to="/pokebox" className="nav-logo">
          <Logo />
        </NavLink>
        <div
          className={`nav_menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav-list">
            <li className="nav-item user">
              <UserDropDown isMobileOpen={showMenu} />
            </li>
            <li className="nav-item">
              <NavLink
                to="/pokebox"
                className={(nav) =>
                  nav.isActive ? "nav-link selected-nav" : "nav-link"
                }
                onClick={closeMenu}
              >
                Poke Box
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/incubator"
                className={(nav) =>
                  nav.isActive ? "nav-link selected-nav" : "nav-link"
                }
                onClick={closeMenu}
              >
                Incubator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tradehub"
                className={(nav) =>
                  nav.isActive ? "nav-link selected-nav" : "nav-link"
                }
                onClick={closeMenu}
              >
                Trade Hub
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/pokedex"
                className={(nav) =>
                  nav.isActive ? "nav-link selected-nav" : "nav-link"
                }
                onClick={closeMenu}
              >
                Pokedex
              </NavLink>
            </li>
            <li className="nav-item logout">
              <LogoutButton />
            </li>
          </ul>
          <div
            className="nav_close"
            id="nav-close"
            onClick={() => toggleMenu()}
          >
            <IoIosClose color="#212A4A" size={"2em"} />
          </div>
        </div>
        {!showMenu && (
          <div className="notif" id="notif_toggle">
            <NotificationDropDown isMobileMenu={showMenu} />
          </div>
        )}
        <div
          className="nav_toggle"
          id="nav-toggle"
          onClick={() => toggleMenu()}
        >
          <IoMenu color="#212A4A" size={"1.5em"} />
        </div>
      </nav>
    </header>
  );
}
