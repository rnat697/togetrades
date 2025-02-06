import { useEffect, useState } from "react";
import NotificationCard from "../notification-card/NotificationCard";
import "./NotificationDropDown.css";
import { MdNotificationsNone } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { useSocket } from "../../../controllers/SocketProvider";

export default function NotificationDropDown({ isMobileMenu }) {
  const [notifications, setNotifs] = useState([]);
  const [notifCounter, setnotifCounter] = useState(0);
  const [showNotif, setNotifMenu] = useState(false);
  //  TODO: make this scrollable? or limit to 4 at a time

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("getTradeNotification", (data) => {
      setNotifs((prev) => [...prev, data]);
    });

    // Clean up the listener on component unmount
    return () => {
      if (socket) {
        socket.off("getTradeNotification");
      }
    };
  }, [socket]);

  useEffect(() => {
    setnotifCounter(notifications.length);
  }, [notifications]);

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
        {notifCounter != 0 ? (
          <div className="notif-counter">{notifCounter}</div>
        ) : null}
      </div>
      <div className={`notif-dropdown ${showNotif ? "open" : ""}`}>
        {notifications.length === 0 ? (
          <p>Your notifications are empty.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRemove={handleRemoveNotif}
            />
          ))
        )}
      </div>
    </div>
  );
}
