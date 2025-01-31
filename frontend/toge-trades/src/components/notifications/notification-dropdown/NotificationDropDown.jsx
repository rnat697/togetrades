import { useEffect, useState } from "react";
import NotificationCard from "../notification-card/NotificationCard";
import "./NotificationDropDown.css";
import { MdNotificationsNone } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { useSocket } from "../../../controllers/SocketProvider";

export default function NotificationDropDown({ isMobileMenu }) {
  const [notifications, setNotifs] = useState([
    {
      id: "381290389012830DT-accept-12897412",
      userImg:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
      username: "myname",
      type: "accept",
      message: " has accepted your request for their Scyther and your Eevee.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: "3812923432830DT-decline-345435534",
      userImg:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
      username: "Username",
      type: "decline",
      message: " has declined your request for their Pikachu and your Eevee.",
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      id: "3812930DT-decline-345435534",
      userImg:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
      username: "Username",
      type: "decline",
      message: " has declined your request for their Pikachu and your Eevee.",
      timestamp: new Date(Date.now() - 2 * 60000),
    },
  ]);

  const [showNotif, setNotifMenu] = useState(false);
  //  TODO: make this scrollable? or limit to 4 at a time

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log("im polling");
    socket.on("getTradeNotification", (data) => {
      console.log(data);
      setNotifs((prev) => [...prev, data]);
    });

    // Clean up the listener on component unmount
    return () => {
      if (socket) {
        socket.off("getTradeNotification");
      }
    };
  }, [socket]);

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
