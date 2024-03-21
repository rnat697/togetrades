import { useState } from "react";
import NotificationCard from "../notification-card/NotificationCard";
import "./NotificationDropDown.css";
import { FaRegBell } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

export default function NotificationDropDown({ isOpen }) {
  const [notifications, setNotifs] = useState([
    {
      id: 12312,
      username: "myname",
      message: " has accepted your request for their Scyther and your Eevee.",
      date: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: 1232,
      username: "Username",
      message: " has declined your request for their Pikachu and your Eevee.",
      date: new Date(Date.now() - 2 * 60000),
    },
    {
      id: 1232,
      username: "Username",
      message: " has declined your request for their Pikachu and your Eevee.",
      date: new Date(Date.now() - 2 * 60000),
    },
    {
      id: 1232,
      username: "Username",
      message: " has declined your request for their Pikachu and your Eevee.",
      date: new Date(Date.now() - 2 * 60000),
    },
  ]);

  const handleRemoveNotif = (notifID) => {
    setNotifs((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== notifID)
    );
  };
  return (
    <div className="notif-container">
      <div className="nav-notif">
        {notifications.length > 0 ? (
          <MdNotificationsActive
            className={`hasNotif ${isOpen ? "selected" : ""}`}
          />
        ) : (
          <MdNotificationsNone
            className={`noNotif ${isOpen ? "selected" : ""}`}
          />
        )}
      </div>
      <div className={`notif-dropdown ${isOpen ? "open" : ""}`}>
        {notifications.length === 0 ? (
          <p>Your notifications are empty.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              notification={notification}
              onRemove={handleRemoveNotif}
            />
          ))
        )}
      </div>
    </div>
  );
}
