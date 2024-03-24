import { useState } from "react";
import NotificationCard from "../notification-card/NotificationCard";
import "./NotificationDropDown.css";
import { MdNotificationsNone } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

export default function NotificationDropDown({ isMobileMenu }) {
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
      id: 12354,
      username: "Username",
      message: " has declined your request for their Pikachu and your Eevee.",
      date: new Date(Date.now() - 2 * 60000),
    },
    {
      id: 1238,
      username: "Username",
      message: " has declined your request for their Pikachu and your Eevee.",
      date: new Date(Date.now() - 2 * 60000),
    },
  ]);

  const [showNotif, setNotifMenu] = useState(false);
  //  TODO: make this scrollable? or limit to 4 at a time
  const toggleNotifMenu = () => {
    // If mobile menu is open don't show the notifications
    if (!isMobileMenu) {
      setNotifMenu(!showNotif);
    } else {
      setNotifMenu(false);
    }
  };

  const handleRemoveNotif = (notifID) => {
    setNotifs((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== notifID)
    );
  };
  return (
    <div className="notif-container">
      <div className="nav-notif" onClick={toggleNotifMenu}>
        {notifications.length > 0 ? (
          <MdNotificationsActive
            className={`hasNotif ${showNotif ? "selected" : ""}`}
          />
        ) : (
          <MdNotificationsNone
            className={`noNotif ${showNotif ? "selected" : ""}`}
          />
        )}
      </div>
      <div className={`notif-dropdown ${showNotif ? "open" : ""}`}>
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
