import { formatRelativeTime } from "../../utils/utils";
import "./NotificationCard.css";
import { IoIosClose } from "react-icons/io";

export default function NotificationCard({ notification, onRemove }) {
  return (
    <div className="notif-card">
      <div className="notif-content">
        <img className="image-notif" src={notification.senderImg} />
        <div className="message-content">
          <p>
            <span style={{ fontWeight: "bold" }}>
              {notification.senderUsername}
            </span>
            {notification.message}
          </p>
          <p>{formatRelativeTime(new Date(notification.timestamp))}</p>
        </div>
        <div className="notif_close" onClick={() => onRemove(notification.id)}>
          <IoIosClose color="#212A4A" size={"2em"} />
        </div>
      </div>
      <div className="divider-notif" />
    </div>
  );
}
