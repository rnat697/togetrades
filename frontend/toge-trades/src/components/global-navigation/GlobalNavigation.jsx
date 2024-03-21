import "./GlobalNavigation.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

import Logo from "../logo/Logo";
// pokebox incubator tradehub pokedex notification-bell username

export default function GlobalNavigation() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    console.log(!showMenu);
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
              <img
                className="user-img"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
              />
              <h2 className="heading-username">username</h2>
            </li>
            <li className="nav-item">
              <NavLink to="/pokebox" className="nav-link" onClick={closeMenu}>
                Poke Box
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/incubator" className="nav-link" onClick={closeMenu}>
                Incubator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tradehub" className="nav-link" onClick={closeMenu}>
                Trade Hub
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/pokedex" className="nav-link" onClick={closeMenu}>
                Pokedex
              </NavLink>
            </li>
            <li className="nav-item logout">
              <button className="logout-btn"> Log out </button>
            </li>
          </ul>
          <div
            className="nav_close"
            id="nav-close"
            onClick={() => toggleMenu()}
          >
            <IoIosClose />
          </div>
        </div>
        <div className="nav-item notif">
          <FaRegBell />
        </div>
        <div
          className="nav_toggle"
          id="nav-toggle"
          onClick={() => toggleMenu()}
        >
          <IoMenu />
        </div>
      </nav>
    </header>
  );
}
