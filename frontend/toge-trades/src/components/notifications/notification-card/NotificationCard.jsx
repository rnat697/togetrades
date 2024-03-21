import "./NotificationCard.css";
import { IoIosClose } from "react-icons/io";

export default function NotificationCard({ notification, onRemove }) {
  const getTimeDifference = (notificationDate) => {
    const currentTime = new Date();
    const timeDifference = currentTime - notificationDate;

    // Convert milliseconds to minutes
    const minutes = Math.floor(timeDifference / 60000);

    // Convert minutes to hours and minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours} hours and ${remainingMinutes} minutes ago`;
    } else {
      return `${minutes} minutes ago`;
    }
  };

  return (
    <div className="notif-card">
      <div className="notif-content">
        <img
          className="image-notif"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
        />
        <div className="message-content">
          <p>
            <span style={{ fontWeight: "bold" }}>{notification.username}</span>
            {notification.message}
          </p>
          <p>{getTimeDifference(notification.date)}</p>
        </div>
        <div className="notif_close" onClick={() => onRemove(notification.id)}>
          <IoIosClose color="#212A4A" size={"2em"} />
        </div>
      </div>
      <div class="divider"></div>
    </div>
  );
}
